import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { PatternsLoader } from '../PatternsLoader.js';
import { MODULE_PATTERN_WITH_CONTEXT } from '../generators/modulePatternGenerator.js';

/**
 * Registers the get-module-pattern tool on the MCP server.
 */
export function registerGetModulePatternTool(server: McpServer, patternsLoader: PatternsLoader): void {
    server.tool(
        'get-module-pattern',
        'Returns the Archipel NestJS dynamic module pattern - register(), abstract base/adapter injection, ConfigModule integration. Optionally tailored with module name and abstract base definitions.',
        {
            moduleName: z.string().optional().describe('Module name (e.g. "NotificationModule"). If provided, generates a complete module scaffold.'),
            bases: z
                .array(z.string().regex(/Base$/, 'Abstract class names must end in Base.'))
                .optional()
                .describe('Abstract class names (e.g. ["NotificationBase", "TemplateBase"]). Classes live under abstracts/ and serve as DI tokens.'),
        },
        async (params) => {
            const pattern = patternsLoader.patterns.get('module-pattern');
            let content = pattern?.content ?? 'Module pattern documentation not available.';

            if (params.moduleName && params.bases && params.bases.length > 0) {
                content += '\n\n' + MODULE_PATTERN_WITH_CONTEXT(params.moduleName, params.bases);
            }

            return {
                content: [{ type: 'text' as const, text: content }],
            };
        },
    );
}
