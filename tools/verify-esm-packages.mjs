// #region Imports

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// #endregion

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceExtensions = new Set(['.ts', '.mts']);
const runtimeExtensions = ['.js', '.mjs', '.json', '.node', '.wasm'];

/**
 * Checks source ESM contracts, built entry points, package metadata, and the copied MCP documentation corpus.
 *
 * @param options Optional workspace root for the read-only check.
 * @returns The verified package count after every source and build contract succeeds.
 * @throws When any package is incomplete or contains incompatible ESM output.
 * @internal
 */
export async function verifyEsmPackages({ root = workspaceRoot } = {}) {
    const ts = (await import('typescript')).default;
    const packageRoots = ['libs', 'tools'].flatMap((parent) =>
        fs
            .readdirSync(path.join(root, parent), { withFileTypes: true })
            .filter((entry) => entry.isDirectory())
            .map((entry) => path.join(root, parent, entry.name))
            .filter((directory) => fs.existsSync(path.join(directory, 'package.json'))),
    );
    const errors = [];
    for (const packageRoot of packageRoots) {
        const relativeRoot = path.relative(root, packageRoot).replaceAll('\\', '/');
        const manifest = readJson(path.join(packageRoot, 'package.json'));
        if (manifest.type !== 'module') errors.push(`${relativeRoot}/package.json must declare "type": "module".`);
        if (relativeRoot.startsWith('libs/') && !manifest.exports) errors.push(`${relativeRoot}/package.json must define an ESM exports map.`);
        checkExports(manifest.exports, `${relativeRoot}/package.json#exports`, errors);
        for (const [dependency, range] of Object.entries(manifest.peerDependencies ?? {})) {
            if (dependency.startsWith('@nestjs/') && range !== '^12.0.0') errors.push(`${relativeRoot} has non-NestJS-12 peer range ${dependency}@${range}.`);
        }
        for (const sourceFile of walkFiles(packageRoot, sourceExtensions)) {
            const text = fs.readFileSync(sourceFile, 'utf8');
            const source = ts.createSourceFile(sourceFile, text, ts.ScriptTarget.Latest, true, sourceFile.endsWith('.mts') ? ts.ScriptKind.TS : undefined);
            const report = (node, message) => {
                const position = source.getLineAndCharacterOfPosition(node.getStart(source));
                errors.push(`${path.relative(root, sourceFile).replaceAll('\\', '/')}:${position.line + 1} ${message}.`);
            };
            const specifier = (node) => {
                if (!node || !ts.isStringLiteralLike(node)) return;
                if (node.text.startsWith('.') && !runtimeExtensions.some((extension) => node.text.endsWith(extension))) {
                    report(node, `uses relative specifier without a file extension: ${JSON.stringify(node.text)}`);
                }
            };
            const visit = (node) => {
                if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) specifier(node.moduleSpecifier);
                else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) specifier(node.arguments[0]);
                else if (ts.isImportTypeNode(node)) specifier(node.argument.literal);
                else if (ts.isImportEqualsDeclaration(node)) report(node, 'uses a TypeScript import-equals declaration');
                ts.forEachChild(node, visit);
            };
            visit(source);
        }
        const outputRoot = path.join(root, 'dist', relativeRoot);
        const builtManifest = path.join(outputRoot, 'package.json');
        if (!fs.existsSync(builtManifest)) {
            errors.push(`${relativeRoot} has no build output. Run its Nx build target first.`);
            continue;
        }
        const built = readJson(builtManifest);
        if (built.name !== manifest.name || built.version !== manifest.version)
            errors.push(`dist/${relativeRoot}/package.json has stale package identity or version. Rebuild before publishing.`);
        checkExports(built.exports, `dist/${relativeRoot}/package.json#exports`, errors);
        try {
            const targets = requiredFiles(built);
            const canonicalOutput = fs.realpathSync(outputRoot);
            for (const target of targets) {
                const file = path.join(outputRoot, target);
                let actual;
                try {
                    actual = fs.realpathSync(file);
                } catch {
                    throw new Error(`Missing installed package file: ${target}.`);
                }
                if (!inside(canonicalOutput, actual) || !fs.statSync(file).isFile())
                    throw new Error(`Package file escapes its output directory or is not regular: ${target}.`);
            }
            const license = fs.readFileSync(path.join(outputRoot, 'LICENSE'), 'utf8');
            if (!license.includes('MIT License') || !license.includes('Permission is hereby granted'))
                throw new Error('The built MIT license notice is missing or incomplete.');
            if (license !== fs.readFileSync(path.join(root, 'LICENSE'), 'utf8')) throw new Error('The built MIT license differs from the repository notice.');
        } catch (error) {
            errors.push(`dist/${relativeRoot}: ${error.message}`);
        }
        if (manifest.name === '@pixel-brewery/archipel-mcp') verifyMcpDocumentation(root, outputRoot, errors);
        for (const outputFile of walkFiles(outputRoot, new Set(['.js', '.mjs']))) {
            const text = fs.readFileSync(outputFile, 'utf8');
            if (/\bmodule\.exports\b|\brequire\s*\(|\bexports\.[A-Za-z_$][\w$]*\s*=/u.test(text)) {
                errors.push(`${path.relative(root, outputFile).replaceAll('\\', '/')} contains CommonJS output.`);
            }
        }
    }
    if (errors.length) throw new Error(`ESM verification failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
    process.stdout.write(`Verified ${packageRoots.length} ESM packages, built entry points, and MIT license notices.\n`);
    return packageRoots.length;
}

/**
 * Verifies the actual file inventory returned by npm pack, including every advertised installed entry.
 *
 * @param manifest The built manifest used to create this archive.
 * @param files Exact relative paths from npm pack's JSON result.
 * @returns Completion when the archive's public contract is complete and no private/source artifacts ship.
 * @throws When an entry point or notice is absent, paths escape the package, or unwanted files are packed.
 * @remarks This inspects the real pack result; checking the unfiltered build directory cannot prove npm's file selection.
 * @internal
 */
export function verifyPackedFileList(manifest, files) {
    if (!Array.isArray(files) || files.length === 0 || files.length > 25_000)
        throw new Error('The packed file inventory is missing or exceeds its entry budget.');
    const inventory = new Set();
    for (const entry of files) {
        if (typeof entry !== 'string' || !safePath(entry) || inventory.has(entry))
            throw new Error('The archive contains invalid, duplicate or escaping file paths.');
        if (
            /(?:^|\/)(?:node_modules|\.git)(?:\/|$)/u.test(entry) ||
            /(?:^|\/)(?:\.env(?:\.[^/]*)?|\.npmrc|auth\.json|id_rsa|id_ed25519)$/u.test(entry) ||
            /\.(?:pem|key|map)$/iu.test(entry) ||
            /\.(?:spec|test)\.[cm]?js$/iu.test(entry) ||
            (/\.[cm]?tsx?$/iu.test(entry) && !/\.d\.[cm]?ts$/iu.test(entry))
        )
            throw new Error('The archive contains private configuration, source, tests or source maps.');
        inventory.add(entry);
    }
    for (const target of requiredFiles(manifest)) {
        if (!inventory.has(target)) throw new Error(`The archive is missing installed package file: ${target}.`);
    }
}

function verifyMcpDocumentation(root, outputRoot, errors) {
    for (const corpus of ['packages', 'guides', 'patterns']) {
        const sourceRoot = path.join(root, '.docs', corpus);
        const copiedRoot = path.join(outputRoot, 'data', corpus);
        if (![sourceRoot, copiedRoot].every((directory) => fs.existsSync(directory) && fs.lstatSync(directory).isDirectory())) {
            errors.push(`MCP documentation corpus ${corpus} requires source and copied directories.`);
            continue;
        }
        const sourceFiles = new Map(walkFiles(sourceRoot, new Set(['.md'])).map((file) => [path.relative(sourceRoot, file).replaceAll('\\', '/'), file]));
        const copiedFiles = new Map(walkFiles(copiedRoot).map((file) => [path.relative(copiedRoot, file).replaceAll('\\', '/'), file]));
        for (const [filename, sourceFile] of sourceFiles) {
            const copiedFile = copiedFiles.get(filename);
            if (!copiedFile) errors.push(`MCP documentation is missing copied file: data/${corpus}/${filename}.`);
            else if (!fs.readFileSync(sourceFile).equals(fs.readFileSync(copiedFile)))
                errors.push(`MCP copied documentation differs from its source: data/${corpus}/${filename}.`);
        }
        for (const filename of copiedFiles.keys()) {
            if (!sourceFiles.has(filename)) errors.push(`MCP documentation contains an unexpected copied file: data/${corpus}/${filename}.`);
        }
    }
}

function requiredFiles(manifest) {
    if (manifest?.type !== 'module' || manifest.license !== 'MIT') throw new Error('Published packages must declare their ESM format and MIT license.');
    const files = new Set(['package.json', 'README.md', 'LICENSE']);
    const add = (value) => {
        if (typeof value !== 'string' || !value.startsWith('./') || !safePath(value.slice(2)) || value.includes('*')) {
            throw new Error('Package entry points must name concrete files inside the package.');
        }
        files.add(value.slice(2));
    };
    const visit = (value) => {
        if (value === null || value === undefined) return;
        if (typeof value === 'string') {
            add(value);
            return;
        }
        if (Array.isArray(value)) {
            value.forEach(visit);
            return;
        }
        if (typeof value !== 'object' || Object.hasOwn(value, 'require')) throw new Error('Package exports must expose ESM conditions only.');
        Object.values(value).forEach(visit);
    };
    visit(manifest.exports);
    for (const field of ['main', 'module', 'types', 'typings']) if (manifest[field] !== undefined) add(manifest[field]);
    if (typeof manifest.bin === 'string') add(manifest.bin);
    else if (manifest.bin && typeof manifest.bin === 'object' && !Array.isArray(manifest.bin)) Object.values(manifest.bin).forEach(add);
    else if (manifest.bin !== undefined) throw new Error('Package bin entries must name concrete executable files.');
    if (!manifest.exports && !manifest.main && !manifest.bin) throw new Error('A package must advertise an installed library or CLI entry point.');
    for (const hook of ['preinstall', 'install', 'postinstall', 'prepare', 'prepublish', 'prepublishOnly']) {
        if (Object.hasOwn(manifest.scripts ?? {}, hook)) throw new Error('Published Archipel packages must not carry installation or publication hooks.');
    }
    return files;
}

function checkExports(value, location, errors) {
    if (!value || typeof value === 'string') return;
    if (Array.isArray(value)) {
        value.forEach((entry, index) => checkExports(entry, `${location}[${index}]`, errors));
        return;
    }
    if (Object.hasOwn(value, 'require')) errors.push(`${location} exposes a CommonJS require condition.`);
    for (const [key, entry] of Object.entries(value)) checkExports(entry, `${location}.${key}`, errors);
}
function safePath(value) {
    return (
        Boolean(value) &&
        value.length <= 4096 &&
        !value.startsWith('/') &&
        !value.includes('\\') &&
        !/[\u0000-\u001f\u007f]/u.test(value) &&
        !/^[A-Za-z]:/u.test(value) &&
        !value.split('/').some((part) => !part || part === '.' || part === '..')
    );
}
function inside(root, file) {
    const relative = path.relative(root, file);
    return Boolean(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function walkFiles(root, extensions) {
    const result = [];
    const pending = [root];
    while (pending.length) {
        const current = pending.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const file = path.join(current, entry.name);
            if (entry.isSymbolicLink()) throw new Error('Package trees must not contain symbolic links.');
            if (entry.isDirectory()) pending.push(file);
            else if (!extensions || extensions.has(path.extname(entry.name))) result.push(file);
        }
    }
    return result;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    try {
        await verifyEsmPackages();
    } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : 'ESM verification failed.'}\n`);
        process.exitCode = 1;
    }
}
