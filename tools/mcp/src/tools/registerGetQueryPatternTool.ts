import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { PatternsLoader } from '../PatternsLoader.js';
import { QUERY_PATTERN_WITH_MODEL } from '../generators/queryPatternGenerator.js';

/**
 * Registers the get-query-pattern tool on the MCP server.
 */
export function registerGetQueryPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-query-pattern',
        'Returns the Archipel query pattern documentation - interfaces, factories, rules, and examples. Optionally tailored to a specific Prisma model.',
        {
            modelName: z.string().optional().describe('Prisma model name (e.g. "User", "Order"). If provided, generates model-specific examples.'),
            fields: z
                .array(z.string())
                .optional()
                .describe('Field names of the model (e.g. ["id", "email", "name", "createdAt"]). Used with modelName for tailored examples.'),
        },
        async (params) => {
            const pattern = patternsLoader.patterns.get('query-pattern');
            let content = pattern?.content ?? 'Query pattern documentation not available.';

            if (params.modelName && params.fields && params.fields.length > 0) {
                content += '\n\n' + QUERY_PATTERN_WITH_MODEL(params.modelName, params.fields);
            }

            return {
                content: [{ type: 'text' as const, text: content }],
            };
        },
    );
}
