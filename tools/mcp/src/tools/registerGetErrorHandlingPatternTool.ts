import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PatternsLoader } from '../PatternsLoader.js';

/**
 * Registers the get-error-handling-pattern tool on the MCP server.
 */
export function registerGetErrorHandlingPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-error-handling-pattern',
        'Returns the Archipel error handling pattern - domain errors, RepositoryError, exception filters, and structured error response envelopes.',
        {},
        async () => {
            const pattern = patternsLoader.patterns.get('error-handling-pattern');
            const text = pattern?.content ?? 'Error handling pattern documentation not available.';

            return {
                content: [{ type: 'text' as const, text }],
            };
        },
    );
}
