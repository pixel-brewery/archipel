#!/usr/bin/env node

// #region Imports

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { DocsLoader } from './DocsLoader.js';
import { GuidesLoader } from './GuidesLoader.js';
import { PatternsLoader } from './PatternsLoader.js';
import { registerGetConfigPatternTool } from './tools/registerGetConfigPatternTool.js';
import { registerGetDtoPatternTool } from './tools/registerGetDtoPatternTool.js';
import { registerGetErrorHandlingPatternTool } from './tools/registerGetErrorHandlingPatternTool.js';
import { registerGetGuardPatternTool } from './tools/registerGetGuardPatternTool.js';
import { registerGetGuideTool } from './tools/registerGetGuideTool.js';
import { registerGetMappingPatternTool } from './tools/registerGetMappingPatternTool.js';
import { registerGetModulePatternTool } from './tools/registerGetModulePatternTool.js';
import { registerGetPackageDocTool } from './tools/registerGetPackageDocTool.js';
import { registerGetQueryPatternTool } from './tools/registerGetQueryPatternTool.js';
import { registerGetRepositoryPatternTool } from './tools/registerGetRepositoryPatternTool.js';
import { registerGetTestingPatternTool } from './tools/registerGetTestingPatternTool.js';
import { registerListGuidesTool } from './tools/registerListGuidesTool.js';
import { registerListPackagesTool } from './tools/registerListPackagesTool.js';
import { registerSearchDocsTool } from './tools/registerSearchDocsTool.js';
import { registerSearchGuidesTool } from './tools/registerSearchGuidesTool.js';
import { readPackageVersion } from './utils/readPackageVersion.js';

// #endregion

// #region Fields

const SERVER_NAME = 'archipel-mcp';

// #endregion

// #region Bootstrap

async function main(): Promise<void> {
    const serverVersion: string = readPackageVersion();

    const docsLoader = new DocsLoader();
    docsLoader.load();

    const guidesLoader = new GuidesLoader();
    guidesLoader.load();

    const patternsLoader = new PatternsLoader();
    patternsLoader.load();

    const server = new McpServer({
        name: SERVER_NAME,
        description: 'MCP server for Archipel platform documentation, guides, and knowledge base.',
        title: 'Archipel MCP Server',
        websiteUrl: 'https://pixel-brewery.github.io/archipel/',
        version: serverVersion,
    });

    // docs tools
    registerListPackagesTool(server, docsLoader);
    registerGetPackageDocTool(server, docsLoader);
    registerSearchDocsTool(server, docsLoader);
    // guides tools
    registerListGuidesTool(server, guidesLoader);
    registerGetGuideTool(server, guidesLoader);
    registerSearchGuidesTool(server, guidesLoader);
    // pattern tools
    registerGetQueryPatternTool(server, patternsLoader);
    registerGetRepositoryPatternTool(server, patternsLoader);
    registerGetMappingPatternTool(server, patternsLoader);
    registerGetModulePatternTool(server, patternsLoader);
    registerGetErrorHandlingPatternTool(server, patternsLoader);
    registerGetConfigPatternTool(server, patternsLoader);
    registerGetGuardPatternTool(server, patternsLoader);
    registerGetDtoPatternTool(server, patternsLoader);
    registerGetTestingPatternTool(server, patternsLoader);

    const transport = new StdioServerTransport();
    await server.connect(transport);

    process.stderr.write(`[${SERVER_NAME}] Server running on stdio\n`);
}

// #endregion

main().catch((error: unknown) => {
    process.stderr.write(`[${SERVER_NAME}] Fatal error: ${String(error)}\n`);
    process.exit(1);
});
