import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { PatternsLoader } from '../PatternsLoader.js';
import { REPOSITORY_PATTERN_WITH_MODEL } from '../generators/repositoryPatternGenerator.js';

/**
 * Registers the get-repository-pattern tool on the MCP server.
 */
export function registerGetRepositoryPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-repository-pattern',
        'Returns the Archipel repository class pattern - how to create a RepositoryBase subclass with correct generics, module registration, and service injection. Optionally tailored to a specific Prisma model.',
        {
            modelName: z.string().optional().describe('Prisma model name (e.g. "User", "Order"). If provided, generates a complete repository scaffold.'),
            fields: z
                .array(z.string())
                .optional()
                .describe('Field names of the model (e.g. ["id", "email", "name", "createdAt"]). Used with modelName for tailored examples.'),
        },
        async (params) => {
            const pattern = patternsLoader.patterns.get('repository-pattern');
            let content = pattern?.content ?? 'Repository pattern documentation not available.';

            if (params.modelName && params.fields && params.fields.length > 0) {
                content += '\n\n' + REPOSITORY_PATTERN_WITH_MODEL(params.modelName, params.fields);
            }

            return {
                content: [{ type: 'text' as const, text: content }],
            };
        },
    );
}
