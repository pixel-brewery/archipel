import { Logger } from '@nestjs/common';
import type { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import type { McpClientBase } from './abstracts/McpClientBase.js';

/**
 * Register with HealthOrchestrator for each configured MCP client. No credentials appear in its result.
 *
 * @public
 */
export class McpClientHealthIndicator implements IHealthIndicator {
    // #region Fields
    /**
     * Key used to identify this client in the health result.
     */
    public readonly key: string;
    private readonly _client: McpClientBase;
    private readonly _logger: Logger = new Logger(McpClientHealthIndicator.name);
    // #endregion

    // #region Ctor
    /**
     * Creates a readiness indicator for an explicitly owned MCP client.
     *
     * @param client - Client whose independent protocol probe determines readiness.
     * @param key - Unique result key used when registering this indicator with HealthOrchestrator.
     */
    public constructor(client: McpClientBase, key = 'mcp-client') {
        this._client = client;
        this.key = key;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Reports protocol readiness without exposing endpoint, credentials or provider diagnostics.
     *
     * @returns A health result keyed by this indicator's configured registration key.
     */
    public async check(): Promise<
        Record<
            string,
            {
                /**
                 * Readiness of the configured MCP protocol connection.
                 */
                status: 'up' | 'down';
            }
        >
    > {
        const startedAt = Date.now();
        try {
            await this._client.ping();
            return { [this.key]: { status: 'up' } };
        } catch (_error: unknown) {
            this._logger.warn({
                module: 'platform-mcp',
                operation: 'health',
                requestId: this.key,
                duration: Date.now() - startedAt,
                code: 'MCP_UNHEALTHY',
            });
            return { [this.key]: { status: 'down' } };
        }
    }
    // #endregion
}
