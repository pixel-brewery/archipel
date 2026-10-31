// #region Imports

import * as fs from 'node:fs';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DocsLoader } from './DocsLoader.js';

// #endregion

/**
 * Stubs the private `resolveDocsDirectory` method on a DocsLoader instance
 * so that `load()` reads from the given directory instead of the real paths.
 */
function stubDocsDirectory(loader: DocsLoader, directory: string | null): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(DocsLoader.prototype as any, 'resolveDocsDirectory').mockReturnValue(directory);
}

describe('DocsLoader', () => {
    // #region Fields

    let loader: DocsLoader;
    let tempDirectory: string;

    // #endregion

    // #region Setup

    beforeEach(() => {
        loader = new DocsLoader();
        const tmpBase = path.join(process.cwd(), 'tmp');
        fs.mkdirSync(tmpBase, { recursive: true });
        tempDirectory = fs.mkdtempSync(path.join(tmpBase, 'docs-loader-test-'));
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    // #endregion

    // #region load() Tests

    describe('load()', () => {
        it('should load package docs from a valid directory', () => {
            // arrange
            const packageDirectory = path.join(tempDirectory, 'platform-core');
            fs.mkdirSync(packageDirectory, { recursive: true });
            fs.writeFileSync(
                path.join(packageDirectory, 'index.md'),
                [
                    '---',
                    'title: platform-core',
                    'description: Foundation library providing mapping and utilities.',
                    'tags: [core, mapping]',
                    "package: '@pixel-brewery/archipel-platform-core'",
                    '---',
                    '',
                    '# platform-core',
                    '',
                    'The foundation library.',
                ].join('\n'),
            );

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.packages.size).toBe(1);
            expect(loader.packages.has('platform-core')).toBe(true);

            const packageDoc = loader.packages.get('platform-core')!;
            expect(packageDoc.name).toBe('platform-core');
            expect(packageDoc.title).toBe('platform-core');
            expect(packageDoc.description).toBe('Foundation library providing mapping and utilities.');
            expect(packageDoc.tags).toEqual(['core', 'mapping']);
            expect(packageDoc.packageScope).toBe('@pixel-brewery/archipel-platform-core');
            expect(packageDoc.content).toContain('# platform-core');
            expect(packageDoc.content).toContain('The foundation library.');
        });

        it('should load API docs from api/ subdirectory', () => {
            // arrange
            const packageDirectory = path.join(tempDirectory, 'platform-database');
            const apiDirectory = path.join(packageDirectory, 'api');
            fs.mkdirSync(apiDirectory, { recursive: true });
            fs.writeFileSync(
                path.join(packageDirectory, 'index.md'),
                [
                    '---',
                    'title: platform-database',
                    'description: Database access layer.',
                    'tags: [database, prisma]',
                    "package: '@pixel-brewery/archipel-platform-database'",
                    '---',
                    '',
                    '# platform-database',
                ].join('\n'),
            );
            fs.writeFileSync(
                path.join(apiDirectory, 'DatabaseService.md'),
                ['---', 'title: DatabaseService', '---', '', '## DatabaseService', '', 'The main service.'].join('\n'),
            );

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const packageDoc = loader.packages.get('platform-database')!;
            expect(packageDoc.apiContent).toContain('## DatabaseService');
            expect(packageDoc.apiContent).toContain('The main service.');
        });

        it('should use the generated API index when a package has no manual overview', () => {
            // arrange
            const apiDirectory = path.join(tempDirectory, 'platform-core', 'api');
            fs.mkdirSync(apiDirectory, { recursive: true });
            fs.writeFileSync(
                path.join(apiDirectory, 'index.md'),
                ['---', 'generated: true', '---', '', '# @pixel-brewery/archipel-platform-core', '', 'Generated API index.'].join('\n'),
            );
            fs.writeFileSync(path.join(apiDirectory, 'Class.CoreService.md'), '# CoreService\n\nGenerated member documentation.');

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const packageDoc = loader.packages.get('platform-core')!;
            expect(packageDoc.content).toContain('Generated API index.');
            expect(packageDoc.apiContent).toContain('Generated member documentation.');
            expect(packageDoc.apiContent).not.toContain('Generated API index.');
        });

        it('should skip non-directory entries', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'stray-file.txt'), 'not a package');

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.packages.size).toBe(0);
        });

        it('should skip directories without a manual or generated API index', () => {
            // arrange
            const emptyPackageDirectory = path.join(tempDirectory, 'orphan-package');
            fs.mkdirSync(emptyPackageDirectory, { recursive: true });

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.packages.size).toBe(0);
        });

        it('should produce empty packages when docs directory is not found', () => {
            // arrange
            stubDocsDirectory(loader, null);

            // act
            loader.load();

            // assert
            expect(loader.packages.size).toBe(0);
        });

        it('should load multiple packages', () => {
            // arrange
            for (const name of ['platform-core', 'platform-database', 'platform-mailing']) {
                const directory = path.join(tempDirectory, name);
                fs.mkdirSync(directory, { recursive: true });
                fs.writeFileSync(
                    path.join(directory, 'index.md'),
                    [
                        '---',
                        `title: ${name}`,
                        `description: ${name} description.`,
                        `tags: [${name}]`,
                        `package: '@pixel-brewery/archipel-${name}'`,
                        '---',
                        '',
                        `# ${name}`,
                    ].join('\n'),
                );
            }

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.packages.size).toBe(3);
            expect(loader.packages.has('platform-core')).toBe(true);
            expect(loader.packages.has('platform-database')).toBe(true);
            expect(loader.packages.has('platform-mailing')).toBe(true);
        });

        it('should use directory name as fallback title when frontmatter title is missing', () => {
            // arrange
            const directory = path.join(tempDirectory, 'platform-fallback');
            fs.mkdirSync(directory, { recursive: true });
            fs.writeFileSync(path.join(directory, 'index.md'), ['---', 'description: No title here.', '---', '', 'Content only.'].join('\n'));

            stubDocsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const packageDoc = loader.packages.get('platform-fallback')!;
            expect(packageDoc.title).toBe('platform-fallback');
        });
    });

    // #endregion

    // #region search() Tests

    describe('search()', () => {
        beforeEach(() => {
            const packageDirectory1 = path.join(tempDirectory, 'platform-core');
            fs.mkdirSync(packageDirectory1, { recursive: true });
            fs.writeFileSync(
                path.join(packageDirectory1, 'index.md'),
                [
                    '---',
                    'title: platform-core',
                    'description: Foundation library with mapping and events.',
                    'tags: [core, mapping, events]',
                    "package: '@pixel-brewery/archipel-platform-core'",
                    '---',
                    '',
                    '# platform-core',
                    '',
                    'Provides MappingService, EventHub, and template engines.',
                ].join('\n'),
            );

            const packageDirectory2 = path.join(tempDirectory, 'platform-database');
            fs.mkdirSync(packageDirectory2, { recursive: true });
            fs.writeFileSync(
                path.join(packageDirectory2, 'index.md'),
                [
                    '---',
                    'title: platform-database',
                    'description: Database access via Prisma.',
                    'tags: [database, prisma, postgresql]',
                    "package: '@pixel-brewery/archipel-platform-database'",
                    '---',
                    '',
                    '# platform-database',
                    '',
                    'Wraps PrismaService with health checks.',
                ].join('\n'),
            );

            stubDocsDirectory(loader, tempDirectory);

            loader.load();
        });

        it('should find packages by name', () => {
            // arrange & act
            const results = loader.search('core');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('platform-core');
        });

        it('should find packages by description', () => {
            // arrange & act
            const results = loader.search('Prisma');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('platform-database');
        });

        it('should find packages by tag', () => {
            // arrange & act
            const results = loader.search('mapping');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('platform-core');
        });

        it('should find packages by content', () => {
            // arrange & act
            const results = loader.search('MappingService');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('platform-core');
        });

        it('should return empty array when no match', () => {
            // arrange & act
            const results = loader.search('nonexistent-xyz');

            // assert
            expect(results).toHaveLength(0);
        });

        it('should be case-insensitive', () => {
            // arrange & act
            const results = loader.search('PRISMA');

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('platform-database');
        });
    });

    // #endregion
});
