/**
 * NX Executor: generate-api-overview
 *
 * Scans generated API docs and produces a structured JSON index (api-index.json)
 * for the documentation site's API search/overview page.
 *
 * All project-specific values (package names, scopes) are derived from the
 * NX project graph and each library's package.json - nothing is hardcoded.
 */

// #region Imports

import type { ExecutorContext } from '@nx/devkit';
import { logger } from '@nx/devkit';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { format, resolveConfig } from 'prettier';

// #endregion

export interface IGenerateApiOverviewOptions {
    docsDir?: string;
    outputDir?: string;
    packagePrefix?: string;
}

interface IApiIndexEntry {
    id: string;
    name: string;
    kind: string;
    kindLabel: string;
    packageName: string;
    packageSlug: string;
    title: string;
    description: string;
    link: string;
}

interface IApiIndexPayload {
    total: number;
    byKind: Record<string, number>;
    byPackage: Record<string, number>;
    entries: IApiIndexEntry[];
}

const KIND_MAP: Record<string, string> = {
    Class: 'class',
    Interface: 'interface',
    TypeAlias: 'type-alias',
    Enum: 'enum',
    Function: 'function',
    Namespace: 'namespace',
    Variable: 'variable',
};

const KIND_LABELS: Record<string, string> = {
    class: 'Class',
    interface: 'Interface',
    'type-alias': 'Type Alias',
    enum: 'Enum',
    function: 'Function',
    namespace: 'Namespace',
    variable: 'Variable',
    other: 'Other',
};

export default async function runExecutor(options: IGenerateApiOverviewOptions, context: ExecutorContext): Promise<{ success: boolean }> {
    const root = context.root;
    const docsDir = path.resolve(root, options.docsDir ?? '.docs');
    const packagesDir = path.join(docsDir, 'packages');
    const outputDir = path.resolve(root, options.outputDir ?? path.join(docsDir, 'public', 'api'));
    const packagePrefix = options.packagePrefix ?? '';

    logger.info('🔎 Generating API overview index...');

    // Build a mapping from project/slug name to full npm package name
    const packageNameMap = buildPackageNameMap(root, context);

    // Collect API entries from all package directories
    const entries = collectApiEntries(packagesDir, packagePrefix, packageNameMap);
    const payload = buildPayload(entries);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, 'api-index.json');
    const formattingOptions = await resolveConfig(outputFile, { editorconfig: true });
    const formattedPayload = await format(JSON.stringify(payload), { ...formattingOptions, filepath: outputFile });
    fs.writeFileSync(outputFile, formattedPayload, 'utf-8');

    logger.info(`  ✓ API symbols indexed: ${payload.total}`);
    logger.info(`  ✓ Output: ${path.relative(root, outputFile)}`);

    return { success: true };
}

/**
 * Builds a mapping from NX project name (slug) to the full npm package name
 * by reading each project's package.json from the project graph.
 */
function buildPackageNameMap(root: string, context: ExecutorContext): Map<string, string> {
    const map = new Map<string, string>();
    const nodes = context.projectGraph?.nodes ?? {};

    for (const [name, node] of Object.entries(nodes)) {
        const pkgJsonPath = path.join(root, node.data.root, 'package.json');
        if (fs.existsSync(pkgJsonPath)) {
            try {
                const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
                if (pkgJson.name) {
                    map.set(name, pkgJson.name);
                }
            } catch {
                // Skip - fall through to default
            }
        }
        if (!map.has(name)) {
            map.set(name, name);
        }
    }

    return map;
}

function collectApiEntries(packagesDir: string, packagePrefix: string, packageNameMap: Map<string, string>): IApiIndexEntry[] {
    if (!fs.existsSync(packagesDir)) {
        return [];
    }

    const packageDirs = fs
        .readdirSync(packagesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && (!packagePrefix || entry.name.startsWith(packagePrefix)))
        .map((entry) => entry.name)
        .sort();

    const entries: IApiIndexEntry[] = [];

    for (const packageSlug of packageDirs) {
        const apiDir = path.join(packagesDir, packageSlug, 'api');
        if (!fs.existsSync(apiDir)) {
            continue;
        }

        const files = fs
            .readdirSync(apiDir, { withFileTypes: true })
            .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md')
            .map((entry) => entry.name)
            .sort();

        const packageName = packageNameMap.get(packageSlug) ?? packageSlug;

        for (const fileName of files) {
            entries.push(createEntry(packageSlug, packageName, fileName, path.join(apiDir, fileName)));
        }
    }

    return entries.sort((left, right) => left.name.localeCompare(right.name) || left.packageSlug.localeCompare(right.packageSlug));
}

function createEntry(packageSlug: string, packageName: string, fileName: string, absolutePath: string): IApiIndexEntry {
    const content = fs.readFileSync(absolutePath, 'utf-8');
    const baseName = fileName.replace(/\.md$/, '');

    const dotIndex = baseName.indexOf('.');
    const rawKind = dotIndex > 0 ? baseName.substring(0, dotIndex) : 'Other';
    const rawName = dotIndex > 0 ? baseName.substring(dotIndex + 1) : baseName;

    const kind = KIND_MAP[rawKind] ?? 'other';
    const kindLabel = KIND_LABELS[kind] ?? 'Other';

    const title = extractFrontmatterTitle(content) ?? `${kindLabel}: ${rawName}`;
    const description = deriveDescription(content);

    return {
        id: `${packageSlug}:${kind}:${rawName}`.toLowerCase(),
        name: rawName,
        kind,
        kindLabel,
        packageName,
        packageSlug,
        title,
        description,
        link: `/packages/${packageSlug}/api/${baseName}`,
    };
}

function extractFrontmatterTitle(markdownContent: string): string | null {
    const lines = markdownContent.split('\n');
    if (lines[0]?.trim() !== '---') {
        return null;
    }

    for (let index = 1; index < lines.length; index++) {
        const line = lines[index].trim();
        if (line === '---') {
            break;
        }

        if (line.startsWith('title:')) {
            return line
                .replace(/^title:\s*/, '')
                .replace(/^['"]|['"]$/g, '')
                .trim();
        }
    }

    return null;
}

function deriveDescription(markdownContent: string): string {
    const lines = markdownContent.split('\n');
    let afterHeading = false;

    for (const rawLine of lines) {
        const line = rawLine.trim();

        if (!afterHeading && line.startsWith('# ')) {
            afterHeading = true;
            continue;
        }

        if (!afterHeading) continue;
        if (!line) continue;
        if (line.startsWith('Defined in:')) continue;
        if (line.startsWith('```')) continue;
        if (line.startsWith('## ')) break;

        return line.replace(/`/g, '').trim();
    }

    return 'No description provided.';
}

function buildPayload(entries: IApiIndexEntry[]): IApiIndexPayload {
    const byKind: Record<string, number> = {};
    const byPackage: Record<string, number> = {};

    for (const entry of entries) {
        byKind[entry.kind] = (byKind[entry.kind] ?? 0) + 1;
        byPackage[entry.packageSlug] = (byPackage[entry.packageSlug] ?? 0) + 1;
    }

    return {
        total: entries.length,
        byKind,
        byPackage,
        entries,
    };
}
