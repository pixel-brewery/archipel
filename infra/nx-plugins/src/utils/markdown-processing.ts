/**
 * Shared Markdown post-processing utilities for TypeDoc-generated documentation.
 * All functions are stateless and operate on individual files.
 */

// gray-matter is CJS - use import = require() to avoid ESM interop issues in NX JIT
import matter = require('gray-matter');
import * as fs from 'node:fs';
import * as path from 'node:path';
import { VALID_HTML_TAGS } from './valid-html-tags';

export interface INormalizeFrontmatterOptions {
    generated?: boolean;
}

/**
 * Ensures the Markdown file has valid frontmatter with a title.
 * Optionally marks the file as auto-generated.
 */
export function normalizeFrontmatter(filePath: string, options: INormalizeFrontmatterOptions = {}): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(content);

    if (!parsed.data['title'] && parsed.content) {
        const h1Match = parsed.content.match(/^#\s+(.+)$/m);
        if (h1Match) {
            parsed.data['title'] = h1Match[1].trim();
        }
    }

    if (options.generated) {
        parsed.data['generated'] = true;
        parsed.data['editUrl'] = false;
    }

    const updated = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, updated, 'utf-8');
}

/**
 * Rewrites `.md` extensions to clean URLs and README links to parent directory.
 * Required for VitePress compatibility.
 */
export function rewriteLinks(filePath: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');

    content = content.replace(/\]\(([^)]+?)\.md(#[^)]*?)?\)/g, (match: string, linkPath: string, anchor: string | undefined) => {
        if (linkPath.startsWith('http://') || linkPath.startsWith('https://')) {
            return match;
        }
        return `](${linkPath}${anchor ?? ''})`;
    });

    content = content.replace(/\]\((?:\.\/)?README(#[^)]*?)?\)/g, (_match: string, anchor: string | undefined) => `](../${anchor ?? ''})`);

    fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Removes the TypeDoc-generated package back-link and separator at the top.
 * Matches any scoped package pattern: `[**@scope/package-name**](../)`
 */
export function stripPackageBackLink(filePath: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/\[?\[?\*\*@[^*]+\*\*\]?\(\.\.\/?\)\]?\s*\n+\*{3}\s*\n+/g, '');
    fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Resolves unresolved `{@link Foo}` TSDoc references in inline code.
 * Converts `{@link Foo}` → `Foo`.
 */
export function resolveInlineLinks(filePath: string): void {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/\{@link\s+([^}]+)\}/g, '$1');
    fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * Removes whitespace emitted at the end of generated Markdown lines.
 */
export function stripTrailingWhitespace(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const updated = content.replace(/[ \t]+$/gm, '');

    if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf-8');
    }
}

/**
 * Escapes angle brackets in TypeDoc-generated Markdown that Vue's compiler
 * would misinterpret as HTML/component tags (e.g. `Promise<boolean>`).
 * Only processes lines outside fenced code blocks and inline code spans.
 */
export function escapeAngleBrackets(filePath: string): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let insideCodeFence = false;
    const result: string[] = [];

    for (const line of lines) {
        if (/^```/.test(line.trimStart())) {
            insideCodeFence = !insideCodeFence;
            result.push(line);
            continue;
        }

        if (insideCodeFence) {
            result.push(line);
            continue;
        }

        const segments = line.split(/(`[^`]*`)/g);
        const escaped = segments
            .map((segment: string, index: number) => {
                if (index % 2 === 1) return segment;

                return segment.replace(/(?<!\\)<(\/?[A-Za-z][A-Za-z0-9., |_[\]]*?)(?<!\\)>/g, (_match: string, inner: string) => {
                    const tagName = inner
                        .replace(/^\//, '')
                        .split(/[\s,.[|]/)[0]
                        .toLowerCase();

                    if (VALID_HTML_TAGS.has(tagName)) return _match;
                    return `\\<${inner}\\>`;
                });
            })
            .join('');

        result.push(escaped);
    }

    const updated = result.join('\n');
    if (updated !== content) {
        fs.writeFileSync(filePath, updated, 'utf-8');
    }
}

/**
 * Recursively counts Markdown files in a directory.
 */
export function countMarkdownFiles(dir: string): number {
    if (!fs.existsSync(dir)) return 0;
    let count = 0;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            count += countMarkdownFiles(path.join(dir, entry.name));
        } else if (entry.name.endsWith('.md')) {
            count++;
        }
    }

    return count;
}

/**
 * Recursively processes all Markdown files in a directory,
 * applying normalization, link rewriting, and escaping.
 */
export function processMarkdownFiles(dir: string, options: INormalizeFrontmatterOptions = {}): void {
    if (!fs.existsSync(dir)) return;

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processMarkdownFiles(fullPath, options);
        } else if (entry.name.endsWith('.md')) {
            normalizeFrontmatter(fullPath, options);
            rewriteLinks(fullPath);
            if (options.generated) {
                escapeAngleBrackets(fullPath);
            }
        }
    }
}
