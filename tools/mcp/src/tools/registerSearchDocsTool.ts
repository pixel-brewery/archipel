import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { DocsLoader } from '../DocsLoader.js';

/**
 * Registers the search-docs tool on the MCP server.
 */
export function registerSearchDocsTool(server: McpServer, docsLoader: DocsLoader): void {
    server.tool(
        'search-docs',
        'Searches across all Archipel platform documentation by keyword or phrase.',
        {
            query: z.string().describe('The search query to match against package names, descriptions, tags, and content.'),
        },
        async (params) => {
            const results = docsLoader.search(params.query);

            if (results.length === 0) {
                return {
                    content: [{ type: 'text' as const, text: `No documentation found matching: "${params.query}"` }],
                };
            }

            const summary = results
                .map((packageDoc) =>
                    [`## ${packageDoc.title}`, `**Package:** \`${packageDoc.packageScope}\``, '', packageDoc.description, '', packageDoc.content].join('\n'),
                )
                .join('\n\n---\n\n');

            return {
                content: [{ type: 'text' as const, text: `Found ${results.length} result(s) for "${params.query}":\n\n${summary}` }],
            };
        },
    );
}
