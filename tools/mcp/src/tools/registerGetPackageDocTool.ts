import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { DocsLoader } from '../DocsLoader.js';

/**
 * Registers the get-package-doc tool on the MCP server.
 */
export function registerGetPackageDocTool(server: McpServer, docsLoader: DocsLoader): void {
    server.tool(
        'get-package-doc',
        'Gets the full documentation (overview + API reference) for a specific Archipel platform package.',
        {
            packageName: z.string().describe('The package directory name (e.g. "platform-core", "platform-database").'),
        },
        async (params) => {
            const packageDoc = docsLoader.packages.get(params.packageName);

            if (!packageDoc) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: `Package "${params.packageName}" not found. Use the list-packages tool to see available packages.`,
                        },
                    ],
                    isError: true,
                };
            }

            const sections: string[] = [`# ${packageDoc.title}`, '', `> ${packageDoc.description}`, '', `**Package:** \`${packageDoc.packageScope}\``];

            if (packageDoc.tags.length > 0) {
                sections.push(`**Tags:** ${packageDoc.tags.join(', ')}`);
            }

            sections.push('', packageDoc.content);

            if (packageDoc.apiContent) {
                sections.push('', '---', '', '## API Reference', '', packageDoc.apiContent);
            }

            return {
                content: [{ type: 'text' as const, text: sections.join('\n') }],
            };
        },
    );
}
