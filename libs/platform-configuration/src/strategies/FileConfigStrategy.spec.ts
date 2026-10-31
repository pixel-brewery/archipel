// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigKeyNotFoundError } from '../errors/ConfigKeyNotFoundError.js';
import { FileConfigStrategy } from './FileConfigStrategy.js';

// #endregion

// #region Mocks

vi.mock('node:fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
}));

vi.mock('dotenv', () => ({
    parse: vi.fn(),
}));

// #endregion

// #region Tests

describe('FileConfigStrategy', () => {
    let strategy: FileConfigStrategy;

    beforeEach(async () => {
        strategy = new FileConfigStrategy('/path/to/.env');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('initialize', () => {
        it('should parse the env file when it exists', async () => {
            // arrange
            const fs = await import('node:fs');
            const dotenv = await import('dotenv');
            (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue('DB_HOST=localhost');
            (dotenv.parse as ReturnType<typeof vi.fn>).mockReturnValue({ DB_HOST: 'localhost' });

            // act
            strategy.initialize();

            // assert
            expect(fs.existsSync).toHaveBeenCalledWith('/path/to/.env');
            expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/.env');
            expect(strategy.resolve('DB_HOST')).toBe('localhost');
        });

        it('should not parse when the file does not exist', async () => {
            // arrange
            const fs = await import('node:fs');
            const dotenv = await import('dotenv');
            vi.mocked(fs.existsSync).mockReturnValue(false);
            vi.mocked(dotenv.parse).mockClear();

            const freshStrategy = new FileConfigStrategy('/path/to/.env');

            // act
            freshStrategy.initialize();

            // assert
            expect(dotenv.parse).not.toHaveBeenCalled();
            expect(freshStrategy.has('ANY_KEY')).toBe(false);
        });
    });

    describe('resolve', () => {
        it('should return the value when key exists', async () => {
            // arrange
            const fs = await import('node:fs');
            const dotenv = await import('dotenv');
            (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue('');
            (dotenv.parse as ReturnType<typeof vi.fn>).mockReturnValue({ API_KEY: 'secret' });
            strategy.initialize();

            // act
            const result = strategy.resolve<string>('API_KEY');

            // assert
            expect(result).toBe('secret');
        });

        it('should throw ConfigKeyNotFoundError when key is missing', () => {
            // act & assert
            expect(() => strategy.resolve('MISSING')).toThrow(ConfigKeyNotFoundError);
            expect(() => strategy.resolve('MISSING')).toThrow('Config key: MISSING not found in env file: /path/to/.env');
        });
    });

    describe('tryResolve', () => {
        it('should return the value when key exists', async () => {
            // arrange
            const fs = await import('node:fs');
            const dotenv = await import('dotenv');
            (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue('');
            (dotenv.parse as ReturnType<typeof vi.fn>).mockReturnValue({ PORT: '3000' });
            strategy.initialize();

            // act
            const result = strategy.tryResolve<string>('PORT', '8080');

            // assert
            expect(result).toBe('3000');
        });

        it('should return the fallback when key is missing', () => {
            // act
            const result = strategy.tryResolve<string>('MISSING', 'default');

            // assert
            expect(result).toBe('default');
        });
    });

    describe('has', () => {
        it('should return true when key exists', async () => {
            // arrange
            const fs = await import('node:fs');
            const dotenv = await import('dotenv');
            (fs.existsSync as ReturnType<typeof vi.fn>).mockReturnValue(true);
            (fs.readFileSync as ReturnType<typeof vi.fn>).mockReturnValue('');
            (dotenv.parse as ReturnType<typeof vi.fn>).mockReturnValue({ KEY: 'val' });
            strategy.initialize();

            // act & assert
            expect(strategy.has('KEY')).toBe(true);
        });

        it('should return false when key does not exist', () => {
            // act & assert
            expect(strategy.has('NOPE')).toBe(false);
        });
    });
});

// #endregion
