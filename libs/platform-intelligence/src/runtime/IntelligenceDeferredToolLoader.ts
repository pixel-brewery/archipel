// #region Imports

import type { ToolSet } from 'ai';
import { createIntelligenceJsonSchema } from '../contracts/createIntelligenceJsonSchema.js';
import type { IIntelligenceDeferredToolLoadingOptions } from '../contracts/IIntelligenceDeferredToolLoadingOptions.js';
import type { IIntelligenceDeferredToolLoadResult } from '../contracts/IIntelligenceDeferredToolLoadResult.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';
import { toAiSdkSchema } from './toAiSdkSchema.js';

// #endregion

// #region Types

interface IDeferredToolLoadInput {
    readonly names: ReadonlyArray<string>;
}

interface IDeferredToolStepSettings {
    readonly activeTools: Array<string>;
}

interface IDeferredNativeToolSettings {
    readonly tools: ToolSet;
    readonly prepareStep: () => IDeferredToolStepSettings;
}

// #endregion

/**
 * Validated deferred tool catalog of one language call.
 *
 * The catalog is immutable. Every native AI SDK invocation receives its own
 * activation state from {@link IntelligenceDeferredToolLoader.createNativeToolSettings},
 * so tools loaded by one invocation never become active in another.
 *
 * @internal
 */
export class IntelligenceDeferredToolLoader {
    // #region Fields

    private static readonly _DEFAULT_LOADER_TOOL_NAME = 'load_tools';
    private static readonly _DEFAULT_MAX_TOOLS_PER_LOAD = 10;
    private static readonly _MAX_TOOLS_PER_LOAD = 50;
    private static readonly _MAX_SUMMARY_LENGTH = 160;
    private readonly _summaries: ReadonlyMap<string, string | undefined>;
    private readonly _initialToolNames: ReadonlyArray<string>;
    private readonly _loaderToolName: string;
    private readonly _maxToolsPerLoad: number;
    private readonly _inputSchema: IIntelligenceSchema<IDeferredToolLoadInput>;

    // #endregion

    // #region Ctor

    private constructor(
        summaries: ReadonlyMap<string, string | undefined>,
        initialToolNames: ReadonlyArray<string>,
        loaderToolName: string,
        maxToolsPerLoad: number,
    ) {
        this._summaries = summaries;
        this._initialToolNames = initialToolNames;
        this._loaderToolName = loaderToolName;
        this._maxToolsPerLoad = maxToolsPerLoad;
        this._inputSchema = this.createInputSchema();
    }

    // #endregion

    // #region Properties

    /** Name of the built-in loader tool. */
    public get loaderToolName(): string {
        return this._loaderToolName;
    }

    // #endregion

    // #region Methods

    /**
     * Validates deferred loading options against the composed tool set of one call.
     *
     * @throws {IntelligenceValidationError} When the loader name is invalid or collides with a composed tool,
     * `maxToolsPerLoad` is out of range, or `initialToolNames` contains duplicate or unavailable names.
     */
    public static create(
        options: IIntelligenceDeferredToolLoadingOptions,
        tools: Readonly<Record<string, IIntelligenceTool['tool']>>,
    ): IntelligenceDeferredToolLoader {
        const loaderToolName = options.loaderToolName ?? IntelligenceDeferredToolLoader._DEFAULT_LOADER_TOOL_NAME;
        const maxToolsPerLoad = options.maxToolsPerLoad ?? IntelligenceDeferredToolLoader._DEFAULT_MAX_TOOLS_PER_LOAD;
        const initialToolNames = Array.from(options.initialToolNames ?? []);

        if (loaderToolName.length === 0 || loaderToolName.trim() !== loaderToolName) {
            throw new IntelligenceValidationError('deferredToolLoading.loaderToolName must be a non-empty tool name without leading or trailing spaces.');
        }
        if (Object.hasOwn(tools, loaderToolName)) {
            throw new IntelligenceValidationError(`Deferred tool loader "${loaderToolName}" collides with an intelligence tool available for this call.`);
        }
        if (!Number.isSafeInteger(maxToolsPerLoad) || maxToolsPerLoad < 1 || maxToolsPerLoad > IntelligenceDeferredToolLoader._MAX_TOOLS_PER_LOAD) {
            throw new IntelligenceValidationError(
                `deferredToolLoading.maxToolsPerLoad must be a safe integer between 1 and ${IntelligenceDeferredToolLoader._MAX_TOOLS_PER_LOAD}.`,
            );
        }
        if (new Set(initialToolNames).size !== initialToolNames.length) {
            throw new IntelligenceValidationError('deferredToolLoading.initialToolNames must not contain duplicate tool names.');
        }

        const unavailableToolName = initialToolNames.find((toolName) => !Object.hasOwn(tools, toolName));
        if (unavailableToolName !== undefined) {
            throw new IntelligenceValidationError(`Initial intelligence tool "${unavailableToolName}" is not available for this call.`);
        }

        const summaries = new Map(
            Object.entries(tools).map(([toolName, definition]): [string, string | undefined] => [
                toolName,
                'nativeDefinition' in definition ? undefined : IntelligenceDeferredToolLoader.summarize(definition.description),
            ]),
        );

        return new IntelligenceDeferredToolLoader(summaries, initialToolNames, loaderToolName, maxToolsPerLoad);
    }

    /** Returns whether a tool is exposed in the first step without loading. */
    public isInitiallyActive(toolName: string): boolean {
        return toolName === this._loaderToolName || this._initialToolNames.includes(toolName);
    }

    /**
     * Selects the provider-neutral contracts exposed in the first step, including the loader.
     *
     * The result describes the initial provider input for local measurement only; its loader
     * contract has no executor.
     */
    public selectInitialToolDefinitions(tools: Readonly<Record<string, IIntelligenceTool['tool']>>): Readonly<Record<string, IIntelligenceTool['tool']>> {
        const activeToolNames = this.createActivationState();

        return {
            ...Object.fromEntries(Object.entries(tools).filter(([toolName]) => activeToolNames.has(toolName))),
            [this._loaderToolName]: {
                description: this.describe(activeToolNames),
                inputSchema: this._inputSchema,
            },
        };
    }

    /**
     * Adds the loader to the complete native tool set and creates the matching per-step selection.
     *
     * Each invocation owns fresh activation state: the first step exposes the loader and the initial
     * tools, and every tool loaded later stays active for the remaining steps of that invocation.
     */
    public async createNativeToolSettings(tools: ToolSet): Promise<IDeferredNativeToolSettings> {
        const { tool } = await import('ai');
        const activeToolNames = this.createActivationState();
        const loaderTool = tool({
            description: () => this.describe(activeToolNames),
            inputSchema: await toAiSdkSchema(this._inputSchema),
            execute: (input: IDeferredToolLoadInput): IIntelligenceDeferredToolLoadResult => this.load(activeToolNames, input.names),
        } as never) as ToolSet[string];

        return {
            tools: { ...tools, [this._loaderToolName]: loaderTool },
            prepareStep: () => ({ activeTools: Array.from(activeToolNames) }),
        };
    }

    private static summarize(description: string | undefined): string | undefined {
        const normalizedDescription = description?.replace(/\s+/g, ' ').trim() ?? '';
        if (normalizedDescription.length === 0) {
            return undefined;
        }

        const firstSentence = /^.*?[.!?](?= |$)/.exec(normalizedDescription)?.[0] ?? normalizedDescription;

        return firstSentence.length <= IntelligenceDeferredToolLoader._MAX_SUMMARY_LENGTH
            ? firstSentence
            : `${firstSentence.slice(0, IntelligenceDeferredToolLoader._MAX_SUMMARY_LENGTH - 1).trimEnd()}…`;
    }

    private createActivationState(): Set<string> {
        return new Set([this._loaderToolName, ...this._initialToolNames]);
    }

    private createInputSchema(): IIntelligenceSchema<IDeferredToolLoadInput> {
        return createIntelligenceJsonSchema<IDeferredToolLoadInput>(
            {
                type: 'object',
                properties: {
                    names: {
                        type: 'array',
                        description: 'Exact names of the deferred tools to load.',
                        items: { type: 'string' },
                        minItems: 1,
                        maxItems: this._maxToolsPerLoad,
                    },
                },
                required: ['names'],
                additionalProperties: false,
            },
            (value: unknown) => this.validateInput(value),
        );
    }

    private validateInput(
        value: unknown,
    ): { readonly success: true; readonly value: IDeferredToolLoadInput } | { readonly success: false; readonly error: Error } {
        const names: unknown = this.isRecord(value) ? value['names'] : undefined;
        if (!Array.isArray(names)) {
            return {
                success: false,
                error: new IntelligenceValidationError(`${this._loaderToolName} expects an object with a "names" array of tool names.`),
            };
        }

        const requestedToolNames: ReadonlyArray<unknown> = names;
        if (!requestedToolNames.every((toolName): toolName is string => typeof toolName === 'string')) {
            return {
                success: false,
                error: new IntelligenceValidationError(`${this._loaderToolName} expects every requested tool name to be a string.`),
            };
        }
        if (requestedToolNames.length < 1 || requestedToolNames.length > this._maxToolsPerLoad) {
            return {
                success: false,
                error: new IntelligenceValidationError(`${this._loaderToolName} loads between 1 and ${this._maxToolsPerLoad} tools per call.`),
            };
        }

        return { success: true, value: { names: requestedToolNames } };
    }

    private load(activeToolNames: Set<string>, requestedToolNames: ReadonlyArray<string>): IIntelligenceDeferredToolLoadResult {
        const loaded: Array<string> = [];
        const alreadyActive: Array<string> = [];
        const unknown: Array<string> = [];

        for (const toolName of new Set(requestedToolNames)) {
            if (activeToolNames.has(toolName)) {
                alreadyActive.push(toolName);
            } else if (this._summaries.has(toolName)) {
                activeToolNames.add(toolName);
                loaded.push(toolName);
            } else {
                unknown.push(toolName);
            }
        }

        return { loaded, alreadyActive, unknown };
    }

    private describe(activeToolNames: ReadonlySet<string>): string {
        const deferredTools = Array.from(this._summaries)
            .filter(([toolName]) => !activeToolNames.has(toolName))
            .map(([toolName, summary]) => (summary === undefined ? `- ${toolName}` : `- ${toolName}: ${summary}`));
        const instructions =
            'Loads the full definitions of deferred tools. A deferred tool cannot be called before it is loaded. ' +
            `Call this tool with the exact names of the deferred tools you need, at most ${this._maxToolsPerLoad} per call. ` +
            'Loaded tools become callable after this tool returns and remain available until the response is complete.';

        return deferredTools.length === 0
            ? `${instructions}\n\nNo deferred tools remain; every available tool is already loaded.`
            : `${instructions}\n\nDeferred tools:\n${deferredTools.join('\n')}`;
    }

    private isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    // #endregion
}
