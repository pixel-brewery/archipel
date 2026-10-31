// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

// #endregion

// #region Mocks

vi.mock('node:fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
    statSync: vi.fn(),
    readdirSync: vi.fn(),
}));

vi.mock('glob', () => ({
    glob: { sync: vi.fn().mockReturnValue([]) },
}));

vi.mock('mime-types', () => ({
    lookup: vi.fn().mockReturnValue('text/html'),
}));

// #endregion

// #region Tests

describe('FileResourceStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have name "file"', async () => {
        // arrange
        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp/resources'] });

        // act / assert
        expect(strategy.name).toBe('file');
    });

    it('should load a file when it exists', async () => {
        // arrange
        const fs = await import('node:fs');
        (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
        (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('<h1>Hello</h1>'));
        (fs.statSync as ReturnType<typeof vi.fn>).mockReturnValue({ size: 14 });

        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp/resources'] });

        // act
        const result = strategy.load('template.html');

        // assert
        expect(result).toBeDefined();
        expect(result!.content.toString()).toBe('<h1>Hello</h1>');
        expect(result!.metadata.key).toBe('template.html');
        expect(result!.metadata.source).toBe('file');
    });

    it('should return undefined when file does not exist', async () => {
        // arrange
        const fs = await import('node:fs');
        (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(false);

        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp/resources'] });

        // act
        const result = strategy.load('missing.txt');

        // assert
        expect(result).toBeUndefined();
    });

    it('should check existence correctly', async () => {
        // arrange
        const fs = await import('node:fs');
        (fs.existsSync as ReturnType<typeof vi.fn>).mockImplementation((path: string) => path.includes('found.txt'));

        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp'] });

        // act / assert
        expect(strategy.exists('found.txt')).toBe(true);
        expect(strategy.exists('nope.txt')).toBe(false);
    });

    it('should delegate loadAsync to load', async () => {
        // arrange
        const fs = await import('node:fs');
        (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
        (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue(Buffer.from('async'));
        (fs.statSync as ReturnType<typeof vi.fn>).mockReturnValue({ size: 5 });

        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp'] });

        // act
        const result = await strategy.loadAsync('file.txt');

        // assert
        expect(result).toBeDefined();
    });

    it('should not throw on whatDoIHave', async () => {
        // arrange
        const fs = await import('node:fs');
        (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
        (fs.readdirSync as ReturnType<typeof vi.fn>).mockReturnValue(['a.txt', 'b.txt']);

        const { FileResourceStrategy } = await import('./FileResourceStrategy.js');
        const strategy = new FileResourceStrategy({ basePaths: ['/tmp'] });

        // act / assert
        expect(() => strategy.whatDoIHave()).not.toThrow();
    });
});

// #endregion
