import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { PatternsLoader } from '../PatternsLoader.js';
import { MAPPING_PATTERN_WITH_CONTEXT } from '../generators/mappingPatternGenerator.js';

/**
 * Registers the get-mapping-pattern tool on the MCP server.
 */
export function registerGetMappingPatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-mapping-pattern',
        'Returns the Archipel mapping pattern - branded type-safe mapping keys, MappingProfileBase, MappingService, and MappingModule registration. Optionally tailored to a specific entity and response class.',
        {
            entityName: z.string().optional().describe('Entity name (e.g. "Product", "User"). If provided, generates tailored mapping scaffold.'),
            fields: z.array(z.string()).optional().describe('Field names of the entity (e.g. ["id", "name", "barcode", "createdAt"]).'),
            responseName: z.string().optional().describe('Response class name (e.g. "ProductResponse"). Defaults to "{entityName}Response".'),
        },
        async (params) => {
            const pattern = patternsLoader.patterns.get('mapping-pattern');
            let content = pattern?.content ?? 'Mapping pattern documentation not available.';

            if (params.entityName && params.fields && params.fields.length > 0) {
                const responseName = params.responseName || `${params.entityName}Response`;
                content += '\n\n' + MAPPING_PATTERN_WITH_CONTEXT(params.entityName, params.fields, responseName);
            }

            return {
                content: [{ type: 'text' as const, text: content }],
            };
        },
    );
}
