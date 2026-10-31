import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { GuidesLoader } from '../GuidesLoader.js';

/**
 * Registers the get-guide tool on the MCP server.
 */
export function registerGetGuideTool(server: McpServer, guidesLoader: GuidesLoader): void {
    server.tool(
        'get-guide',
        'Gets the full content of a specific Archipel platform guide.',
        {
            guideName: z.string().describe('The guide file name without extension (e.g. "getting-started", "caching", "authentication-and-authorization").'),
        },
        async (params) => {
            const guide = guidesLoader.guides.get(params.guideName);

            if (!guide) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Guide "${params.guideName}" not found. Use the list-guides tool to see available guides.`,
                        },
                    ],
                    isError: true,
                };
            }

            const sections: string[] = [`# ${guide.title}`, '', `> ${guide.description}`, '', guide.content];

            return {
                content: [{ type: 'text' as const, text: sections.join('\n') }],
            };
        },
    );
}
