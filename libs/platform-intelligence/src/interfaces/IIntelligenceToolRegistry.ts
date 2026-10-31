// #region Imports

import type { IntelligenceToolSet } from '../contracts/IntelligenceToolSet.js';
import type { IIntelligenceTool } from './IIntelligenceTool.js';

// #endregion

/**
 * Contract for the intelligence tool registry.
 *
 * @public
 */
export interface IIntelligenceToolRegistry {
    // #region Properties

    /**
     * Gets the number of registered tools.
     *
     * @public
     * @readonly
     */
    readonly count: number;

    // #endregion

    // #region Methods

    /**
     * Registers a tool with the registry.
     *
     * @param tool - The tool instance to register.
     *
     * @public
     */
    register(tool: IIntelligenceTool): void;

    /**
     * Gets a tool by name.
     *
     * @param name - The name of the tool to retrieve.
     * @returns The tool instance, or `undefined` if not found.
     *
     * @public
     */
    get(name: string): IIntelligenceTool | undefined;

    /**
     * Checks whether a tool with the given name is registered.
     *
     * @param name - The tool name to check.
     * @returns `true` if the tool exists; otherwise `false`.
     *
     * @public
     */
    has(name: string): boolean;

    /**
     * Returns all registered tools as a readonly array.
     *
     * @public
     * @returns Array of all registered tool instances.
     */
    list(): ReadonlyArray<IIntelligenceTool>;

    /**
     * Returns all registered tool names.
     *
     * @public
     * @returns Array of tool names.
     */
    listNames(): ReadonlyArray<string>;

    /**
     * Converts all registered application tools to an Archipel tool set.
     *
     * @public
     * @returns A record mapping tool names to provider-neutral definitions.
     */
    toToolSet(): IntelligenceToolSet;

    // #endregion
}
