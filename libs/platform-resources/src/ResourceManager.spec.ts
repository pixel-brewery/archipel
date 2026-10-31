// #region Imports

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResourceManager } from './ResourceManager.js';
import { EmbeddedResourceStrategy } from './strategies/EmbeddedResourceStrategy.js';
import { FileResourceStrategy } from './strategies/FileResourceStrategy.js';
import { IResourceStrategy } from './strategies/abstracts/IResourceStrategy.js';

// #endregion

describe('ResourceManager', () => {
    // #region Fields

    let resourceManager: ResourceManager;
    let mockStrategy: IResourceStrategy;

    // #endregion

    // #region Setup

    beforeEach(() => {
        mockStrategy = {
            name: 'mock',
            load: vi.fn(),
            loadAsync: vi.fn(),
            exists: vi.fn(),
            existsAsync: vi.fn(),
            whatDoIHave: vi.fn(),
        };
    });

    // #endregion

    // #region Constructor Tests

    describe('constructor', () => {
        it('should create instance with strategies', () => {
            // arrange & act
            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // assert
            expect(resourceManager).toBeDefined();
        });

        it('should create instance with cache', () => {
            // arrange
            const mockCache = {
                get: vi.fn(),
                set: vi.fn(),
                invalidate: vi.fn(),
            };

            // act
            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
                cache: mockCache as unknown as import('@pixel-brewery/archipel-platform-caching').ILayeredCache<
                    string,
                    import('./types/IResourceResult.js').IResourceResult
                >,
                cacheTtl: 3600,
            });

            // assert
            expect(resourceManager).toBeDefined();
        });
    });

    // #endregion

    // #region load() Tests

    describe('load()', () => {
        it('should load resource from first matching strategy', () => {
            // arrange
            const mockResult = {
                content: Buffer.from('test content'),
                metadata: {
                    key: 'test.txt',
                    path: 'test.txt',
                    mimeType: 'text/plain',
                    size: 12,
                    source: 'mock',
                },
            };

            vi.mocked(mockStrategy.load).mockReturnValue(mockResult);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.load('test.txt');

            // assert
            expect(result).toEqual(mockResult);
            expect(mockStrategy.load).toHaveBeenCalledWith('test.txt');
        });

        it('should try multiple strategies in order', () => {
            // arrange
            const strategy1: IResourceStrategy = {
                name: 'strategy1',
                load: vi.fn().mockReturnValue(undefined),
                loadAsync: vi.fn(),
                exists: vi.fn(),
                existsAsync: vi.fn(),
                whatDoIHave: vi.fn(),
            };

            const strategy2: IResourceStrategy = {
                name: 'strategy2',
                load: vi.fn().mockReturnValue({
                    content: Buffer.from('found'),
                    metadata: {
                        key: 'test.txt',
                        path: 'test.txt',
                        mimeType: 'text/plain',
                        size: 5,
                        source: 'strategy2',
                    },
                }),
                loadAsync: vi.fn(),
                exists: vi.fn(),
                existsAsync: vi.fn(),
                whatDoIHave: vi.fn(),
            };

            resourceManager = new ResourceManager({
                strategies: [strategy1, strategy2],
            });

            // act
            const result = resourceManager.load('test.txt');

            // assert
            expect(strategy1.load).toHaveBeenCalledWith('test.txt');
            expect(strategy2.load).toHaveBeenCalledWith('test.txt');
            expect(result?.metadata.source).toBe('strategy2');
        });

        it('should return undefined when resource not found', () => {
            // arrange
            vi.mocked(mockStrategy.load).mockReturnValue(undefined);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.tryLoad('nonexistent.txt');

            // assert
            expect(result).toBeUndefined();
        });
    });

    // #endregion

    // #region loadAsString() Tests

    describe('loadAsString()', () => {
        it('should load resource as string', () => {
            // arrange
            const mockResult = {
                content: Buffer.from('test content'),
                metadata: {
                    key: 'test.txt',
                    path: 'test.txt',
                    mimeType: 'text/plain',
                    size: 12,
                    source: 'mock',
                },
            };

            vi.mocked(mockStrategy.load).mockReturnValue(mockResult);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.loadAsString('test.txt');

            // assert
            expect(result).toBe('test content');
        });

        it('should return undefined when resource not found', () => {
            // arrange
            vi.mocked(mockStrategy.load).mockReturnValue(undefined);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.tryLoadAsString('nonexistent.txt');

            // assert
            expect(result).toBeUndefined();
        });
    });

    // #endregion

    // #region loadAsBuffer() Tests

    describe('loadAsBuffer()', () => {
        it('should load resource as buffer', () => {
            // arrange
            const buffer = Buffer.from('test content');
            const mockResult = {
                content: buffer,
                metadata: {
                    key: 'test.txt',
                    path: 'test.txt',
                    mimeType: 'text/plain',
                    size: 12,
                    source: 'mock',
                },
            };

            vi.mocked(mockStrategy.load).mockReturnValue(mockResult);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.loadAsBuffer('test.txt');

            // assert
            expect(result).toEqual(buffer);
        });
    });

    // #endregion

    // #region exists() Tests

    describe('exists()', () => {
        it('should return true when resource exists', () => {
            // arrange
            vi.mocked(mockStrategy.exists).mockReturnValue(true);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.exists('test.txt');

            // assert
            expect(result).toBe(true);
            expect(mockStrategy.exists).toHaveBeenCalledWith('test.txt');
        });

        it('should return false when resource does not exist', () => {
            // arrange
            vi.mocked(mockStrategy.exists).mockReturnValue(false);

            resourceManager = new ResourceManager({
                strategies: [mockStrategy],
            });

            // act
            const result = resourceManager.exists('nonexistent.txt');

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion

    // #region Integration Tests

    describe('Integration with FileResourceStrategy', () => {
        it('should check if resource exists in configured paths', () => {
            // arrange
            const fileStrategy = new FileResourceStrategy({
                basePaths: [`${import.meta.dirname}/../../assets`],
            });

            resourceManager = new ResourceManager({
                strategies: [fileStrategy],
            });

            // act
            const exists = resourceManager.exists('index.html');

            // assert
            expect(typeof exists).toBe('boolean');
        });
    });

    describe('Integration with EmbeddedResourceStrategy', () => {
        it('should load embedded resource', () => {
            // arrange
            const embeddedStrategy = new EmbeddedResourceStrategy({
                'test.txt': 'Hello, World!',
            });

            resourceManager = new ResourceManager({
                strategies: [embeddedStrategy],
            });

            // act
            const content = resourceManager.loadAsString('test.txt');

            // assert
            expect(content).toBe('Hello, World!');
        });
    });

    // #endregion
});
