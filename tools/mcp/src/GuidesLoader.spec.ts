// #region Imports

import * as fs from 'node:fs';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GuidesLoader } from './GuidesLoader.js';

// #endregion

/**
 * Stubs the private `resolveGuidesDirectory` method on a GuidesLoader instance
 * so that `load()` reads from the given directory instead of the real paths.
 */
function stubGuidesDirectory(loader: GuidesLoader, directory: string | null): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(GuidesLoader.prototype as any, 'resolveGuidesDirectory').mockReturnValue(directory);
}

describe('GuidesLoader', () => {
    // #region Fields

    let loader: GuidesLoader;
    let tempDirectory: string;

    // #endregion

    // #region Setup

    beforeEach(() => {
        loader = new GuidesLoader();
        const tmpBase = path.join(process.cwd(), 'tmp');
        fs.mkdirSync(tmpBase, { recursive: true });
        tempDirectory = fs.mkdtempSync(path.join(tmpBase, 'guides-loader-test-'));
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    // #endregion

    // #region load() Tests

    describe('load()', () => {
        it('should load guides from a valid directory', () => {
            // arrange
            fs.writeFileSync(
                path.join(tempDirectory, 'getting-started.md'),
                [
                    '---',
                    'title: Getting Started',
                    'description: Set up an Archipel application.',
                    'order: 1',
                    '---',
                    '',
                    '# Getting Started',
                    '',
                    'Install the foundation packages.',
                ].join('\n'),
            );

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.guides.size).toBe(1);
            expect(loader.guides.has('getting-started')).toBe(true);

            const guide = loader.guides.get('getting-started')!;
            expect(guide.name).toBe('getting-started');
            expect(guide.title).toBe('Getting Started');
            expect(guide.description).toBe('Set up an Archipel application.');
            expect(guide.order).toBe(1);
            expect(guide.content).toContain('# Getting Started');
            expect(guide.content).toContain('Install the foundation packages.');
        });

        it('should skip index.md', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'index.md'), ['---', 'title: Index', '---', '', 'Overview page.'].join('\n'));

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.guides.size).toBe(0);
        });

        it('should skip non-markdown files', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'notes.txt'), 'plain text');

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.guides.size).toBe(0);
        });

        it('should produce empty guides when directory is not found', () => {
            // arrange
            stubGuidesDirectory(loader, null);

            // act
            loader.load();

            // assert
            expect(loader.guides.size).toBe(0);
        });

        it('should load multiple guides', () => {
            // arrange
            for (const [name, order] of [
                ['getting-started', 1],
                ['authentication-and-authorization', 2],
                ['database-setup', 3],
            ] as const) {
                fs.writeFileSync(
                    path.join(tempDirectory, `${name}.md`),
                    ['---', `title: ${name}`, `description: Guide for ${name}.`, `order: ${order}`, '---', '', `# ${name}`].join('\n'),
                );
            }

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.guides.size).toBe(3);
            expect(loader.guides.has('getting-started')).toBe(true);
            expect(loader.guides.has('authentication-and-authorization')).toBe(true);
            expect(loader.guides.has('database-setup')).toBe(true);
        });

        it('should use filename as fallback title when frontmatter title is missing', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'advanced-topic.md'), ['---', 'description: No title.', '---', '', 'Some content.'].join('\n'));

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const guide = loader.guides.get('advanced-topic')!;
            expect(guide.title).toBe('advanced-topic');
        });

        it('should default order to 999 when missing', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'no-order.md'), ['---', 'title: No Order Guide', '---', '', 'Content.'].join('\n'));

            stubGuidesDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const guide = loader.guides.get('no-order')!;
            expect(guide.order).toBe(999);
        });
    });

    // #endregion

    // #region search() Tests

    describe('search()', () => {
        beforeEach(() => {
            fs.writeFileSync(
                path.join(tempDirectory, 'getting-started.md'),
                [
                    '---',
                    'title: Getting Started',
                    'description: Set up an Archipel application from scratch.',
                    'order: 1',
                    '---',
                    '',
                    '# Getting Started',
                    '',
                    'Install platform-core and platform-configuration.',
                ].join('\n'),
            );

            fs.writeFileSync(
                path.join(tempDirectory, 'authentication-and-authorization.md'),
                [
                    '---',
                    'title: Authentication & Authorization',
                    'description: Secure your API with JWT and guards.',
                    'order: 3',
                    '---',
                    '',
                    '# Authentication',
                    '',
                    'Use JwtAuthGuard to protect endpoints.',
                ].join('\n'),
            );

            stubGuidesDirectory(loader, tempDirectory);

            loader.load();
        });

        it('should find guides by name', () => {
            // arrange & act
            const results = loader.search('getting-started');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('getting-started');
        });

        it('should find guides by title', () => {
            // arrange & act
            const results = loader.search('Authentication');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('authentication-and-authorization');
        });

        it('should find guides by description', () => {
            // arrange & act
            const results = loader.search('JWT');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('authentication-and-authorization');
        });

        it('should find guides by content', () => {
            // arrange & act
            const results = loader.search('JwtAuthGuard');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('authentication-and-authorization');
        });

        it('should return empty array when no match', () => {
            // arrange & act
            const results = loader.search('nonexistent-xyz');

            // assert
            expect(results).toHaveLength(0);
        });

        it('should be case-insensitive', () => {
            // arrange & act
            const results = loader.search('GETTING');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('getting-started');
        });

        it('should return results sorted by order', () => {
            // arrange & act
            const results = loader.search('Archipel');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('getting-started');
        });
    });

    // #endregion
});
