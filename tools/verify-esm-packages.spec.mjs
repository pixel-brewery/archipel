// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { verifyEsmPackages, verifyPackedFileList } from './verify-esm-packages.mjs';

// #endregion

const notice = 'MIT License\n\nPermission is hereby granted to synthetic fixture consumers.\n';
const manifest = () => ({
    name: '@pixel-brewery/archipel-platform-demo',
    version: '1.2.3',
    type: 'module',
    license: 'MIT',
    main: './src/index.js',
    types: './src/index.d.ts',
    exports: {
        '.': { types: './src/index.d.ts', import: './src/index.js' },
        './provider': { types: './src/provider/index.d.ts', import: './src/provider/index.js' },
    },
});
const packedFiles = ['package.json', 'README.md', 'LICENSE', 'src/index.js', 'src/index.d.ts', 'src/provider/index.js', 'src/provider/index.d.ts'];
let root;

function write(relative, text) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
}
function built(change = {}) {
    write('dist/libs/platform-demo/package.json', JSON.stringify({ ...manifest(), ...change }));
}

const corpusFiles = {
    packages: 'platform-mapping/api/Class.MappingService.md',
    guides: 'releases.md',
    patterns: 'public-pattern.md',
};
function mcpFixture() {
    fs.renameSync(path.join(root, 'libs/platform-demo'), path.join(root, 'tools/mcp'));
    fs.mkdirSync(path.join(root, 'dist/tools'), { recursive: true });
    fs.renameSync(path.join(root, 'dist/libs/platform-demo'), path.join(root, 'dist/tools/mcp'));
    for (const directory of ['tools/mcp', 'dist/tools/mcp']) {
        const filename = path.join(root, directory, 'package.json');
        const metadata = JSON.parse(fs.readFileSync(filename, 'utf8'));
        metadata.name = '@pixel-brewery/archipel-mcp';
        write(`${directory}/package.json`, JSON.stringify(metadata));
    }
    for (const [corpus, filename] of Object.entries(corpusFiles)) {
        const markdown = `# Current public ${corpus} documentation\n\n[source](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-mapping/src/services/MappingService.ts)\n`;
        write(`.docs/${corpus}/${filename}`, markdown);
        write(`dist/tools/mcp/data/${corpus}/${filename}`, markdown);
    }
}

beforeEach(() => {
    root = fs.mkdtempSync(path.join(tmpdir(), 'archipel-esm-verifier-'));
    fs.mkdirSync(path.join(root, 'tools'));
    write('LICENSE', notice);
    write('libs/platform-demo/package.json', JSON.stringify(manifest()));
    write('libs/platform-demo/src/index.ts', "export { value } from './dependency.js';\n");
    write('libs/platform-demo/src/dependency.ts', 'export const value = 1;\n');
    built();
    for (const file of packedFiles.filter((file) => file !== 'package.json'))
        write(
            `dist/libs/platform-demo/${file}`,
            file === 'LICENSE' ? notice : file.endsWith('.js') ? 'export const value = 1;\n' : 'Synthetic fixture content.\n',
        );
    vi.spyOn(process.stdout, 'write').mockReturnValue(true);
});

afterEach(() => {
    vi.restoreAllMocks();
    fs.rmSync(root, { recursive: true, force: true });
});

describe('built package ESM verification', () => {
    it('checks the actual source imports and every built subpath entry and notice', async () => {
        // Arrange
        const options = { root };
        // Act
        const count = await verifyEsmPackages(options);
        // Assert
        expect(count).toBe(1);
    });

    it.each(['src/index.js', 'src/index.d.ts', 'src/provider/index.js', 'src/provider/index.d.ts', 'LICENSE'])(
        'rejects an incomplete built package missing %s',
        async (file) => {
            // Arrange
            fs.rmSync(path.join(root, 'dist/libs/platform-demo', file));
            // Act
            const result = verifyEsmPackages({ root });
            // Assert
            await expect(result).rejects.toThrow('Missing installed package file');
        },
    );

    it('rejects stale build versions before they can be published', async () => {
        // Arrange
        built({ version: '1.2.2' });
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('stale package identity or version');
    });

    it('rejects an advertised CLI that is absent from the build output', async () => {
        // Arrange
        built({ bin: { 'archipel-demo': './src/bin.js' } });
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('src/bin.js');
    });

    it('rejects CommonJS in built runtime code', async () => {
        // Arrange
        write('dist/libs/platform-demo/src/index.js', 'module.exports = {};\n');
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('contains CommonJS output');
    });

    it('rejects extensionless source imports that would fail in installed ESM', async () => {
        // Arrange
        write('libs/platform-demo/src/index.ts', "export { value } from './dependency';\n");
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('relative specifier without a file extension');
    });

    it('rejects a built license that differs from the repository notice', async () => {
        // Arrange
        write('dist/libs/platform-demo/LICENSE', `${notice}Unreviewed extra terms.\n`);
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('differs from the repository notice');
    });
});

describe('the MCP build documentation corpus', () => {
    it('requires every nested source Markdown filename and byte sequence in all three copied corpora', async () => {
        // Arrange
        mcpFixture();
        // Act
        const count = await verifyEsmPackages({ root });
        // Assert
        expect(count).toBe(1);
    });

    it.each(['packages', 'guides', 'patterns'])('rejects stale copied %s Markdown despite otherwise valid build output', async (corpus) => {
        // Arrange
        mcpFixture();
        write(
            `dist/tools/mcp/data/${corpus}/${corpusFiles[corpus]}`,
            '# Previous cached output\n\n[source](https://github.com/pixel-brewery/archipel/blob/main/MappingService.ts)\n',
        );
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow(`copied documentation differs from its source: data/${corpus}/`);
    });

    it.each(['packages', 'guides', 'patterns'])('rejects a missing copied %s document', async (corpus) => {
        // Arrange
        mcpFixture();
        fs.rmSync(path.join(root, 'dist/tools/mcp/data', corpus, corpusFiles[corpus]));
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow(`missing copied file: data/${corpus}/`);
    });

    it.each(['packages', 'guides', 'patterns'])('rejects a stale extra %s document absent from the current source corpus', async (corpus) => {
        // Arrange
        mcpFixture();
        write(`dist/tools/mcp/data/${corpus}/obsolete.md`, '# Removed source documentation\n');
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow(`unexpected copied file: data/${corpus}/obsolete.md`);
    });

    it('rejects unexpected non-Markdown files in a Markdown-only copied corpus', async () => {
        // Arrange
        mcpFixture();
        write('dist/tools/mcp/data/guides/unexpected.json', '{"synthetic":"obsolete"}');
        // Act
        const result = verifyEsmPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('unexpected copied file: data/guides/unexpected.json');
    });
});

describe('the actual npm archive file inventory', () => {
    it('accepts complete ESM and CLI entry points while allowing declaration files and packaged documentation', () => {
        // Arrange
        const pkg = { ...manifest(), bin: { demo: './src/bin.js' } };
        const files = [...packedFiles, 'src/bin.js', 'data/guides/fixture.md'];
        // Act
        const verify = () => verifyPackedFileList(pkg, files);
        // Assert
        expect(verify).not.toThrow();
    });

    it.each(['src/index.js', 'src/provider/index.d.ts', 'LICENSE', 'README.md'])('rejects npm file filtering that omitted %s', (missing) => {
        // Arrange
        const files = packedFiles.filter((file) => file !== missing);
        // Act
        const verify = () => verifyPackedFileList(manifest(), files);
        // Assert
        expect(verify).toThrow('archive is missing installed package file');
    });

    it.each([
        'src/index.ts',
        'src/index.js.map',
        'src/index.spec.js',
        '.env',
        '.env.local',
        '.npmrc',
        'keys/release.pem',
        'node_modules/copied/index.js',
        '.git/config',
    ])('rejects unwanted private, source or test files: %s', (unwanted) => {
        // Arrange
        const files = [...packedFiles, unwanted];
        // Act
        const verify = () => verifyPackedFileList(manifest(), files);
        // Assert
        expect(verify).toThrow('private configuration, source, tests or source maps');
    });

    it.each(['../outside.js', '/absolute.js', 'C:/absolute.js', 'src\\index.js', 'src/../outside.js', 'src/./index.js', 'src/private\n.js'])(
        'rejects ambiguous or escaping archive paths: %s',
        (invalid) => {
            // Arrange
            const files = [...packedFiles, invalid];
            // Act
            const verify = () => verifyPackedFileList(manifest(), files);
            // Assert
            expect(verify).toThrow('invalid, duplicate or escaping file paths');
        },
    );

    it('rejects a lifecycle hook that could run during consumer installation', () => {
        // Arrange
        const pkg = { ...manifest(), scripts: { postinstall: 'node unexpected.js' } };
        // Act
        const verify = () => verifyPackedFileList(pkg, packedFiles);
        // Assert
        expect(verify).toThrow('installation or publication hooks');
    });

    it('rejects CommonJS export conditions', () => {
        // Arrange
        const pkg = { ...manifest(), exports: { '.': { require: './src/index.js' } } };
        // Act
        const verify = () => verifyPackedFileList(pkg, packedFiles);
        // Assert
        expect(verify).toThrow('ESM conditions only');
    });
});
