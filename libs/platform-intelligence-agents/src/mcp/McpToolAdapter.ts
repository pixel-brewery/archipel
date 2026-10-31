import { validateIntelligenceSchema } from '@pixel-brewery/archipel-platform-intelligence';
import type { IIntelligenceToolDefinition } from '@pixel-brewery/archipel-platform-intelligence';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import type { McpClientBase } from '@pixel-brewery/archipel-platform-mcp/client';

/**
 * Adapts the shared MCP client's protocol tools to the canonical intelligence tool contract.
 *
 * @public
 */
export class McpToolAdapter {
    // #region Fields
    private readonly _maxTools: number;
    private readonly _clients: ReadonlyArray<McpClientBase>;
    private _tools?: Promise<Readonly<Record<string, IIntelligenceToolDefinition>>>;
    private _closed = false;
    // #endregion

    // #region Ctor
    /**
     * Creates a bounded tool adapter and takes ownership of its shared MCP clients.
     *
     * @param clients - Clients to discover and close, including clients whose discovery fails.
     * @param maxTools - Maximum combined catalog size; defaults to 128 and cannot exceed 128.
     * @throws {AgentRuntimeError} When more than 16 clients are supplied or the tool budget is invalid.
     */
    public constructor(clients: ReadonlyArray<McpClientBase>, maxTools = 128) {
        this._maxTools = maxTools;
        if (clients.length > 16 || !Number.isSafeInteger(maxTools) || maxTools < 1 || maxTools > 128) {
            throw new AgentRuntimeError('INVALID_MCP_OPTIONS', 'MCP tool adapter capacities are invalid.');
        }
        this._clients = [...clients];
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Shares discovery and rejects collisions across servers, never silently overwriting tools.
     *
     * @returns The cached, collision-free catalog of remote tool definitions.
     * @throws {AgentRuntimeError} When the registry is closed, discovery fails or tool names/capacity are invalid.
     */
    public discoverTools(): Promise<Readonly<Record<string, IIntelligenceToolDefinition>>> {
        if (this._closed) {
            return Promise.reject(new AgentRuntimeError('MCP_CLOSED', 'MCP tool adapter is closed.'));
        }
        this._tools ??= this.discover();
        return this._tools;
    }
    /**
     * Closes every owned client, including clients whose discovery failed.
     *
     * @returns Resolves when all client cleanup attempts complete successfully.
     * @throws {AgentRuntimeError} When one or more clients fail to close.
     */
    public async close(): Promise<void> {
        this._closed = true;
        const results = await Promise.allSettled(this._clients.map((client) => client.close()));
        if (results.some((result) => result.status === 'rejected')) {
            throw new AgentRuntimeError('MCP_CLOSE_FAILED', 'One or more MCP clients could not close.');
        }
    }
    private async discover(): Promise<Readonly<Record<string, IIntelligenceToolDefinition>>> {
        try {
            const tools: Record<string, IIntelligenceToolDefinition> = Object.create(null);
            for (const client of this._clients) {
                for (const specification of await client.listTools()) {
                    if (Object.hasOwn(tools, specification.name) || Object.keys(tools).length >= this._maxTools) {
                        throw new AgentRuntimeError('MCP_TOOL_CAPACITY', 'MCP tool names collide or registry capacity was exceeded.');
                    }
                    const inputSchema = { kind: 'json-schema' as const, jsonSchema: { ...specification.inputSchema, type: 'object' } };
                    tools[specification.name] = Object.freeze({
                        description: specification.description,
                        inputSchema,
                        outputSchema: specification.outputSchema ? { kind: 'json-schema' as const, jsonSchema: specification.outputSchema } : undefined,
                        execute: async (
                            input: unknown,
                            context: {
                                readonly abortSignal?: AbortSignal;
                            },
                        ): Promise<unknown> => {
                            if (this._closed) {
                                throw new AgentRuntimeError('MCP_CLOSED', 'MCP tool adapter is closed.');
                            }
                            const validated = await validateIntelligenceSchema<Record<string, unknown>>(inputSchema, input, 'MCP tool arguments');
                            if (typeof validated !== 'object' || validated === null || Array.isArray(validated)) {
                                throw new AgentRuntimeError('MCP_TOOL_FAILED', 'MCP tool arguments must be an object.');
                            }
                            const result = await client.callTool(specification.name, validated, context.abortSignal);
                            if (result.structuredContent !== undefined) {
                                return result.structuredContent;
                            }
                            if (result.content.every((part) => part.type === 'text')) {
                                return result.content.map((part) => (part.type === 'text' ? part.text : '')).join('\n');
                            }
                            return result;
                        },
                    });
                }
            }
            return Object.freeze(tools);
        } catch (error: unknown) {
            if (error instanceof AgentRuntimeError) {
                throw error;
            }
            throw new AgentRuntimeError('MCP_DISCOVERY_FAILED', 'Remote tools could not be discovered.');
        }
    }
    // #endregion
}
