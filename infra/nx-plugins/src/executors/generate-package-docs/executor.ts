/**
 * NX Executor: generate-package-docs
 *
 * Generates API documentation for a single NX library package using TypeDoc.
 * All project-specific values (name, paths, entry points) are derived from
 * the NX project graph and the library's own package.json.
 *
 * Output: .docs/packages/{projectName}/api/
 *
 * Post-processing:
 * - Removes README.md (package readme - already exists as manual docs)
 * - Removes _media directory (typedoc-plugin-markdown copies full dependency trees)
 * - Renames globals.md → index.md (API listing)
 * - Rewrites internal links for VitePress compatibility
 * - Escapes angle brackets for Vue/VitePress
 * - Normalizes frontmatter with generated flag
 * - Strips TypeDoc package back-links
 * - Resolves unresolved {@link} TSDoc references
 */

import type { ExecutorContext } from '@nx/devkit';
import { logger } from '@nx/devkit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { TypeDocOptions } from 'typedoc' with { 'resolution-mode': 'import' };
import type { PluginOptions } from 'typedoc-plugin-markdown' with { 'resolution-mode': 'import' };

import {
    countMarkdownFiles,
    escapeAngleBrackets,
    normalizeFrontmatter,
    resolveInlineLinks,
    rewriteLinks,
    stripPackageBackLink,
    stripTrailingWhitespace,
} from '../../utils/markdown-processing';

export interface IGeneratePackageDocsOptions {
    outputDir?: string;
}

export default async function runExecutor(options: IGeneratePackageDocsOptions, context: ExecutorContext): Promise<{ success: boolean }> {
    const root = context.root;
    const projectName = context.projectName;

    if (!projectName) {
        logger.error('No project name available in executor context.');
        return { success: false };
    }

    const projectNode = context.projectGraph?.nodes[projectName];
    if (!projectNode) {
        logger.error(`Project "${projectName}" not found in project graph.`);
        return { success: false };
    }

    const projectRoot = path.join(root, projectNode.data.root);
    const entryPoint = path.join(projectRoot, 'src', 'index.ts');
    const tsConfig = path.join(projectRoot, 'tsconfig.lib.json');
    const outDir = options.outputDir ? path.resolve(root, options.outputDir) : path.join(root, '.docs', 'packages', projectName, 'api');

    // Auto-detect package display name from the library's package.json
    let packageDisplayName = projectName;
    const packageJsonPath = path.join(projectRoot, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        try {
            const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            if (pkgJson.name) {
                packageDisplayName = pkgJson.name;
            }
        } catch {
            // Falls back to project name
        }
    }

    if (!fs.existsSync(entryPoint)) {
        logger.error(`Entry point not found: ${entryPoint}`);
        return { success: false };
    }

    logger.info(`📦 Generating docs for ${projectName}...`);

    // Clean previous output
    if (fs.existsSync(outDir)) {
        fs.rmSync(outDir, { recursive: true });
    }

    // Discover additional entry points from the build target configuration
    const buildTarget = projectNode.data.targets?.['build'];
    const additionalEntryPoints: string[] = [];
    if (Array.isArray(buildTarget?.options?.additionalEntryPoints)) {
        for (const ep of buildTarget.options.additionalEntryPoints as string[]) {
            const abs = path.resolve(root, ep);
            if (fs.existsSync(abs)) {
                additionalEntryPoints.push(abs);
            } else {
                logger.warn(`  ⚠ Additional entry point not found: ${ep}`);
            }
        }
    }

    // Create a temporary barrel file when additional entry points exist.
    // IMPORTANT: The temp file is placed in the project root (not inside src/)
    // to avoid being picked up by tsconfig.lib.json ("include": ["src/**/*.ts"])
    // during parallel NX builds, which would cause TS6053 errors.
    // A companion temporary tsconfig extends the lib tsconfig and explicitly
    // adds the temp entry file via "files" so TypeDoc can still resolve it.
    let typedocEntry = entryPoint;
    let tempEntryFile: string | null = null;
    let tempTsConfigFile: string | null = null;

    if (additionalEntryPoints.length > 0) {
        logger.info(`  📂 Entry points: main + ${additionalEntryPoints.length} subpath(s)`);
        tempEntryFile = path.join(projectRoot, '_typedoc-entry.ts');

        const lines = ["export * from './src/index.js';"];
        for (const ep of additionalEntryPoints) {
            const rel = path.relative(projectRoot, ep).replace(/\.ts$/, '').replace(/\\/g, '/');
            lines.push(`export * from './${rel}.js';`);
        }
        fs.writeFileSync(tempEntryFile, lines.join('\n') + '\n', 'utf-8');
        typedocEntry = tempEntryFile;

        // Temporary tsconfig that extends the real one and adds the entry file
        tempTsConfigFile = path.join(projectRoot, '_typedoc-tsconfig.json');
        const baseTsConfig = fs.existsSync(tsConfig) ? './tsconfig.lib.json' : '../../tsconfig.base.json';
        const tempTsConfigContent = {
            extends: baseTsConfig,
            compilerOptions: { composite: false },
            files: ['./_typedoc-entry.ts'],
            include: ['src/**/*.ts'],
        };
        fs.writeFileSync(tempTsConfigFile, JSON.stringify(tempTsConfigContent, null, 2), 'utf-8');
    }

    try {
        // Dynamic import - TypeDoc is an ESM-only package
        const { Application } = await import('typedoc');

        const typedocOptions: Partial<TypeDocOptions> & Partial<PluginOptions> = {
            // TypeDoc treats entry points as globs and rejects native Windows separators.
            entryPoints: [typedocEntry.replace(/\\/g, '/')],
            entryPointStrategy: 'resolve',
            tsconfig: tempTsConfigFile ?? (fs.existsSync(tsConfig) ? tsConfig : path.join(root, 'tsconfig.base.json')),
            skipErrorChecking: true,
            out: outDir,
            plugin: ['typedoc-plugin-markdown'],

            // Markdown output options
            outputFileStrategy: 'members',
            flattenOutputFiles: true,
            hidePageHeader: false,
            hidePageTitle: false,
            hideBreadcrumbs: true,
            useCodeBlocks: true,
            expandObjects: true,
            parametersFormat: 'table',
            enumMembersFormat: 'table',
            typeDeclarationFormat: 'table',
            indexFormat: 'table',
            membersWithOwnFile: ['Class', 'Interface', 'TypeAlias', 'Enum', 'Function', 'Variable'],

            projectDocuments: [],

            // Filtering
            excludePrivate: true,
            excludeProtected: false,
            excludeInternal: true,
            excludeExternals: true,

            // Presentation
            categoryOrder: ['Classes', 'Interfaces', 'Type Aliases', 'Functions', 'Enumerations', 'Variables'],
            sort: ['alphabetical'],
            kindSortOrder: ['Class', 'Interface', 'TypeAlias', 'Function', 'Enum', 'Variable'],

            // Source links
            basePath: root,
            displayBasePath: root,
            disableGit: true,
            sourceLinkTemplate: 'https://github.com/pixel-brewery/archipel/blob/main/{path}#L{line}',
            gitRevision: 'main',

            logLevel: 'Warn',
            name: packageDisplayName,
        };

        const app = await Application.bootstrapWithPlugins(typedocOptions);
        const project = await app.convert();

        if (!project) {
            logger.error(`  ❌ TypeDoc conversion failed for ${projectName}`);
            return { success: false };
        }

        await app.generateOutputs(project);

        // Post-process: remove README.md, rename globals.md → index.md
        // Post-process: remove README.md, _media directory, rename globals.md → index.md
        const readmePath = path.join(outDir, 'README.md');
        if (fs.existsSync(readmePath)) {
            fs.unlinkSync(readmePath);
        }

        const mediaDir = path.join(outDir, '_media');
        if (fs.existsSync(mediaDir)) {
            fs.rmSync(mediaDir, { recursive: true });
            logger.info(`  🗑️  Removed _media directory for ${projectName}`);
        }

        const globalsPath = path.join(outDir, 'globals.md');
        const indexPath = path.join(outDir, 'index.md');
        if (fs.existsSync(globalsPath) && !fs.existsSync(indexPath)) {
            fs.renameSync(globalsPath, indexPath);
        }

        // Post-process all generated Markdown files
        await processGeneratedMarkdown(outDir);

        const count = countMarkdownFiles(outDir);
        logger.info(`✅ ${projectName}: ${count} API doc files`);

        return { success: true };
    } catch (error) {
        logger.error(`Failed to generate docs for ${projectName}: ${error}`);
        return { success: false };
    } finally {
        if (tempEntryFile && fs.existsSync(tempEntryFile)) {
            fs.unlinkSync(tempEntryFile);
        }
        if (tempTsConfigFile && fs.existsSync(tempTsConfigFile)) {
            fs.unlinkSync(tempTsConfigFile);
        }
    }
}

async function processGeneratedMarkdown(dir: string): Promise<void> {
    const prettier = await import('prettier');
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await processGeneratedMarkdown(fullPath);
        } else if (entry.name.endsWith('.md')) {
            normalizeFrontmatter(fullPath, { generated: true });
            rewriteLinks(fullPath);
            stripPackageBackLink(fullPath);
            resolveInlineLinks(fullPath);
            escapeAngleBrackets(fullPath);
            stripTrailingWhitespace(fullPath);
            const options = (await prettier.resolveConfig(fullPath)) ?? {};
            const formatted = await prettier.format(fs.readFileSync(fullPath, 'utf8'), { ...options, filepath: fullPath });
            fs.writeFileSync(fullPath, formatted, 'utf8');
        }
    }
}
