// #region Imports

import { IResourceResult } from '../types/IResourceResult.js';
import { IResourceStrategy } from './abstracts/IResourceStrategy.js';
import { Logger } from '@nestjs/common';

// #endregion

/**
 * Minimal blob service interface to avoid circular dependencies.
 *
 * @public
 */
export interface IBlobServiceAdapter {
    /**
     * Downloads a file from blob storage.
     *
     * @param key The blob key
     * @returns The download result
     */
    downloadFile(key: string): Promise<{
        data: Buffer | string | unknown;
        contentType?: string;
    }>;
}

// #endregion

/**
 * Configuration for the blob resource strategy.
 *
 * @public
 */
export interface IBlobResourceStrategyConfig {
    /**
     * Optional key prefix for blob storage.
     * @example 'resources/', 'templates/'
     */
    keyPrefix?: string;
}

/**
 * Strategy for loading resources from blob storage.
 *
 * @public
 */
export class BlobResourceStrategy implements IResourceStrategy {
    // #region Fields

    private readonly _blobService: IBlobServiceAdapter;
    private readonly _config: IBlobResourceStrategyConfig;
    private readonly _logger = new Logger(BlobResourceStrategy.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `BlobResourceStrategy` class.
     *
     * @public
     */
    public constructor(blobService: IBlobServiceAdapter, config: IBlobResourceStrategyConfig = {}) {
        this._blobService = blobService;
        this._config = config;
    }

    // #endregion

    // #region Properties

    public get name(): string {
        return 'blob';
    }

    // #endregion

    // #region Methods

    /**
     * Loads a resource by its key.
     * Note: Blob storage is inherently async, so this delegates to loadAsync internally.
     *
     * @public
     * @param key The resource key
     * @returns The resource result or undefined if not found
     */
    public load(key: string): IResourceResult | undefined {
        throw new Error(`BlobResourceStrategy.load() cannot be synchronous. Use loadAsync() instead for key: ${key}`);
    }

    /**
     * Loads a resource by its key (asynchronous).
     *
     * @public
     * @param key The resource key
     * @returns Promise resolving to the resource result or undefined if not found
     */
    public async loadAsync(key: string): Promise<IResourceResult | undefined> {
        const fullKey = this.buildKey(key);

        try {
            const result = await this._blobService.downloadFile(fullKey);

            if (!result.data) {
                this._logger.debug(`Resource '${fullKey}' not found in blob storage`);
                return undefined;
            }

            const content = Buffer.isBuffer(result.data) ? result.data : Buffer.from(result.data as string);

            return {
                content: content,
                metadata: {
                    key: key,
                    path: fullKey,
                    mimeType: result.contentType ?? 'application/octet-stream',
                    size: content.length,
                    source: this.name,
                },
            };
        } catch (error) {
            this._logger.error(`Failed to load resource from blob storage: ${fullKey}`, error);
            return undefined;
        }
    }

    /**
     * Checks if a resource exists without loading it.
     * Note: Blob storage is inherently async, so this delegates to existsAsync internally.
     *
     * @public
     * @param key The resource key
     * @returns True if the resource exists
     */
    public exists(key: string): boolean {
        throw new Error(`BlobResourceStrategy.exists() cannot be synchronous. Use existsAsync() instead for key: ${key}`);
    }

    /**
     * Checks if a resource exists without loading it (asynchronous).
     *
     * @public
     * @param key The resource key
     * @returns Promise resolving to true if the resource exists
     */
    public async existsAsync(key: string): Promise<boolean> {
        const fullKey = this.buildKey(key);

        try {
            await this._blobService.downloadFile(fullKey);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * List all files and folders in the base paths for debugging purposes.
     *
     * @public
     */
    public whatDoIHave(): void {
        this._logger.warn('BlobResourceStrategy.whatDoIHave() is not implemented due to blob storage limitations.');
    }

    // #endregion

    // #region Private Methods

    private buildKey(key: string): string {
        if (!this._config.keyPrefix) {
            return key;
        }

        return `${this._config.keyPrefix}${key}`;
    }

    // #endregion
}
