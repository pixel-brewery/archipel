import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GuidesLoader } from '../GuidesLoader.js';

/**
 * Registers the search-guides tool on the MCP server.
 */
export function registerSearchGuidesTool(server: McpServer, guidesLoader: GuidesLoader): void {
    server.tool(
        'search-guides',
        'Searches across all Archipel platform guides by keyword or phrase.',
        {
            query: z.string().describe('The search query to match against guide names, titles, descriptions, and content.'),
        },
        async (params) => {
            const results = guidesLoader.search(params.query);

            if (results.length === 0) {
                return {
                    content: [{ type: 'text' as const, text: `No guides found matching: "${params.query}"` }],
                };
            }

            const summary = results.map((guide) => [`## ${guide.title}`, '', guide.description, '', guide.content].join('\n')).join('\n\n---\n\n');

            return {
                content: [{ type: 'text' as const, text: `Found ${results.length} guide(s) for "${params.query}":\n\n${summary}` }],
            };
        },
    );
}
