// #region Imports

import { IResourceResult } from '../types/IResourceResult.js';
import { IResourceStrategy } from './abstracts/IResourceStrategy.js';
import { Logger } from '@nestjs/common';

// #endregion

/**
 * Strategy for loading embedded resources from memory.
 *
 * @public
 */
export class EmbeddedResourceStrategy implements IResourceStrategy {
    // #region Fields

    private readonly _resources: Map<string, string>;
    private readonly _logger = new Logger(EmbeddedResourceStrategy.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `EmbeddedResourceStrategy` class.
     *
     * @public
     */
    public constructor(resources: Record<string, string> = {}) {
        this._resources = new Map(Object.entries(resources));
    }

    // #endregion

    // #region Properties

    public get name(): string {
        return 'embedded';
    }

    // #endregion

    // #region Methods

    /**
     * Loads a resource by its key.
     *
     * @public
     * @param key The resource key
     * @returns The resource result or undefined if not found
     */
    public load(key: string): IResourceResult | undefined {
        const content = this._resources.get(key);

        if (!content) {
            this._logger.debug(`Embedded resource not found: ${key}`);
            return undefined;
        }

        const buffer = Buffer.from(content, 'utf-8');

        return {
            content: buffer,
            metadata: {
                key: key,
                path: key,
                mimeType: 'text/plain',
                size: buffer.length,
                encoding: 'utf-8',
                source: this.name,
            },
        };
    }

    /**
     * Loads a resource by its key (asynchronous).
     *
     * @public
     * @param key The resource key
     * @returns Promise resolving to the resource result or undefined if not found
     */
    public async loadAsync(key: string): Promise<IResourceResult | undefined> {
        return this.load(key);
    }

    /**
     * Checks if a resource exists without loading it.
     *
     * @public
     * @param key The resource key
     * @returns True if the resource exists
     */
    public exists(key: string): boolean {
        return this._resources.has(key);
    }

    /**
     * Checks if a resource exists without loading it (asynchronous).
     *
     * @public
     * @param key The resource key
     * @returns Promise resolving to true if the resource exists
     */
    public async existsAsync(key: string): Promise<boolean> {
        return this.exists(key);
    }

    /**
     * Registers a new embedded resource.
     *
     * @public
     * @param key The resource key
     * @param content The resource content
     */
    public register(key: string, content: string): void {
        this._resources.set(key, content);
    }

    /**
     * List all files and folders in the base paths for debugging purposes.
     *
     * @public
     */
    public whatDoIHave(): void {
        this._logger.debug('Embedded resources available:');

        for (const key of this._resources.keys()) {
            this._logger.debug(`- ${key}`);
        }
    }

    // #endregion
}
