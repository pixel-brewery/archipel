// #region Imports

import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import type { IntelligenceToolSet } from './contracts/IntelligenceToolSet.js';
import { IntelligenceValidationError } from './errors/IntelligenceValidationError.js';
import type { IIntelligenceTool } from './interfaces/IIntelligenceTool.js';
import type { IIntelligenceToolRegistry } from './interfaces/IIntelligenceToolRegistry.js';
import { INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN } from './tokens/IntelligenceToolRegistryMaxToolsToken.js';

// #endregion

/**
 * Registry for class-based intelligence tools.
 *
 * The registry keeps application tools provider-neutral and supplies them to
 * Archipel language generation.
 *
 * @public
 */
@Injectable()
export class IntelligenceToolRegistry implements IIntelligenceToolRegistry {
    // #region Fields

    private static readonly _DEFAULT_MAX_TOOLS = 128;
    private readonly _logger: Logger = new Logger(IntelligenceToolRegistry.name);
    private readonly _maxTools: number;
    private readonly _tools = new Map<string, IIntelligenceTool>();

    public constructor(
        @Optional()
        @Inject(INTELLIGENCE_TOOL_REGISTRY_MAX_TOOLS_TOKEN)
        maxTools = IntelligenceToolRegistry._DEFAULT_MAX_TOOLS,
    ) {
        if (!Number.isSafeInteger(maxTools) || maxTools < 1) {
            throw new IntelligenceValidationError('Intelligence tool registry capacity must be a positive safe integer.');
        }

        this._maxTools = maxTools;
    }

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    /**
     * Gets the number of registered tools.
     *
     * @public
     * @readonly
     */
    public get count(): number {
        return this._tools.size;
    }

    // #endregion

    // #region Methods

    /**
     * Registers a tool with the registry.
     *
     * Tools with duplicate names replace the existing registration.
     *
     * @param tool - The tool instance to register.
     *
     * @public
     */
    public register(tool: IIntelligenceTool): void {
        this.validateToolName(tool.name);

        const alreadyRegistered = this._tools.has(tool.name);
        if (!alreadyRegistered && this._tools.size >= this._maxTools) {
            this._logger.warn({
                message: 'Intelligence tool registry capacity reached.',
                requestId: 'bootstrap',
                module: 'platform-intelligence',
                operation: 'tool.register',
                tool: tool.name,
                maxTools: this._maxTools,
            });
            return;
        }

        if (alreadyRegistered) {
            this._logger.warn({
                message: 'Intelligence tool registration overwritten.',
                requestId: 'bootstrap',
                module: 'platform-intelligence',
                operation: 'tool.register',
                tool: tool.name,
            });
        }

        this._tools.set(tool.name, tool);
        this._logger.debug({
            message: 'Intelligence tool registered.',
            requestId: 'bootstrap',
            module: 'platform-intelligence',
            operation: 'tool.register',
            tool: tool.name,
        });
    }

    /**
     * Gets a tool by name.
     *
     * @param name - The name of the tool to retrieve.
     * @returns The tool instance, or `undefined` if not found.
     *
     * @public
     */
    public get(name: string): IIntelligenceTool | undefined {
        return this._tools.get(name);
    }

    /**
     * Checks whether a tool with the given name is registered.
     *
     * @param name - The tool name to check.
     * @returns `true` if the tool exists; otherwise `false`.
     *
     * @public
     */
    public has(name: string): boolean {
        return this._tools.has(name);
    }

    /**
     * Returns all registered tools as a readonly array.
     *
     * @public
     * @returns Array of all registered tool instances.
     */
    public list(): ReadonlyArray<IIntelligenceTool> {
        return Array.from(this._tools.values());
    }

    /**
     * Returns all registered tool names.
     *
     * @public
     * @returns Array of tool names.
     */
    public listNames(): ReadonlyArray<string> {
        return Array.from(this._tools.keys());
    }

    /**
     * Converts all registered application tools to an Archipel tool set.
     *
     * @public
     * @returns A record mapping tool names to provider-neutral definitions.
     *
     * @example
     * ```typescript
     * const result = await languageGenerator.generateText({
     *     model: { provider: 'openai', model: 'gpt-4o' },
     *     tools: registry.toToolSet(),
     *     prompt: 'Find user John Doe',
     * });
     * ```
     */
    public toToolSet(): IntelligenceToolSet {
        const result: Record<string, IntelligenceToolSet[string]> = {};

        for (const [name, toolInstance] of this._tools) {
            if (!('nativeDefinition' in toolInstance.tool)) {
                result[name] = toolInstance.tool;
            }
        }

        return result;
    }

    /**
     * Returns all provider-neutral and provider-owned definitions for internal execution.
     *
     * @internal
     */
    public toExecutionToolSet(): Readonly<Record<string, IIntelligenceTool['tool']>> {
        const result: Record<string, IIntelligenceTool['tool']> = {};

        for (const [name, toolInstance] of this._tools) {
            result[name] = toolInstance.tool;
        }

        return result;
    }

    private validateToolName(name: string): void {
        const trimmedName = name.trim();
        if (trimmedName.length === 0) {
            throw new IntelligenceValidationError('Intelligence tool name must not be empty.');
        }

        if (trimmedName !== name) {
            throw new IntelligenceValidationError(`Intelligence tool name must not contain leading or trailing spaces: "${name}"`);
        }
    }

    // #endregion
}
