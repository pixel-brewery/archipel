import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { McpClientError } from './errors/McpClientError.js';
import type { IMcpClientOptions } from './interfaces/IMcpClientOptions.js';
import { CallToolResultSchema, type CallToolResult, type Tool } from '@modelcontextprotocol/sdk/types.js';
import { McpClientBase } from './abstracts/McpClientBase.js';

/**
 * Adapts Streamable HTTP MCP connections to bounded remote tool operations.
 *
 * @public
 */
@Injectable({ scope: Scope.TRANSIENT })
export class McpClient extends McpClientBase {
    // #region Fields
    private readonly _client: Client;
    private readonly _transport: StreamableHTTPClientTransport;
    private readonly _timeoutMs: number;
    private readonly _maxTools: number;
    private readonly _logger: Logger = new Logger(McpClient.name);
    private _connection?: Promise<void>;
    private _closed = false;
    private _closePromise?: Promise<void>;
    // #endregion

    // #region Ctor
    /**
     * Creates a caller-owned Streamable HTTP client from validated transport settings.
     *
     * @param options - Endpoint, credentials and limits resolved by the consumer through ConfigService.
     * @throws {McpClientError} When endpoint, headers, timeout or tool capacity are invalid.
     */
    public constructor(options: IMcpClientOptions) {
        super();
        let url: URL;
        try {
            url = new URL(options.url);
        } catch (_error: unknown) {
            throw new McpClientError('INVALID_MCP_OPTIONS', 'MCP server URL is invalid.');
        }
        this._timeoutMs = options.timeoutMs ?? 5000;
        this._maxTools = options.maxTools ?? 128;
        if (
            !['https:', 'http:'].includes(url.protocol) ||
            url.username ||
            url.password ||
            !Number.isSafeInteger(this._timeoutMs) ||
            this._timeoutMs < 1 ||
            this._timeoutMs > 60000 ||
            !Number.isSafeInteger(this._maxTools) ||
            this._maxTools < 1 ||
            this._maxTools > 1024
        ) {
            throw new McpClientError('INVALID_MCP_OPTIONS', 'MCP transport settings are invalid.');
        }
        try {
            const headers = new Headers(options.headers);
            if (options.authToken) {
                headers.set('Authorization', `Bearer ${options.authToken}`);
            }
            this._transport = new StreamableHTTPClientTransport(url, { requestInit: { headers } });
            this._client = new Client({ name: options.name ?? 'archipel-mcp-client', version: '1.0.0' }, { capabilities: {} });
        } catch (_error: unknown) {
            throw new McpClientError('INVALID_MCP_OPTIONS', 'MCP transport settings are invalid.');
        }
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Shares one bounded protocol initialization attempt across concurrent callers.
     *
     * @remarks
     * A failed connection remains failed. Close and replace the client before an explicit retry so a partially
     * initialized transport is never reused.
     * @returns Resolves when the shared initialization attempt completes.
     * @throws {McpClientError} When the client is closed or initialization fails.
     */
    public override connect(): Promise<void> {
        if (this._closed) {
            return Promise.reject(new McpClientError('MCP_CLOSED', 'MCP client is closed.'));
        }
        this._connection ??= this.bounded(
            'connect',
            async () => {
                await this._client.connect(this._transport);
            },
            this._timeoutMs,
            'MCP_CONNECT_FAILED',
        );
        return this._connection;
    }
    /**
     * Discovers all pages; rejects duplicate tool names and excessive or cyclic pagination.
     *
     * @returns All validated tool declarations within the configured capacity.
     * @throws {McpClientError} When discovery, pagination, duplicate names or tool capacity prevent a complete
     * catalog.
     */
    public override async listTools(): Promise<ReadonlyArray<Tool>> {
        await this.connect();
        return this.bounded(
            'listTools',
            async (signal) => {
                const tools: Tool[] = [];
                const names = new Set<string>();
                const cursors = new Set<string>();
                let cursor: string | undefined;
                do {
                    const page = await this._client.listTools(cursor ? { cursor } : undefined, { signal, timeout: this._timeoutMs });
                    for (const tool of page.tools) {
                        if (names.has(tool.name) || tools.length >= this._maxTools) {
                            throw new McpClientError('MCP_TOOL_CAPACITY', 'Remote tool names or capacity are invalid.');
                        }
                        names.add(tool.name);
                        tools.push(tool);
                    }
                    cursor = page.nextCursor;
                    if (cursor && (cursors.has(cursor) || cursors.size >= this._maxTools)) {
                        throw new McpClientError('MCP_PAGINATION', 'Remote tool pagination is invalid.');
                    }
                    if (cursor) {
                        cursors.add(cursor);
                    }
                } while (cursor);
                return tools;
            },
            this._timeoutMs,
            'MCP_DISCOVERY_FAILED',
        );
    }
    /**
     * Invokes a remote tool once and preserves the standard MCP result.
     *
     * @remarks
     * Remote mutations may be non-idempotent. No automatic retry is performed; consumers own deduplication at the
     * server's authoritative write boundary.
     * @param name - Exact remote tool identifier returned by discovery.
     * @param input - Arguments validated against the tool's input schema.
     * @param signal - Optional caller cancellation signal.
     * @returns Validated MCP content blocks, structured content and protocol metadata.
     * @throws {McpClientError} When invocation fails, is cancelled or returns an unusable result.
     */
    public override async callTool(name: string, input: Record<string, unknown>, signal?: AbortSignal): Promise<CallToolResult> {
        await this.connect();
        return this.bounded(
            'callTool',
            async (timeoutSignal) => {
                const result = await this._client.callTool({ name, arguments: input }, undefined, { signal: timeoutSignal, timeout: this._timeoutMs });
                if (result.isError) {
                    throw new McpClientError('MCP_TOOL_FAILED', 'Remote tool reported failure.');
                }
                return CallToolResultSchema.parse(result);
            },
            this._timeoutMs,
            'MCP_TOOL_FAILED',
            signal,
        );
    }
    /**
     * Probes readiness within three seconds, including lazy connection initialization.
     *
     * @returns Resolves when the remote protocol is ready.
     * @throws {McpClientError} When readiness cannot be confirmed within the health budget.
     */
    public override async ping(): Promise<void> {
        // Include lazy connection time in the independent health budget.
        await this.bounded(
            'ping',
            async (signal) => {
                await this.connect();
                await this._client.ping({ signal, timeout: 3000 });
            },
            3000,
            'MCP_UNHEALTHY',
        );
    }
    /**
     * Disposes the transport once, including failed or partial initialization.
     *
     * @returns The shared cleanup promise, resolving after transport disposal.
     * @throws {McpClientError} When cleanup exceeds its five-second budget or the transport fails.
     */
    public override close(): Promise<void> {
        this._closed = true;
        this._closePromise ??= this.bounded(
            'close',
            async () => {
                await this._client.close();
            },
            5000,
            'MCP_CLOSE_FAILED',
        );
        return this._closePromise;
    }
    private async bounded<T>(
        operationName: string,
        operation: (signal: AbortSignal) => Promise<T>,
        timeoutMs: number,
        code: string,
        callerSignal?: AbortSignal,
    ): Promise<T> {
        const startedAt = Date.now();
        const requestId = randomUUID();
        const controller = new AbortController();
        const signal = callerSignal ? AbortSignal.any([controller.signal, callerSignal]) : controller.signal;
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        let abort: (() => void) | undefined;
        try {
            if (signal.aborted) {
                throw new McpClientError(code, 'MCP operation was cancelled.');
            }
            const cancelled = new Promise<never>((_resolve, reject) => {
                abort = () => reject(new McpClientError('MCP_OPERATION_ABORTED', 'MCP operation was cancelled or timed out.'));
                signal.addEventListener('abort', abort, { once: true });
            });
            return await Promise.race([cancelled, Promise.resolve().then(() => operation(signal))]);
        } catch (error: unknown) {
            const failure = error instanceof McpClientError ? error : new McpClientError(code, 'MCP operation failed.');
            this._logger.warn({
                module: 'platform-mcp',
                operation: operationName,
                requestId,
                duration: Date.now() - startedAt,
                status: 'failed',
                code: failure.code,
            });
            throw failure;
        } finally {
            clearTimeout(timer);
            if (abort) {
                signal.removeEventListener('abort', abort);
            }
        }
    }
    // #endregion
}
