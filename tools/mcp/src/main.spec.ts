// #region Imports

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { z } from 'zod';

// #endregion

/**
 * Integration tests for the built MCP server.
 *
 * Spawns the compiled `dist/tools/mcp/src/main.js` as a subprocess via
 * `StdioClientTransport` and executes real MCP protocol calls against it.
 * This validates that the build output is complete (including data/ assets)
 * and that every tool returns non-empty content.
 */
describe('MCP Server Integration (stdio)', () => {
    // #region Fields

    const SERVER_ENTRY = path.resolve(import.meta.dirname, '..', '..', '..', 'dist', 'tools', 'mcp', 'src', 'main.js');

    let client: Client;
    let transport: StdioClientTransport;

    // #endregion

    // #region Setup

    beforeAll(async () => {
        transport = new StdioClientTransport({
            command: 'node',
            args: [SERVER_ENTRY],
            cwd: path.resolve(import.meta.dirname, '..', '..', '..'),
            stderr: 'pipe',
        });

        client = new Client({
            name: 'integration-test-client',
            version: '1.0.0',
        });

        await client.connect(transport);
    }, 15_000);

    afterAll(async () => {
        await client.close();
    });

    // #endregion

    // #region Server Metadata Tests

    describe('server metadata', () => {
        it('should report the server name and built package version', () => {
            // Arrange
            const rawMetadata: unknown = JSON.parse(readFileSync(path.resolve(path.dirname(SERVER_ENTRY), '..', 'package.json'), 'utf8'));
            const metadata = z.object({ version: z.string() }).parse(rawMetadata);

            // Act
            const serverVersion = client.getServerVersion();

            // Assert
            expect(serverVersion).toBeDefined();
            expect(serverVersion?.name).toBe('archipel-mcp');
            expect(serverVersion?.version).toBe(metadata.version);
        });

        it('should expose server capabilities', () => {
            // arrange & act
            const capabilities = client.getServerCapabilities();

            // assert
            expect(capabilities).toBeDefined();
            expect(capabilities!.tools).toBeDefined();
        });
    });

    // #endregion

    // #region Tool Listing Tests

    describe('tool listing', () => {
        it('should list all registered tools', async () => {
            // arrange & act
            const result = await client.listTools();

            // assert
            expect(result.tools.length).toBeGreaterThanOrEqual(15);

            const toolNames = result.tools.map((tool) => tool.name);
            expect(toolNames).toContain('list-packages');
            expect(toolNames).toContain('get-package-doc');
            expect(toolNames).toContain('search-docs');
            expect(toolNames).toContain('list-guides');
            expect(toolNames).toContain('get-guide');
            expect(toolNames).toContain('search-guides');
            expect(toolNames).toContain('get-query-pattern');
            expect(toolNames).toContain('get-repository-pattern');
            expect(toolNames).toContain('get-mapping-pattern');
            expect(toolNames).toContain('get-module-pattern');
            expect(toolNames).toContain('get-error-handling-pattern');
            expect(toolNames).toContain('get-config-pattern');
            expect(toolNames).toContain('get-guard-pattern');
            expect(toolNames).toContain('get-dto-pattern');
            expect(toolNames).toContain('get-testing-pattern');
        });

        it('should provide descriptions for all tools', async () => {
            // arrange & act
            const result = await client.listTools();

            // assert
            for (const tool of result.tools) {
                expect(tool.description, `Tool "${tool.name}" should have a description`).toBeTruthy();
            }
        });
    });

    // #endregion

    // #region Documentation Tools Tests

    describe('documentation tools', () => {
        it('should return non-empty package list via list-packages', async () => {
            // arrange & act
            const result = await client.callTool({ name: 'list-packages', arguments: {} });

            // assert
            expect(result.isError).toBeFalsy();
            expect(result.content).toBeDefined();
            expect(Array.isArray(result.content)).toBe(true);
            expect((result.content as Array<{ type: string; text: string }>).length).toBeGreaterThan(0);

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(0);
            expect(text).toContain('platform-');
        });

        it('should return content for a specific package via get-package-doc', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'get-package-doc',
                arguments: { packageName: 'platform-core' },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(100);
            expect(text.toLowerCase()).toContain('platform-core');
        });

        it('should return results for search-docs with a known term', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'search-docs',
                arguments: { query: 'mapping' },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(0);
        });
    });

    // #endregion

    // #region Guides Tools Tests

    describe('guides tools', () => {
        it('should return non-empty guide list via list-guides', async () => {
            // arrange & act
            const result = await client.callTool({ name: 'list-guides', arguments: {} });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(0);
        });

        it('should return content for a specific guide via get-guide', async () => {
            // arrange
            const listResult = await client.callTool({ name: 'list-guides', arguments: {} });
            const listText = (listResult.content as Array<{ type: string; text: string }>)[0].text;

            // Extract the first guide name from the listing
            const guideNameMatch = listText.match(/^-\s+\*\*(.+?)\*\*/m) ?? listText.match(/^\d+\.\s+(.+?)(?:\s|$)/m);
            const guideName = guideNameMatch ? guideNameMatch[1].trim() : 'getting-started';

            // act
            const result = await client.callTool({
                name: 'get-guide',
                arguments: { guideName },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(50);
        });

        it('should return results for search-guides with a known term', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'search-guides',
                arguments: { query: 'authentication' },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(0);
        });
    });

    // #endregion

    // #region Knowledge Pattern Tools Tests

    describe('knowledge pattern tools', () => {
        const knowledgeTools = [
            'get-config-pattern',
            'get-dto-pattern',
            'get-error-handling-pattern',
            'get-guard-pattern',
            'get-module-pattern',
            'get-query-pattern',
            'get-repository-pattern',
            'get-mapping-pattern',
            'get-testing-pattern',
        ];

        it.each(knowledgeTools)('should return non-empty content for %s', async (toolName) => {
            // arrange & act
            const result = await client.callTool({ name: toolName, arguments: {} });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(50);
        });

        it('should return content for get-query-pattern with a model name', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'get-query-pattern',
                arguments: { modelName: 'User' },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(50);
            expect(text).toContain('User');
        });

        it('should return content for get-repository-pattern with a model name', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'get-repository-pattern',
                arguments: { modelName: 'Order' },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(50);
            expect(text).toContain('Order');
        });

        it('should return content for get-mapping-pattern with entity name', async () => {
            // arrange & act
            const result = await client.callTool({
                name: 'get-mapping-pattern',
                arguments: { entityName: 'Product', fields: ['id', 'name', 'price'] },
            });

            // assert
            expect(result.isError).toBeFalsy();

            const text = (result.content as Array<{ type: string; text: string }>)[0].text;
            expect(text.length).toBeGreaterThan(50);
            expect(text).toContain('Product');
        });
    });

    // #endregion

    // #region Build Integrity Tests

    describe('build integrity', () => {
        it('should have loaded documentation packages from the bundled data/ folder', async () => {
            // arrange & act
            const result = await client.callTool({ name: 'list-packages', arguments: {} });
            const text = (result.content as Array<{ type: string; text: string }>)[0].text;

            // assert - the bundled data/ must contain multiple packages
            const packageMentions = text.match(/platform-/g) ?? [];
            expect(packageMentions.length).toBeGreaterThanOrEqual(5);
        });

        it('should have loaded guides from the bundled data/ folder', async () => {
            // arrange & act
            const result = await client.callTool({ name: 'list-guides', arguments: {} });
            const text = (result.content as Array<{ type: string; text: string }>)[0].text;

            // assert - the bundled data/ must contain multiple guides
            expect(text.length).toBeGreaterThan(200);
        });
    });

    // #endregion
});
