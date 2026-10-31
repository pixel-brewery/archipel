import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PatternsLoader } from '../PatternsLoader.js';

/**
 * Registers the get-config-pattern tool on the MCP server.
 */
export function registerGetConfigPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-config-pattern',
        'Returns the Archipel configuration pattern - typed config keys (createConfigKey), ConfigRegistry, ConfigService, env.ts conventions, and ConfigModule integration.',
        {},
        async () => {
            const pattern = patternsLoader.patterns.get('config-pattern');
            const text = pattern?.content ?? 'Config pattern documentation not available.';

            return {
                content: [{ type: 'text' as const, text }],
            };
        },
    );
}
