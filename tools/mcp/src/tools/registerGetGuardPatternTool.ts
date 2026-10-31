import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PatternsLoader } from '../PatternsLoader.js';

/**
 * Registers the get-guard-pattern tool on the MCP server.
 */
export function registerGetGuardPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-guard-pattern',
        'Returns the Archipel guard & interceptor pattern - metadata decorators, FeatureGuard, RolesGuard, FeatureUsageInterceptor, and the full decorator-guard-interceptor trio.',
        {},
        async () => {
            const pattern = patternsLoader.patterns.get('guard-pattern');
            const text = pattern?.content ?? 'Guard pattern documentation not available.';

            return {
                content: [{ type: 'text' as const, text }],
            };
        },
    );
}
