import type { IStreamableHttpTransportOptions } from '../interfaces/IStreamableHttpTransportOptions.js';
import type { ISseTransportOptions } from '../interfaces/ISseTransportOptions.js';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { Inject, Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import type { Response } from 'express';
import { z } from 'zod';
import type { IMcpModuleOptions } from '../interfaces/IMcpModuleOptions.js';
import { MCP_MODULE_OPTIONS } from '../tokens/McpTokens.js';
import { McpDiscoveryService } from './McpDiscoveryService.js';
import { McpRegistryService } from './McpRegistryService.js';

/**
 * Manages the MCP server lifecycle.
 * Creates the `McpServer` instance, registers all discovered handlers from
 * the registry, and provides methods to connect various transports.
 */
@Injectable()
export class McpServerService implements OnModuleInit, OnModuleDestroy {
    // #region Fields

    private static readonly _MAX_TRANSPORTS = 1_000;
    private readonly _options: IMcpModuleOptions;
    private readonly _registry: McpRegistryService;
    private readonly _discovery: McpDiscoveryService;
    private readonly _logger = new Logger(McpServerService.name);
    private _server: McpServer | undefined;
    private readonly _activeTransports: Transport[] = [];

    // #endregion

    // #region Ctor

    /**
     * Composes the existing handler registry, discovery and server configuration.
     *
     * @param options - Server identity and advertised protocol capabilities.
     * @param registry - Authoritative catalog of locally registered handlers.
     * @param discovery - Idempotent discovery run before the server snapshots its handlers.
     */
    public constructor(@Inject(MCP_MODULE_OPTIONS) options: IMcpModuleOptions, registry: McpRegistryService, discovery: McpDiscoveryService) {
        this._options = options;
        this._registry = registry;
        this._discovery = discovery;
    }

    // #endregion

    // #region Properties

    /**
     * Returns the underlying `McpServer` instance.
     *
     * @returns The initialized SDK server that owns protocol dispatch.
     * @throws Error if the server has not been initialized yet.
     */
    public get server(): McpServer {
        if (!this._server) {
            throw new McpError(ErrorCode.InternalError, 'McpServer has not been initialized. Ensure McpModule is imported.');
        }

        return this._server;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the MCP server and registers all tools, resources, and prompts
     * from the registry.
     */
    public onModuleInit(): void {
        this._discovery.discoverHandlers();

        this._server = new McpServer(
            {
                name: this._options.name,
                version: this._options.version,
            },
            {
                capabilities: this._options.capabilities ?? {},
                instructions: this._options.instructions,
            },
        );

        this.registerTools();
        this.registerResources();
        this.registerPrompts();

        this._logger.log(`MCP server "${this._options.name}" v${this._options.version} initialized`);
    }

    /**
     * Cleans up all active transports when the module is destroyed.
     *
     * @returns Resolves after the existing bounded transport and server cleanup attempts.
     */
    public async onModuleDestroy(): Promise<void> {
        const timeout = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

        for (const transport of this._activeTransports) {
            try {
                await Promise.race([transport.close(), timeout(5_000)]);
            } catch (error: unknown) {
                this._logger.warn(`Error closing transport: ${String(error)}`);
            }
        }

        this._activeTransports.length = 0;

        try {
            await Promise.race([this.server.close(), timeout(5_000)]);
        } catch (error: unknown) {
            this._logger.warn(`Error closing MCP server: ${String(error)}`);
        }

        this._logger.log('MCP server shut down');
    }

    /**
     * Connects the server to a stdio transport.
     * Suitable for local, process-spawned integrations.
     *
     * @returns The connected standard input/output transport tracked for shutdown.
     */
    public async connectStdio(): Promise<StdioServerTransport> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        this.trackTransport(transport);
        this._logger.log('Connected to stdio transport');

        return transport;
    }

    /**
     * Creates a Streamable HTTP transport for use with Express.
     * The caller is responsible for wiring the transport's `handleRequest`
     * method to the appropriate Express routes.
     *
     * @param options - Transport configuration options.
     * @returns The configured transport instance.
     */
    public async createStreamableHttpTransport(options?: IStreamableHttpTransportOptions): Promise<StreamableHTTPServerTransport> {
        const transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: options?.sessionIdGenerator,
            enableJsonResponse: options?.enableJsonResponse ?? false,
        });

        await this.server.connect(transport);
        this.trackTransport(transport);
        this._logger.log('Created Streamable HTTP transport');

        return transport;
    }

    /**
     * Creates an SSE transport for legacy client support.
     * The caller is responsible for wiring the returned transport to Express routes.
     *
     * @param options - SSE transport configuration.
     * @param response - The Express response object for the SSE connection.
     * @returns The configured SSE transport instance.
     */
    public async createSseTransport(options: ISseTransportOptions, response: Response): Promise<SSEServerTransport> {
        const transport = new SSEServerTransport(options.endpoint, response);
        await this.server.connect(transport);
        this.trackTransport(transport);
        this._logger.log('Created SSE transport');

        return transport;
    }

    /**
     * Connects a custom transport to the MCP server.
     *
     * @param transport - Any transport implementing the MCP Transport interface.
     * @returns Resolves after connection and lifecycle tracking complete.
     */
    public async connectTransport(transport: Transport): Promise<void> {
        await this.server.connect(transport);
        this.trackTransport(transport);
        this._logger.log('Connected custom transport');
    }

    private trackTransport(transport: Transport): void {
        if (this._activeTransports.length >= McpServerService._MAX_TRANSPORTS) {
            this._logger.warn(`Maximum active transports (${McpServerService._MAX_TRANSPORTS}) reached. Transport not tracked.`);
            return;
        }
        this._activeTransports.push(transport);
    }

    private registerTools(): void {
        for (const [name, entry] of this._registry.tools) {
            const { metadata, handler } = entry;

            this.server.registerTool(
                name,
                {
                    title: metadata.title,
                    description: metadata.description,
                    inputSchema: metadata.inputSchema,
                    outputSchema: metadata.outputSchema,
                    annotations: metadata.annotations,
                },
                async (input: unknown, extra: unknown) => {
                    try {
                        if (metadata.requiredScopes && metadata.requiredScopes.length > 0) {
                            const callerScopes = this.getCallerScopes(extra);
                            const missingScopes = metadata.requiredScopes.filter((scope) => !callerScopes.includes(scope));
                            if (missingScopes.length > 0) {
                                this._logger.warn(`Tool "${name}" access denied - missing scopes: ${missingScopes.join(', ')}`);
                                throw new McpError(ErrorCode.InvalidRequest, `Tool "${name}" requires scopes: ${missingScopes.join(', ')}`);
                            }
                        }

                        if (metadata.inputSchema) {
                            try {
                                const schema = z.object(metadata.inputSchema);
                                schema.parse(input as Record<string, unknown>);
                            } catch (validationError: unknown) {
                                const message = validationError instanceof Error ? validationError.message : String(validationError);
                                this._logger.warn(`Tool "${name}" input validation failed: ${message}`);
                                throw new McpError(ErrorCode.InvalidParams, `Tool "${name}" input validation failed: ${message}`);
                            }
                        }

                        const toolTimeoutMs = 30_000;
                        const result = await Promise.race([
                            handler(input, extra),
                            new Promise<never>((_, reject) =>
                                setTimeout(
                                    () => reject(new McpError(ErrorCode.RequestTimeout, `Tool "${name}" execution timed out after ${toolTimeoutMs}ms`)),
                                    toolTimeoutMs,
                                ),
                            ),
                        ]);

                        return result as ReturnType<Parameters<McpServer['registerTool']>[2]>;
                    } catch (error: unknown) {
                        if (error instanceof McpError) {
                            throw error;
                        }
                        this._logger.error(`Tool "${name}" execution failed: ${(error as Error).message}`);
                        throw new McpError(ErrorCode.InternalError, `Tool "${name}" execution failed: ${(error as Error).message}`);
                    }
                },
            );
        }
    }

    private getCallerScopes(context: unknown): ReadonlyArray<string> {
        if (typeof context !== 'object' || context === null) {
            return [];
        }
        // SDK authentication is authoritative. Legacy scopes apply only when no authInfo is supplied.
        const authInfo: unknown = 'authInfo' in context ? context.authInfo : undefined;
        const source: unknown = authInfo === undefined ? context : authInfo;
        if (typeof source !== 'object' || source === null || !('scopes' in source)) {
            return [];
        }
        const scopes: unknown = source.scopes;
        return Array.isArray(scopes) && scopes.every((scope: unknown): scope is string => typeof scope === 'string') ? [...scopes] : [];
    }

    private registerResources(): void {
        for (const [name, entry] of this._registry.resources) {
            const { metadata, handler } = entry;
            const isTemplate = metadata.uri.includes('{');

            if (isTemplate) {
                this.server.registerResource(
                    name,
                    new ResourceTemplate(metadata.uri, { list: undefined }) as never,
                    {
                        title: metadata.title,
                        description: metadata.description,
                        mimeType: metadata.mimeType,
                    },
                    async (uri: unknown, params: unknown) => {
                        return handler(uri, params) as never;
                    },
                );
            } else {
                this.server.registerResource(
                    name,
                    metadata.uri,
                    {
                        title: metadata.title,
                        description: metadata.description,
                        mimeType: metadata.mimeType,
                    },
                    async (uri: unknown) => {
                        return handler(uri) as never;
                    },
                );
            }
        }
    }

    private registerPrompts(): void {
        for (const [name, entry] of this._registry.prompts) {
            const { metadata, handler } = entry;

            this.server.registerPrompt(
                name,
                {
                    title: metadata.title,
                    description: metadata.description,
                    argsSchema: metadata.argsSchema,
                },
                async (args: unknown, extra: unknown) => {
                    return handler(args, extra) as never;
                },
            );
        }
    }

    // #endregion
}
