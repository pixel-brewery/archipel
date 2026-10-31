// #region Imports

import { IResourceResult } from '../types/IResourceResult.js';
import { IResourceStrategy } from './abstracts/IResourceStrategy.js';
import { Logger } from '@nestjs/common';
import { existsSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { glob } from 'glob';
import { lookup } from 'mime-types';

// #endregion

/**
 * Configuration for the file resource strategy.
 *
 * @public
 */
export interface IFileResourceStrategyConfig {
    /**
     * Base paths to search for resources.
     * Paths are tried in order until the resource is found.
     */
    basePaths: Array<string>;

    /**
     * Optional default encoding for text files.
     * @default 'utf-8'
     */
    defaultEncoding?: 'utf-8' | 'ascii' | 'utf8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'base64url' | 'latin1' | 'binary' | 'hex';

    /**
     * Enable recursive search in subdirectories.
     * When enabled, the strategy will search for files in all subdirectories
     * of the base paths using glob patterns.
     * @default false
     */
    includeSubfolders?: boolean;
}

/**
 * Strategy for loading resources from the local file system.
 *
 * @public
 */
export class FileResourceStrategy implements IResourceStrategy {
    // #region Fields

    private readonly _config: IFileResourceStrategyConfig;
    private readonly _logger = new Logger(FileResourceStrategy.name);

    // #endregion

    // #region Ctor

    public constructor(config: IFileResourceStrategyConfig) {
        this._config = {
            ...config,
            defaultEncoding: config.defaultEncoding ?? 'utf-8',
            includeSubfolders: config.includeSubfolders ?? false,
        };
    }

    // #endregion

    // #region Properties

    public get name(): string {
        return 'file';
    }

    // #endregion

    // #region Methods

    public load(key: string): IResourceResult | undefined {
        const resolvedPath = this.resolvePath(key);
        if (!resolvedPath) {
            this._logger.debug(`Resource not found: ${key}`);
            return undefined;
        }
        try {
            const content = readFileSync(resolvedPath);
            const stats = statSync(resolvedPath);
            const mimeType = lookup(resolvedPath) || 'application/octet-stream';
            return {
                content: content,
                metadata: {
                    key: key,
                    path: resolvedPath,
                    mimeType: mimeType,
                    size: stats.size,
                    encoding: this._config.defaultEncoding,
                    source: this.name,
                },
            };
        } catch (error) {
            this._logger.error(`Failed to load resource: ${key}`, error);
            return undefined;
        }
    }

    public async loadAsync(key: string): Promise<IResourceResult | undefined> {
        return this.load(key);
    }

    public exists(key: string): boolean {
        return this.resolvePath(key) !== undefined;
    }

    public async existsAsync(key: string): Promise<boolean> {
        return this.exists(key);
    }

    public whatDoIHave(): void {
        this._logger.debug('Listing resources in base paths:');
        for (const basePath of this._config.basePaths) {
            this._logger.debug(` - ${basePath}:`);
        }
        for (const basePath of this._config.basePaths) {
            this._logger.debug(`Contents of ${basePath}:`);
            try {
                if (!existsSync(basePath)) {
                    this._logger.debug(' - Path does not exist.');
                    continue;
                }
                const items = readdirSync(basePath);
                for (const item of items) {
                    this._logger.debug(` - ${item}`);
                }
            } catch (error) {
                this._logger.error(`Failed to read contents of ${basePath}`, error);
            }
        }
    }

    // #endregion

    // #region Private Methods

    private resolvePath(key: string): string | undefined {
        for (const basePath of this._config.basePaths) {
            const fullPath = resolve(join(basePath, key));
            if (existsSync(fullPath)) {
                this._logger.debug(`Resource resolved (direct): ${key} -> ${fullPath}`);
                return fullPath;
            }
        }
        if (this._config.includeSubfolders) {
            return this.resolvePathWithGlob(key);
        }
        return undefined;
    }

    private resolvePathWithGlob(key: string): string | undefined {
        for (const basePath of this._config.basePaths) {
            try {
                const escapedKey = key.replace(/[*?[\]{}()!]/g, '\\$&');
                const pattern = join(basePath, '**', escapedKey);
                this._logger.debug(`Searching with glob pattern: ${pattern}`);
                const matches = glob.sync(pattern, {
                    absolute: true,
                    nodir: true,
                    dot: false,
                });
                if (matches.length > 0) {
                    const resolvedPath = matches[0];
                    this._logger.debug(`Resource resolved (glob): ${key} -> ${resolvedPath}`);
                    if (matches.length > 1) {
                        this._logger.warn(
                            `Multiple matches found for "${key}" in ${basePath}. Using first match: ${resolvedPath}. ` +
                                `Other matches: ${matches.slice(1).join(', ')}`,
                        );
                    }
                    return resolvedPath;
                }
            } catch (error) {
                this._logger.error(`Glob search failed for ${key} in ${basePath}`, error);
            }
        }
        return undefined;
    }

    // #endregion
}
