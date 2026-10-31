// #region Imports

import * as fs from 'node:fs';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PatternsLoader } from './PatternsLoader.js';

// #endregion

/**
 * Stubs the private `resolvePatternsDirectory` method on a PatternsLoader instance
 * so that `load()` reads from the given directory instead of the real paths.
 */
function stubPatternsDirectory(loader: PatternsLoader, directory: string | null): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.spyOn(PatternsLoader.prototype as any, 'resolvePatternsDirectory').mockReturnValue(directory);
}

describe('PatternsLoader', () => {
    // #region Fields

    let loader: PatternsLoader;
    let tempDirectory: string;

    // #endregion

    // #region Setup

    beforeEach(() => {
        loader = new PatternsLoader();
        const tmpBase = path.join(process.cwd(), 'tmp');
        fs.mkdirSync(tmpBase, { recursive: true });
        tempDirectory = fs.mkdtempSync(path.join(tmpBase, 'patterns-loader-test-'));
    });

    afterEach(() => {
        fs.rmSync(tempDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    // #endregion

    // #region load() Tests

    describe('load()', () => {
        it('should load a pattern from a valid directory', () => {
            // arrange
            fs.writeFileSync(
                path.join(tempDirectory, 'config-pattern.md'),
                [
                    '---',
                    'title: Configuration Pattern',
                    'description: Typed config keys and ConfigService.',
                    'order: 1',
                    '---',
                    '',
                    '# Configuration Pattern',
                    '',
                    'Use createConfigKey to define typed config entries.',
                ].join('\n'),
            );

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.patterns.size).toBe(1);
            expect(loader.patterns.has('config-pattern')).toBe(true);

            const pattern = loader.patterns.get('config-pattern')!;
            expect(pattern.name).toBe('config-pattern');
            expect(pattern.title).toBe('Configuration Pattern');
            expect(pattern.description).toBe('Typed config keys and ConfigService.');
            expect(pattern.order).toBe(1);
            expect(pattern.content).toContain('# Configuration Pattern');
            expect(pattern.content).toContain('createConfigKey');
        });

        it('should skip index.md', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'index.md'), ['---', 'title: Index', '---', '', 'Overview page.'].join('\n'));

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.patterns.size).toBe(0);
        });

        it('should skip non-markdown files', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'notes.txt'), 'plain text');

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.patterns.size).toBe(0);
        });

        it('should produce empty patterns when directory is not found', () => {
            // arrange
            stubPatternsDirectory(loader, null);

            // act
            loader.load();

            // assert
            expect(loader.patterns.size).toBe(0);
        });

        it('should load multiple patterns', () => {
            // arrange
            const names = ['config-pattern', 'dto-pattern', 'error-handling-pattern'] as const;

            for (const [i, name] of names.entries()) {
                fs.writeFileSync(
                    path.join(tempDirectory, `${name}.md`),
                    ['---', `title: ${name}`, `description: Pattern for ${name}.`, `order: ${i + 1}`, '---', '', `# ${name}`].join('\n'),
                );
            }

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            expect(loader.patterns.size).toBe(3);
            expect(loader.patterns.has('config-pattern')).toBe(true);
            expect(loader.patterns.has('dto-pattern')).toBe(true);
            expect(loader.patterns.has('error-handling-pattern')).toBe(true);
        });

        it('should use filename as fallback title when frontmatter title is missing', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'query-pattern.md'), ['---', 'description: No title.', '---', '', 'Some content.'].join('\n'));

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const pattern = loader.patterns.get('query-pattern')!;
            expect(pattern.title).toBe('query-pattern');
        });

        it('should default order to 999 when missing', () => {
            // arrange
            fs.writeFileSync(path.join(tempDirectory, 'module-pattern.md'), ['---', 'title: Module Pattern', '---', '', 'Content.'].join('\n'));

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const pattern = loader.patterns.get('module-pattern')!;
            expect(pattern.order).toBe(999);
        });

        it('should strip frontmatter from content', () => {
            // arrange
            fs.writeFileSync(
                path.join(tempDirectory, 'testing-pattern.md'),
                [
                    '---',
                    'title: Testing Pattern',
                    'description: Vitest conventions.',
                    'order: 9',
                    '---',
                    '',
                    '# Testing Pattern',
                    '',
                    'Use vi.fn() for mocks.',
                ].join('\n'),
            );

            stubPatternsDirectory(loader, tempDirectory);

            // act
            loader.load();

            // assert
            const pattern = loader.patterns.get('testing-pattern')!;
            expect(pattern.content).not.toContain('---');
            expect(pattern.content).toContain('# Testing Pattern');
        });
    });

    // #endregion
});
