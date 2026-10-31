// #region Imports

import { IResourceResult } from './types/IResourceResult.js';
import { IResourceStrategy } from './strategies/abstracts/IResourceStrategy.js';
import { Injectable, Logger } from '@nestjs/common';
import { ILayeredCache } from '@pixel-brewery/archipel-platform-caching';
import { ResourceNotFoundError } from './errors/ResourceNotFoundError.js';

// #endregion

/**
 * Configuration for the ResourceManager.
 *
 * @public
 */
export interface IResourceManagerConfig {
    /**
     * Resource loading strategies in priority order.
     * First strategy that finds the resource wins.
     */
    strategies: Array<IResourceStrategy>;

    /**
     * Optional cache for loaded resources.
     */
    cache?: ILayeredCache<string, IResourceResult>;

    /**
     * Cache TTL in seconds.
     * @default 3600 (1 hour)
     */
    cacheTtl?: number;

    /**
     * Enable debug logging.
     * @default false
     */
    debug?: boolean;

    /**
     * Timeout in milliseconds for a single async strategy load.
     * @default 30000 (30 seconds)
     */
    strategyTimeoutMs?: number;
}

interface IResourceManager {
    load(key: string): IResourceResult;
    tryLoad(key: string): IResourceResult | undefined;
    loadAsync(key: string): Promise<IResourceResult>;
    tryLoadAsync(key: string): Promise<IResourceResult | undefined>;
    loadAsString(key: string, encoding?: NodeJS.BufferEncoding): string;
    tryLoadAsString(key: string, encoding?: NodeJS.BufferEncoding): string | undefined;
    loadAsStringAsync(key: string, encoding?: NodeJS.BufferEncoding): Promise<string>;
    tryLoadAsStringAsync(key: string, encoding?: NodeJS.BufferEncoding): Promise<string | undefined>;
    loadAsBuffer(key: string): Buffer | undefined;
    tryLoadAsBuffer(key: string): Buffer | undefined;
    loadAsBufferAsync(key: string): Promise<Buffer | undefined>;
    tryLoadAsBufferAsync(key: string): Promise<Buffer | undefined>;
    exists(key: string): boolean;
    existsAsync(key: string): Promise<boolean>;
    invalidate(key: string): void;
    invalidateAsync(key: string): Promise<void>;
    whatDoIHave(): void;
}

/**
 * Central manager for loading resources from various sources.
 * Supports multiple strategies (file, blob, embedded) with caching.
 *
 * @public
 */
@Injectable()
export class ResourceManager implements IResourceManager {
    // #region Fields

    private readonly _strategies: Array<IResourceStrategy>;
    private readonly _cache?: ILayeredCache<string, IResourceResult>;
    private readonly _cacheTtl: number;
    private readonly _strategyTimeoutMs: number;
    private readonly _logger = new Logger(ResourceManager.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `ResourceManager` class.
     *
     * @public
     */
    public constructor(config: IResourceManagerConfig) {
        this._strategies = config.strategies;
        this._cache = config.cache;
        this._cacheTtl = config.cacheTtl ?? 3600;
        this._strategyTimeoutMs = config.strategyTimeoutMs ?? 30_000;

        this._logger.log(`ResourceManager initialized with ${this._strategies.length} strategies: ${this._strategies.map((s) => s.name).join(', ')}`);
    }

    // #endregion

    // #region Methods

    public load(key: string): IResourceResult {
        const result = this.tryLoad(key);
        if (!result) {
            throw new ResourceNotFoundError(key);
        }
        return result;
    }

    public tryLoad(key: string): IResourceResult | undefined {
        if (this._cache) {
            const cached = this._cache.get(key);
            if (cached) {
                this._logger.debug(`Resource loaded from cache: ${key}`);
                return cached;
            }
        }
        for (const strategy of this._strategies) {
            this._logger.debug(`Trying strategy '${strategy.name}' for resource: ${key}`);
            const result = strategy.load(key);
            if (result) {
                this._logger.log(`Resource loaded via '${strategy.name}': ${key}`);
                if (this._cache) {
                    this._cache.set(key, result);
                }
                return result;
            }
        }
        this._logger.warn(`Resource '${key}' not found in any strategy`);
        return undefined;
    }

    public async loadAsync(key: string): Promise<IResourceResult> {
        const result = await this.tryLoadAsync(key);
        if (!result) {
            throw new ResourceNotFoundError(key);
        }
        return result;
    }

    public async tryLoadAsync(key: string): Promise<IResourceResult | undefined> {
        if (this._cache) {
            const cached = await this._cache.getAsync(key);
            if (cached) {
                this._logger.debug(`Resource loaded from cache: ${key}`);
                return cached;
            }
        }
        for (const strategy of this._strategies) {
            this._logger.debug(`Trying strategy '${strategy.name}' for resource: ${key}`);
            const result = await Promise.race([
                strategy.loadAsync(key),
                new Promise<undefined>((_, reject) =>
                    setTimeout(
                        () => reject(new Error(`Strategy '${strategy.name}' timed out after ${this._strategyTimeoutMs}ms for resource '${key}'`)),
                        this._strategyTimeoutMs,
                    ),
                ),
            ]).catch((error: unknown) => {
                this._logger.warn(`Strategy '${strategy.name}' failed for resource '${key}': ${(error as Error).message}`);
                return undefined;
            });
            if (result) {
                this._logger.log(`Resource loaded via '${strategy.name}': ${key}`);
                if (this._cache) {
                    await this._cache.setAsync(key, result);
                }
                return result;
            }
        }
        this._logger.warn(`Resource '${key}' not found in any strategy`);
        return undefined;
    }

    public loadAsString(key: string, encoding: NodeJS.BufferEncoding = 'utf-8'): string {
        const str = this.tryLoadAsString(key, encoding);
        if (str === undefined) {
            throw new ResourceNotFoundError(key);
        }
        return str;
    }

    public tryLoadAsString(key: string, encoding: NodeJS.BufferEncoding = 'utf-8'): string | undefined {
        const result = this.tryLoad(key);
        if (!result) {
            return undefined;
        }
        return result.content.toString(encoding);
    }

    public async loadAsStringAsync(key: string, encoding: NodeJS.BufferEncoding = 'utf-8'): Promise<string> {
        const str = await this.tryLoadAsStringAsync(key, encoding);
        if (str === undefined) {
            throw new ResourceNotFoundError(key);
        }
        return str;
    }

    public async tryLoadAsStringAsync(key: string, encoding: NodeJS.BufferEncoding = 'utf-8'): Promise<string | undefined> {
        const result = await this.tryLoadAsync(key);
        if (!result) {
            return undefined;
        }
        return result.content.toString(encoding);
    }

    public loadAsBuffer(key: string): Buffer {
        const buffer = this.tryLoadAsBuffer(key);
        if (!buffer) {
            throw new ResourceNotFoundError(key);
        }
        return buffer;
    }

    public tryLoadAsBuffer(key: string): Buffer | undefined {
        const result = this.tryLoad(key);
        return result?.content;
    }

    public async loadAsBufferAsync(key: string): Promise<Buffer> {
        const buffer = await this.tryLoadAsBufferAsync(key);
        if (!buffer) {
            throw new ResourceNotFoundError(key);
        }
        return buffer;
    }

    public async tryLoadAsBufferAsync(key: string): Promise<Buffer | undefined> {
        const result = await this.tryLoadAsync(key);
        return result?.content;
    }

    public exists(key: string): boolean {
        for (const strategy of this._strategies) {
            if (strategy.exists(key)) {
                return true;
            }
        }
        return false;
    }

    public async existsAsync(key: string): Promise<boolean> {
        for (const strategy of this._strategies) {
            if (await strategy.existsAsync(key)) {
                return true;
            }
        }
        return false;
    }

    public invalidate(key: string): void {
        if (this._cache) {
            this._cache.invalidate(key);
            this._logger.debug(`Cache invalidated for resource: ${key}`);
        }
    }

    public async invalidateAsync(key: string): Promise<void> {
        if (this._cache) {
            await this._cache.invalidateAsync(key);
            this._logger.debug(`Cache invalidated for resource: ${key}`);
        }
    }

    public whatDoIHave(): void {
        this._logger.log('ResourceManager contents:');
        for (const strategy of this._strategies) {
            this._logger.log(`Strategy: ${strategy.name}`);
            strategy.whatDoIHave();
        }
    }

    // #endregion
}
