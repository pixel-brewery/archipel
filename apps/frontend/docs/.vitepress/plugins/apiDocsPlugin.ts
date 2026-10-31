/**
 * apiDocsPlugin.ts
 *
 * VitePress plugin that scans the docs source directory (`.docs/`)
 * and automatically builds sidebar navigation from the file structure.
 *
 * Reads frontmatter `title`, `navOrder`, and groups API files by kind
 * (Class, Interface, TypeAlias, Enum, Function, Namespace).
 */

import matter from 'gray-matter';
import fs from 'node:fs';
import path from 'node:path';
import type { DefaultTheme } from 'vitepress';

export interface ApiDocsOptions {
    rootDir: string;
    sortByFrontmatter?: boolean;
    ignorePatterns?: (string | RegExp)[];
    /**
     * Optional hook to transform a filename into nested sidebar path segments.
     */
    filenameToSidebarPath?: (filename: string) => string[];
    /**
     * Optional hook to transform a filename into a sidebar display name.
     */
    filenameToSidebarName?: (filename: string) => string;
}

interface ISidebarItem {
    text: string;
    link?: string;
    collapsed?: boolean;
    items?: ISidebarItem[];
    order?: number;
}

/**
 * Generates sidebar items for an API docs directory.
 * Groups files by TypeDoc kind prefix (Class., Interface., etc.)
 */
export function generateApiDocsSidebar(options: ApiDocsOptions): Array<DefaultTheme.SidebarItem> {
    const {
        rootDir,
        sortByFrontmatter = true,
        ignorePatterns = [],
        filenameToSidebarPath = (filename: string): string[] => {
            const parts = filename.split('.');
            return parts.length > 1 ? [parts.slice(0, -1).join('.'), parts[parts.length - 1]] : [filename];
        },
        filenameToSidebarName = (name: string): string => {
            const parts = name.split('.');
            return parts[parts.length - 1];
        },
    } = options;

    const absoluteRoot = path.resolve(process.cwd(), rootDir);

    if (!fs.existsSync(absoluteRoot)) {
        return [];
    }

    const entries = scanDirectory(absoluteRoot);
    const tree: Record<string, unknown> = {};

    for (const { routePath, frontmatter, title, filename } of entries) {
        const pathSegments = filenameToSidebarPath(filename);
        insertIntoTree(tree, pathSegments, {
            text: filenameToSidebarName(getStringFrontmatterValue(frontmatter['title'], title)),
            link: routePath,
            order: getNumberFrontmatterValue(frontmatter['navOrder'], 9999),
        });
    }

    return flattenTree(tree, sortByFrontmatter, filenameToSidebarName);

    function scanDirectory(dir: string): Array<{
        filePath: string;
        routePath: string;
        title: string;
        filename: string;
        frontmatter: Record<string, unknown>;
    }> {
        const results: Array<{
            filePath: string;
            routePath: string;
            title: string;
            filename: string;
            frontmatter: Record<string, unknown>;
        }> = [];

        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                results.push(...scanDirectory(fullPath));
            } else if (entry.isFile() && entry.name.endsWith('.md') && !shouldIgnore(entry.name)) {
                const rel = path.relative(absoluteRoot, fullPath).replace(/\\/g, '/');
                const routePath = `/${rootDir}/${rel}`
                    .replace(/\.md$/, '')
                    .replace(/\/index$/, '/')
                    .replace(/\\/g, '/');
                const content = fs.readFileSync(fullPath, 'utf-8');
                const { data } = matter(content);

                results.push({
                    filePath: fullPath,
                    routePath,
                    frontmatter: data,
                    title: deriveTitle(entry.name),
                    filename: entry.name.replace(/\.md$/, ''),
                });
            }
        }

        return results;
    }

    function shouldIgnore(filename: string): boolean {
        return ignorePatterns.some((p) => (typeof p === 'string' ? filename === p : p instanceof RegExp && p.test(filename)));
    }
}

function deriveTitle(filename: string): string {
    return filename
        .replace(/\.md$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getStringFrontmatterValue(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

function getNumberFrontmatterValue(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function insertIntoTree(tree: Record<string, unknown>, segments: string[], item: ISidebarItem): void {
    let node = tree;
    for (let i = 0; i < segments.length - 1; i++) {
        const part = segments[i];
        if (!node[part] || typeof node[part] !== 'object') {
            node[part] = {};
        }
        node = node[part] as Record<string, unknown>;
    }
    const leaf = segments[segments.length - 1];
    node[leaf] = { _meta: item };
}

function flattenTree(node: Record<string, unknown>, sortByFrontmatter: boolean, filenameToSidebarName: (name: string) => string): ISidebarItem[] {
    return Object.entries(node).map(([key, value]) => {
        const record = value as Record<string, unknown>;

        if (record['_meta'] && Object.keys(record).length === 1) {
            return record['_meta'] as ISidebarItem;
        }

        const children = flattenTree(record as Record<string, unknown>, sortByFrontmatter, filenameToSidebarName);

        const sorted = sortByFrontmatter ? children.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)) : children;

        const meta = record['_meta'] as ISidebarItem | undefined;
        return {
            text: filenameToSidebarName(meta?.text || key),
            items: sorted,
        };
    });
}

/**
 * Builds the full sidebar configuration for the docs site.
 * Scans architecture, packages (with API sub-navigation), guides, patterns, and tools sections.
 */
export function buildFullSidebar(docsRoot: string): DefaultTheme.Sidebar {
    const absoluteRoot = path.resolve(process.cwd(), docsRoot);

    const apiItems = buildSectionItems(path.join(absoluteRoot, 'api'), absoluteRoot);
    apiItems.unshift({ text: 'Overview', link: '/api/' });

    const architectureItems = buildSectionItems(path.join(absoluteRoot, 'architecture'), absoluteRoot);
    architectureItems.unshift({ text: 'Overview', link: '/architecture/' });

    const packageItems = buildPackagesSidebar(absoluteRoot);
    packageItems.unshift({ text: 'Overview', link: '/packages/' });

    const toolItems = buildSectionItems(path.join(absoluteRoot, 'tools'), absoluteRoot);
    toolItems.unshift({ text: 'Overview', link: '/tools/' });

    const guideItems = buildSectionItems(path.join(absoluteRoot, 'guides'), absoluteRoot);
    guideItems.unshift({ text: 'Overview', link: '/guides/' });

    const patternItems = buildSectionItems(path.join(absoluteRoot, 'patterns'), absoluteRoot);
    patternItems.unshift({ text: 'Overview', link: '/patterns/' });

    return {
        '/': [
            {
                text: 'Introduction',
                items: [{ text: 'Overview', link: '/' }],
            },
            {
                text: 'Packages',
                collapsed: false,
                items: packageItems,
            },
            {
                text: 'Guides',
                items: guideItems,
            },
            {
                text: 'Patterns',
                items: patternItems,
            },
            {
                text: 'Architecture',
                items: architectureItems,
            },
            {
                text: 'API',
                items: apiItems,
            },
            {
                text: 'Tools',
                items: toolItems,
            },
        ],
    };
}

function buildSectionItems(sectionDir: string, baseDir: string): DefaultTheme.SidebarItem[] {
    if (!fs.existsSync(sectionDir)) return [];

    const items: Array<DefaultTheme.SidebarItem & { order: number; text: string }> = [];

    for (const entry of fs.readdirSync(sectionDir, { withFileTypes: true })) {
        if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') {
            const fullPath = path.join(sectionDir, entry.name);
            const content = fs.readFileSync(fullPath, 'utf-8');
            const { data } = matter(content);

            const rel = path.relative(baseDir, fullPath).replace(/\\/g, '/');
            const link = '/' + rel.replace(/\.md$/, '');

            const title = getStringFrontmatterValue(data['title'], extractH1(content) || deriveTitle(entry.name));
            const order = getNumberFrontmatterValue(data['order'], 999);

            items.push({ text: title, link, order });
        }
    }

    items.sort((firstItem, secondItem) => firstItem.order - secondItem.order);

    return items;
}

function buildPackagesSidebar(baseDir: string): DefaultTheme.SidebarItem[] {
    const packagesDir = path.join(baseDir, 'packages');
    if (!fs.existsSync(packagesDir)) return [];

    const items: DefaultTheme.SidebarItem[] = [];

    const pkgDirs = fs
        .readdirSync(packagesDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith('platform-'))
        .map((d) => d.name)
        .sort();

    for (const pkg of pkgDirs) {
        const pkgDir = path.join(packagesDir, pkg);
        const pkgItems: DefaultTheme.SidebarItem[] = [];

        // Overview page
        if (fs.existsSync(path.join(pkgDir, 'index.md'))) {
            pkgItems.push({ text: 'Overview', link: `/packages/${pkg}/` });
        }

        // API Reference sub-navigation
        const apiDir = path.join(pkgDir, 'api');
        if (fs.existsSync(apiDir)) {
            const apiSubItems = buildApiKindGroups(apiDir, baseDir);
            if (apiSubItems.length > 0) {
                pkgItems.push({
                    text: 'API Reference',
                    link: `/packages/${pkg}/api/`,
                    collapsed: true,
                    items: apiSubItems,
                });
            } else {
                pkgItems.push({ text: 'API Reference', link: `/packages/${pkg}/api/` });
            }
        }

        items.push({
            text: pkg,
            collapsed: true,
            items: pkgItems,
        });
    }

    return items;
}

function buildApiKindGroups(apiDir: string, baseDir: string): DefaultTheme.SidebarItem[] {
    const files = fs
        .readdirSync(apiDir)
        .filter((f) => f.endsWith('.md') && f !== 'index.md')
        .sort();

    const groups = new Map<string, Array<DefaultTheme.SidebarItem & { text: string }>>();

    for (const file of files) {
        const name = file.replace(/\.md$/, '');
        const dotIndex = name.indexOf('.');
        const kind = dotIndex > 0 ? name.substring(0, dotIndex) : 'Other';
        const symbolName = dotIndex > 0 ? name.substring(dotIndex + 1) : name;

        const link = '/' + path.relative(baseDir, path.join(apiDir, file)).replace(/\\/g, '/').replace(/\.md$/, '');

        const groupItems = groups.get(kind);
        if (groupItems) {
            groupItems.push({ text: symbolName, link });
        } else {
            groups.set(kind, [{ text: symbolName, link }]);
        }
    }

    const kindOrder = ['Class', 'Interface', 'TypeAlias', 'Enum', 'Function', 'Namespace'];
    const kindPlurals: Record<string, string> = {
        Class: 'Classes',
        Interface: 'Interfaces',
        TypeAlias: 'Type Aliases',
        Enum: 'Enums',
        Function: 'Functions',
        Namespace: 'Namespaces',
    };
    const result: DefaultTheme.SidebarItem[] = [];

    for (const kind of kindOrder) {
        const kindItems = groups.get(kind);
        if (kindItems && kindItems.length > 0) {
            result.push({
                text: kindPlurals[kind] ?? `${kind}s`,
                collapsed: true,
                items: kindItems.sort((firstItem, secondItem) => firstItem.text.localeCompare(secondItem.text)),
            });
            groups.delete(kind);
        }
    }

    for (const [kind, kindItems] of groups) {
        result.push({
            text: kind,
            collapsed: true,
            items: kindItems.sort((firstItem, secondItem) => firstItem.text.localeCompare(secondItem.text)),
        });
    }

    return result;
}

function extractH1(content: string): string | null {
    const rawContent = matter(content).content;
    const match = rawContent.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}
