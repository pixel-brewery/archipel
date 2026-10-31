import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PatternsLoader } from '../PatternsLoader.js';

/**
 * Registers the get-testing-pattern tool on the MCP server.
 */
export function registerGetTestingPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-testing-pattern',
        'Returns the Archipel testing pattern - Vitest conventions, mocking patterns for repositories/services/delegates, AAA structure, and test naming conventions.',
        {},
        async () => {
            const pattern = patternsLoader.patterns.get('testing-pattern');
            const text = pattern?.content ?? 'Testing pattern documentation not available.';

            return {
                content: [{ type: 'text' as const, text }],
            };
        },
    );
}
