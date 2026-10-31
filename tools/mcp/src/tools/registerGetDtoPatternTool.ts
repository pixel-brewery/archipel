import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PatternsLoader } from '../PatternsLoader.js';

/**
 * Registers the get-dto-pattern tool on the MCP server.
 */
export function registerGetDtoPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-dto-pattern',
        'Returns the Archipel DTO & validation pattern - Request/Response DTOs, class-validator decorators, cross-field validation, query parameter DTOs, OpenAPI integration, and naming conventions.',
        {},
        async () => {
            const pattern = patternsLoader.patterns.get('dto-pattern');
            const text = pattern?.content ?? 'DTO pattern documentation not available.';

            return {
                content: [{ type: 'text' as const, text }],
            };
        },
    );
}
