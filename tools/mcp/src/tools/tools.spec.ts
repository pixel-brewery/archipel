// #region Imports

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DocsLoader } from '../DocsLoader.js';
import { GuidesLoader } from '../GuidesLoader.js';
import { PatternsLoader } from '../PatternsLoader.js';
import { registerGetConfigPatternTool } from './registerGetConfigPatternTool.js';
import { registerGetDtoPatternTool } from './registerGetDtoPatternTool.js';
import { registerGetErrorHandlingPatternTool } from './registerGetErrorHandlingPatternTool.js';
import { registerGetGuardPatternTool } from './registerGetGuardPatternTool.js';
import { registerGetGuideTool } from './registerGetGuideTool.js';
import { registerGetMappingPatternTool } from './registerGetMappingPatternTool.js';
import { registerGetModulePatternTool } from './registerGetModulePatternTool.js';
import { registerGetPackageDocTool } from './registerGetPackageDocTool.js';
import { registerGetQueryPatternTool } from './registerGetQueryPatternTool.js';
import { registerGetRepositoryPatternTool } from './registerGetRepositoryPatternTool.js';
import { registerGetTestingPatternTool } from './registerGetTestingPatternTool.js';
import { registerListGuidesTool } from './registerListGuidesTool.js';
import { registerListPackagesTool } from './registerListPackagesTool.js';
import { registerSearchDocsTool } from './registerSearchDocsTool.js';
import { registerSearchGuidesTool } from './registerSearchGuidesTool.js';

// #endregion

/**
 * Helper that captures tool handlers registered on the McpServer.
 * Since the real McpServer.tool() method registers a callback, we intercept it
 * to invoke the handler directly in tests without transport layer.
 */
interface ICapturedTool {
    readonly name: string;
    readonly description: string;
    readonly handler: (params: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }>;
}

function createServerWithCapture(): { server: McpServer; tools: Map<string, ICapturedTool> } {
    const server = new McpServer({ name: 'test', version: '0.0.0' });
    const tools = new Map<string, ICapturedTool>();

    const originalTool = server.tool.bind(server);

    vi.spyOn(server, 'tool').mockImplementation((...args: unknown[]) => {
        const name = args[0] as string;
        const description = args[1] as string;

        // server.tool has overloads: (name, description, schema, handler) or (name, description, handler)
        const handler = typeof args[2] === 'function' ? args[2] : args[3];

        tools.set(name, {
            name,
            description,
            handler: handler as ICapturedTool['handler'],
        });

        return originalTool(...(args as Parameters<typeof originalTool>));
    });

    return { server, tools };
}

describe('Tool Registration', () => {
    // #region Fields

    let docsLoader: DocsLoader;
    let guidesLoader: GuidesLoader;
    let patternsLoader: PatternsLoader;
    let tempDocsDirectory: string;
    let tempGuidesDirectory: string;
    let tempPatternsDirectory: string;

    // #endregion

    // #region Setup

    beforeEach(() => {
        const tmpBase = path.join(process.cwd(), 'tmp');
        fs.mkdirSync(tmpBase, { recursive: true });
        tempDocsDirectory = fs.mkdtempSync(path.join(tmpBase, 'tools-docs-'));
        tempGuidesDirectory = fs.mkdtempSync(path.join(tmpBase, 'tools-guides-'));
        tempPatternsDirectory = fs.mkdtempSync(path.join(tmpBase, 'tools-patterns-'));

        // Create test package docs
        const packageDirectory = path.join(tempDocsDirectory, 'platform-core');
        fs.mkdirSync(packageDirectory, { recursive: true });
        fs.writeFileSync(
            path.join(packageDirectory, 'index.md'),
            [
                '---',
                'title: platform-core',
                'description: Foundation library.',
                'tags: [core, mapping]',
                "package: '@pixel-brewery/archipel-platform-core'",
                '---',
                '',
                '# platform-core',
                '',
                'Provides MappingService and EventHub.',
            ].join('\n'),
        );

        // Create test guide
        fs.writeFileSync(
            path.join(tempGuidesDirectory, 'getting-started.md'),
            [
                '---',
                'title: Getting Started',
                'description: Quick setup guide.',
                'order: 1',
                '---',
                '',
                '# Getting Started',
                '',
                'Install platform-core first.',
            ].join('\n'),
        );

        // Create minimal test pattern files
        const patternNames = [
            'config-pattern',
            'dto-pattern',
            'error-handling-pattern',
            'guard-pattern',
            'mapping-pattern',
            'module-pattern',
            'query-pattern',
            'repository-pattern',
            'testing-pattern',
        ];
        const patternTitles: Record<string, string> = {
            'config-pattern': 'Configuration Pattern',
            'dto-pattern': 'DTO & Validation Pattern',
            'error-handling-pattern': 'Error Handling Pattern',
            'guard-pattern': 'Guard & Interceptor Pattern',
            'mapping-pattern': 'Mapping Pattern',
            'module-pattern': 'Dynamic Module Pattern',
            'query-pattern': 'Query Pattern',
            'repository-pattern': 'Repository Pattern',
            'testing-pattern': 'Testing Pattern',
        };
        for (const name of patternNames) {
            fs.writeFileSync(
                path.join(tempPatternsDirectory, `${name}.md`),
                [
                    '---',
                    `title: ${patternTitles[name]}`,
                    `description: ${patternTitles[name]} description.`,
                    'order: 1',
                    '---',
                    '',
                    `# ${patternTitles[name]}`,
                    '',
                    `This is the ${patternTitles[name]} documentation.`,
                ].join('\n'),
            );
        }

        docsLoader = new DocsLoader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn(DocsLoader.prototype as any, 'resolveDocsDirectory').mockReturnValue(tempDocsDirectory);
        docsLoader.load();

        guidesLoader = new GuidesLoader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn(GuidesLoader.prototype as any, 'resolveGuidesDirectory').mockReturnValue(tempGuidesDirectory);
        guidesLoader.load();

        patternsLoader = new PatternsLoader();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        vi.spyOn(PatternsLoader.prototype as any, 'resolvePatternsDirectory').mockReturnValue(tempPatternsDirectory);
        patternsLoader.load();
    });

    afterEach(() => {
        fs.rmSync(tempDocsDirectory, { recursive: true, force: true });
        fs.rmSync(tempGuidesDirectory, { recursive: true, force: true });
        fs.rmSync(tempPatternsDirectory, { recursive: true, force: true });
        vi.restoreAllMocks();
    });

    // #endregion

    // #region Package Tools

    describe('list-packages', () => {
        it('should return non-empty content with package data', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerListPackagesTool(server, docsLoader);
            const tool = tools.get('list-packages')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].type).toBe('text');

            const parsed = JSON.parse(result.content[0].text) as unknown[];
            expect(parsed).toHaveLength(1);
            expect((parsed[0] as Record<string, unknown>)['name']).toBe('platform-core');
        });

        it('should return empty array when no packages loaded', async () => {
            // arrange
            const emptyLoader = new DocsLoader();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            vi.spyOn(DocsLoader.prototype as any, 'resolveDocsDirectory').mockReturnValue(null);

            const { server, tools } = createServerWithCapture();
            registerListPackagesTool(server, emptyLoader);
            const tool = tools.get('list-packages')!;

            // act
            const result = await tool.handler({});

            // assert
            const parsed = JSON.parse(result.content[0].text) as unknown[];
            expect(parsed).toHaveLength(0);
        });
    });

    describe('get-package-doc', () => {
        it('should return package content for existing package', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetPackageDocTool(server, docsLoader);
            const tool = tools.get('get-package-doc')!;

            // act
            const result = await tool.handler({ packageName: 'platform-core' });

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text).toContain('platform-core');
            expect(result.content[0].text).toContain('Foundation library.');
            expect(result.content[0].text).toContain('MappingService');
            expect(result.isError).toBeUndefined();
        });

        it('should return error for unknown package', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetPackageDocTool(server, docsLoader);
            const tool = tools.get('get-package-doc')!;

            // act
            const result = await tool.handler({ packageName: 'nonexistent' });

            // assert
            expect(result.isError).toBe(true);
            expect(result.content[0].text).toContain('not found');
        });
    });

    describe('search-docs', () => {
        it('should return results for matching query', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerSearchDocsTool(server, docsLoader);
            const tool = tools.get('search-docs')!;

            // act
            const result = await tool.handler({ query: 'mapping' });

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text).toContain('platform-core');
            expect(result.content[0].text).toContain('1 result');
        });

        it('should return no-match message for unmatched query', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerSearchDocsTool(server, docsLoader);
            const tool = tools.get('search-docs')!;

            // act
            const result = await tool.handler({ query: 'zzz-nonexistent-zzz' });

            // assert
            expect(result.content[0].text).toContain('No documentation found');
        });
    });

    // #endregion

    // #region Guide Tools

    describe('list-guides', () => {
        it('should return non-empty content with guide data', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerListGuidesTool(server, guidesLoader);
            const tool = tools.get('list-guides')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);

            const parsed = JSON.parse(result.content[0].text) as unknown[];
            expect(parsed).toHaveLength(1);
            expect((parsed[0] as Record<string, unknown>)['name']).toBe('getting-started');
        });
    });

    describe('get-guide', () => {
        it('should return guide content for existing guide', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetGuideTool(server, guidesLoader);
            const tool = tools.get('get-guide')!;

            // act
            const result = await tool.handler({ guideName: 'getting-started' });

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text).toContain('Getting Started');
            expect(result.content[0].text).toContain('Install platform-core');
            expect(result.isError).toBeUndefined();
        });

        it('should return error for unknown guide', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetGuideTool(server, guidesLoader);
            const tool = tools.get('get-guide')!;

            // act
            const result = await tool.handler({ guideName: 'nonexistent' });

            // assert
            expect(result.isError).toBe(true);
            expect(result.content[0].text).toContain('not found');
        });
    });

    describe('search-guides', () => {
        it('should return results for matching query', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerSearchGuidesTool(server, guidesLoader);
            const tool = tools.get('search-guides')!;

            // act
            const result = await tool.handler({ query: 'platform-core' });

            // assert
            expect(result.content[0].text).toContain('Getting Started');
            expect(result.content[0].text).toContain('1 guide');
        });

        it('should return no-match message for unmatched query', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerSearchGuidesTool(server, guidesLoader);
            const tool = tools.get('search-guides')!;

            // act
            const result = await tool.handler({ query: 'zzz-nonexistent-zzz' });

            // assert
            expect(result.content[0].text).toContain('No guides found');
        });
    });

    // #endregion

    // #region Knowledge Pattern Tools

    describe('get-query-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetQueryPatternTool(server, patternsLoader);
            const tool = tools.get('get-query-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Query Pattern');
        });

        it('should append model-specific content when model provided', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetQueryPatternTool(server, patternsLoader);
            const tool = tools.get('get-query-pattern')!;

            // act
            const result = await tool.handler({ modelName: 'Product', fields: ['id', 'name', 'price'] });

            // assert
            expect(result.content[0].text).toContain('Product');
        });
    });

    describe('get-repository-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetRepositoryPatternTool(server, patternsLoader);
            const tool = tools.get('get-repository-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Repository Pattern');
        });
    });

    describe('get-mapping-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetMappingPatternTool(server, patternsLoader);
            const tool = tools.get('get-mapping-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Mapping Pattern');
        });
    });

    describe('get-module-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetModulePatternTool(server, patternsLoader);
            const tool = tools.get('get-module-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Module Pattern');
        });
    });

    describe('get-error-handling-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetErrorHandlingPatternTool(server, patternsLoader);
            const tool = tools.get('get-error-handling-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Error Handling');
        });
    });

    describe('get-config-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetConfigPatternTool(server, patternsLoader);
            const tool = tools.get('get-config-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Configuration Pattern');
        });
    });

    describe('get-guard-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetGuardPatternTool(server, patternsLoader);
            const tool = tools.get('get-guard-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Guard');
        });
    });

    describe('get-dto-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetDtoPatternTool(server, patternsLoader);
            const tool = tools.get('get-dto-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('DTO');
        });
    });

    describe('get-testing-pattern', () => {
        it('should return non-empty knowledge content', async () => {
            // arrange
            const { server, tools } = createServerWithCapture();
            registerGetTestingPatternTool(server, patternsLoader);
            const tool = tools.get('get-testing-pattern')!;

            // act
            const result = await tool.handler({});

            // assert
            expect(result.content).toHaveLength(1);
            expect(result.content[0].text.length).toBeGreaterThan(50);
            expect(result.content[0].text).toContain('Testing Pattern');
        });
    });

    // #endregion
});
