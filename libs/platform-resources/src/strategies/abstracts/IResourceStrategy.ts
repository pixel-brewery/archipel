import { IResourceResult } from '../../types/IResourceResult.js';

/**
 * Strategy for loading resources from a specific source.
 *
 * @public
 */
export interface IResourceStrategy {
    /**
     * The unique name of this strategy.
     */
    readonly name: string;

    /**
     * Loads a resource by its key.
     *
     * @param key The resource key/identifier
     * @returns The resource result or undefined if not found
     */
    load(key: string): IResourceResult | undefined;

    /**
     * Loads a resource by its key (asynchronous).
     *
     * @param key The resource key/identifier
     * @returns Promise resolving to the resource result or undefined if not found
     */
    loadAsync(key: string): Promise<IResourceResult | undefined>;

    /**
     * Checks if a resource exists without loading it.
     *
     * @param key The resource key/identifier
     * @returns True if the resource exists
     */
    exists(key: string): boolean;

    /**
     * Checks if a resource exists without loading it (asynchronous).
     *
     * @param key The resource key/identifier
     * @returns Promise resolving to true if the resource exists
     */
    existsAsync(key: string): Promise<boolean>;

    /**
     * List all files and folders in the base paths for debugging purposes.
     */
    whatDoIHave(): void;
}
