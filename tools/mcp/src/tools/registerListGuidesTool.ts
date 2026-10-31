import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { GuidesLoader } from '../GuidesLoader.js';

/**
 * Registers the list-guides tool on the MCP server.
 */
export function registerListGuidesTool(server: McpServer, guidesLoader: GuidesLoader): void {
    server.tool('list-guides', 'Lists all available Archipel platform guides with their titles, descriptions, and sort order.', {}, async () => {
        const guides = Array.from(guidesLoader.guides.values())
            .sort((a, b) => a.order - b.order)
            .map((guide) => ({
                name: guide.name,
                title: guide.title,
                description: guide.description,
                order: guide.order,
            }));

        return {
            content: [{ type: 'text' as const, text: JSON.stringify(guides, null, 2) }],
        };
    });
}
