import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { DocsLoader } from '../DocsLoader.js';

/**
 * Registers the list-packages tool on the MCP server.
 */
export function registerListPackagesTool(server: McpServer, docsLoader: DocsLoader): void {
    server.tool('list-packages', 'Lists all available Archipel platform packages with their descriptions and tags.', {}, async () => {
        const packages = Array.from(docsLoader.packages.values()).map((packageDoc) => ({
            name: packageDoc.name,
            package: packageDoc.packageScope,
            description: packageDoc.description,
            tags: packageDoc.tags,
        }));

        return {
            content: [{ type: 'text' as const, text: JSON.stringify(packages, null, 2) }],
        };
    });
}
