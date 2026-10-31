import type { IRegisteredTool } from '../interfaces/IRegisteredTool.js';
import type { IRegisteredResource } from '../interfaces/IRegisteredResource.js';
import type { IRegisteredPrompt } from '../interfaces/IRegisteredPrompt.js';
import { Injectable, Logger } from '@nestjs/common';
import type { IMcpPromptMetadata } from '../interfaces/IMcpPromptMetadata.js';
import type { IMcpResourceMetadata } from '../interfaces/IMcpResourceMetadata.js';
import type { IMcpToolMetadata } from '../interfaces/IMcpToolMetadata.js';

/**
 * Central registry that stores all MCP tool, resource, and prompt handlers
 * discovered from NestJS providers.
 */
@Injectable()
export class McpRegistryService {
    // #region Fields

    private readonly _logger = new Logger(McpRegistryService.name);
    private readonly _tools = new Map<string, IRegisteredTool>();
    private readonly _resources = new Map<string, IRegisteredResource>();
    private readonly _prompts = new Map<string, IRegisteredPrompt>();

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties

    /**
     * Returns all registered tools.
     *
     * @returns A readonly view of the authoritative local tool registrations.
     */
    public get tools(): ReadonlyMap<string, IRegisteredTool> {
        return this._tools;
    }

    /**
     * Returns all registered resources.
     *
     * @returns A readonly view of the authoritative local resource registrations.
     */
    public get resources(): ReadonlyMap<string, IRegisteredResource> {
        return this._resources;
    }

    /**
     * Returns all registered prompts.
     *
     * @returns A readonly view of the authoritative local prompt registrations.
     */
    public get prompts(): ReadonlyMap<string, IRegisteredPrompt> {
        return this._prompts;
    }

    // #endregion

    // #region Methods

    /**
     * Registers a tool handler.
     *
     * @param metadata - Tool metadata from the decorator.
     * @param handler - Bound method that handles the tool invocation.
     */
    public registerTool(metadata: IMcpToolMetadata, handler: (...args: unknown[]) => unknown): void {
        if (this._tools.has(metadata.name)) {
            this._logger.warn(`Tool "${metadata.name}" is already registered - overwriting.`);
        }

        this._tools.set(metadata.name, { metadata, handler });
        this._logger.log(`Registered tool: ${metadata.name}`);
    }

    /**
     * Registers a resource handler.
     *
     * @param metadata - Resource metadata from the decorator.
     * @param handler - Bound method that handles the resource read.
     */
    public registerResource(metadata: IMcpResourceMetadata, handler: (...args: unknown[]) => unknown): void {
        if (this._resources.has(metadata.name)) {
            this._logger.warn(`Resource "${metadata.name}" is already registered - overwriting.`);
        }

        this._resources.set(metadata.name, { metadata, handler });
        this._logger.log(`Registered resource: ${metadata.name}`);
    }

    /**
     * Registers a prompt handler.
     *
     * @param metadata - Prompt metadata from the decorator.
     * @param handler - Bound method that handles the prompt generation.
     */
    public registerPrompt(metadata: IMcpPromptMetadata, handler: (...args: unknown[]) => unknown): void {
        if (this._prompts.has(metadata.name)) {
            this._logger.warn(`Prompt "${metadata.name}" is already registered - overwriting.`);
        }

        this._prompts.set(metadata.name, { metadata, handler });
        this._logger.log(`Registered prompt: ${metadata.name}`);
    }

    // #endregion
}
