/**
 * NX Executor: build-llm-artifacts
 *
 * Generates LLM/MCP-compatible artifacts from the documentation content:
 * - llms.txt - index of all pages with title + description + URL
 * - llms-full.txt - full concatenated content for embedding pipelines
 * - docs-index.json - structured JSON index for MCP servers
 *
 * The only project-specific values are `projectTitle` and `projectDescription`,
 * which are provided via executor options in the project.json.
 */

import type { ExecutorContext } from '@nx/devkit';
import { logger } from '@nx/devkit';
import * as fs from 'node:fs';
import * as path from 'node:path';
// gray-matter is CJS - use import = require() to avoid ESM interop issues in NX JIT
import matter = require('gray-matter');

export interface IBuildLlmArtifactsOptions {
    docsDir?: string;
    outputDir?: string;
    projectTitle: string;
    projectDescription?: string;
}

interface IDocEntry {
    id: string;
    title: string;
    description: string;
    path: string;
    url: string;
    tags: string[];
    package: string | null;
    generated: boolean;
    content: string;
}

interface IDocsIndex {
    version: string;
    generated: string;
    totalDocuments: number;
    documents: Array<{
        id: string;
        title: string;
        description: string;
        path: string;
        url: string;
        tags: string[];
        package: string | null;
        generated: boolean;
        contentLength: number;
    }>;
}

export default async function runExecutor(options: IBuildLlmArtifactsOptions, context: ExecutorContext): Promise<{ success: boolean }> {
    const root = context.root;
    const docsDir = path.resolve(root, options.docsDir ?? '.docs');
    const outputDir = path.resolve(root, options.outputDir ?? path.join('.generated', 'llm'));
    const projectTitle = options.projectTitle;
    const projectDescription = options.projectDescription ?? '';

    logger.info('🤖 Generating LLM/MCP artifacts...');

    if (!fs.existsSync(docsDir)) {
        logger.error(`Docs directory does not exist: ${docsDir}`);
        return { success: false };
    }

    // Clean output
    if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true });
    }
    fs.mkdirSync(outputDir, { recursive: true });

    // Collect all Markdown entries
    const entries = collectMarkdownFiles(docsDir);
    logger.info(`  Found ${entries.length} documents`);

    // Build llms.txt
    const llmsTxt = buildLlmsTxt(entries, projectTitle, projectDescription);
    fs.writeFileSync(path.join(outputDir, 'llms.txt'), llmsTxt, 'utf-8');
    logger.info('  ✓ llms.txt');

    // Build llms-full.txt
    const llmsFullTxt = buildLlmsFullTxt(entries, projectTitle);
    fs.writeFileSync(path.join(outputDir, 'llms-full.txt'), llmsFullTxt, 'utf-8');
    logger.info('  ✓ llms-full.txt');

    // Build docs-index.json
    const docsIndex = buildDocsIndex(entries);
    fs.writeFileSync(path.join(outputDir, 'docs-index.json'), JSON.stringify(docsIndex, null, 2), 'utf-8');
    logger.info('  ✓ docs-index.json');

    logger.info(`\n✅ LLM artifacts generated in ${path.relative(root, outputDir)}/`);
    return { success: true };
}

function collectMarkdownFiles(dir: string, basePath = ''): IDocEntry[] {
    const entries: IDocEntry[] = [];

    if (!fs.existsSync(dir)) return entries;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(basePath, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === '.vitepress' || entry.name === 'node_modules') continue;
            entries.push(...collectMarkdownFiles(fullPath, relPath));
        } else if (entry.name.endsWith('.md')) {
            const raw = fs.readFileSync(fullPath, 'utf-8');
            const parsed = matter(raw);

            const slug = relPath
                .replace(/\\/g, '/')
                .replace(/\/index\.md$/, '/')
                .replace(/\.md$/, '');

            const url = `/${slug}`;

            entries.push({
                id: slug.replace(/\//g, '-').replace(/^-/, '').replace(/-$/, '') || 'index',
                title: (parsed.data['title'] as string) || extractH1(parsed.content) || entry.name,
                description: (parsed.data['description'] as string) || '',
                path: relPath.replace(/\\/g, '/'),
                url,
                tags: (parsed.data['tags'] as string[]) || [],
                package: (parsed.data['package'] as string) || null,
                generated: (parsed.data['generated'] as boolean) || false,
                content: parsed.content.trim(),
            });
        }
    }

    return entries;
}

function extractH1(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
}

function buildLlmsTxt(entries: IDocEntry[], projectTitle: string, projectDescription: string): string {
    const lines = [
        `# ${projectTitle} Documentation`,
        '',
        projectDescription ? `> ${projectDescription}` : '> Generated documentation index.',
        '> Generated automatically - do not edit.',
        '',
        `> Total documents: ${entries.length}`,
        '',
    ];

    // Group by section (first path segment)
    const sections = new Map<string, IDocEntry[]>();
    for (const entry of entries) {
        const section = entry.path.split('/')[0] || 'root';
        if (!sections.has(section)) sections.set(section, []);
        sections.get(section)!.push(entry);
    }

    for (const [section, sectionEntries] of sections) {
        lines.push(`## ${section}`);
        lines.push('');
        for (const entry of sectionEntries) {
            lines.push(`- [${entry.title}](${entry.url}): ${entry.description}`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

function buildLlmsFullTxt(entries: IDocEntry[], projectTitle: string): string {
    const parts: string[] = [`# ${projectTitle} - Full Documentation`, '', `Generated: ${new Date().toISOString()}`, '', '---', ''];

    for (const entry of entries) {
        parts.push(`# ${entry.title}`);
        if (entry.description) {
            parts.push(`> ${entry.description}`);
        }
        parts.push(`Path: ${entry.path}`);
        if (entry.package) parts.push(`Package: ${entry.package}`);
        if (entry.tags.length > 0) parts.push(`Tags: ${entry.tags.join(', ')}`);
        parts.push('');
        parts.push(entry.content);
        parts.push('');
        parts.push('---');
        parts.push('');
    }

    return parts.join('\n');
}

function buildDocsIndex(entries: IDocEntry[]): IDocsIndex {
    return {
        version: '1.0.0',
        generated: new Date().toISOString(),
        totalDocuments: entries.length,
        documents: entries.map((e) => ({
            id: e.id,
            title: e.title,
            description: e.description,
            path: e.path,
            url: e.url,
            tags: e.tags,
            package: e.package,
            generated: e.generated,
            contentLength: e.content.length,
        })),
    };
}
