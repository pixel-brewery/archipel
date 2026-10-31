import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { Test, type TestingModule } from '@nestjs/testing';
import { McpModule, McpRegistryService, McpServerService, McpTool } from '@pixel-brewery/archipel-platform-mcp';
import { McpClient, type McpClientBase } from '@pixel-brewery/archipel-platform-mcp/client';
import { z } from 'zod';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Agent } from '../participants/Agent.js';
import { AgentRuntime } from '../runtime/AgentRuntime.js';
import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';
import { McpToolAdapter } from './McpToolAdapter.js';

type ToolResult = Awaited<ReturnType<McpClientBase['callTool']>>;
const execute = vi.fn<(input: { value: string }) => ToolResult>();

/**
 * Exposes a decorated local tool through the existing MCP discovery and registry pipeline.
 *
 * @internal
 */
class EchoTool {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Executes the observable effect behind the decorated tool.
     *
     * @param input - Arguments validated by the existing MCP server's Zod schema.
     * @returns The standard MCP result, including structured output.
     */
    public echo(input: { value: string }): ToolResult {
        return execute(input);
    }

    // #endregion
}

McpTool({
    name: 'echo',
    title: 'Echo',
    description: 'Returns the verified input.',
    inputSchema: { value: z.string() },
    outputSchema: { value: z.string(), verified: z.boolean() },
    annotations: { readOnlyHint: true },
    requiredScopes: ['inspect'],
})(EchoTool.prototype, 'echo', Object.getOwnPropertyDescriptor(EchoTool.prototype, 'echo') as PropertyDescriptor);

let http: Server | undefined;
let adapter: McpToolAdapter | undefined;
let runtime: AgentRuntime | undefined;
const contexts: TestingModule[] = [];
const cleanup: Promise<void>[] = [];

afterEach(async () => {
    await runtime?.dispose();
    await adapter?.close();
    http?.closeAllConnections();
    if (http) {
        await new Promise<void>((resolve) => http?.close(() => resolve()));
    }
    await Promise.all(cleanup);
    contexts.length = 0;
    cleanup.length = 0;
    runtime = undefined;
    adapter = undefined;
    http = undefined;
    execute.mockReset();
    vi.restoreAllMocks();
});

describe('Existing MCP decorators and registry through the shared client into an agent', () => {
    it('discovers the decorated schema and executes its handler under the agent guard', async () => {
        // arrange
        execute.mockImplementation((input) => ({ content: [{ type: 'text', text: input.value }], structuredContent: { value: input.value, verified: true } }));
        const authorizations: Array<string | undefined> = [];
        http = createServer(async (request, response) => {
            authorizations.push(request.headers.authorization);
            if (request.method !== 'POST' || request.headers.authorization !== 'Bearer test-only-token') {
                response.writeHead(401).end();
                return;
            }
            Object.assign(request, { auth: { token: 'test-only-token', clientId: 'test-client', scopes: ['inspect'] } });
            const chunks: Buffer[] = [];
            for await (const chunk of request) {
                chunks.push(Buffer.from(chunk));
            }
            // A stateless HTTP request owns one server context and transport.
            const context = await Test.createTestingModule({
                imports: [McpModule.register({ name: 'test-server', version: '1.0.0' })],
                providers: [EchoTool],
            }).compile();
            contexts.push(context);
            await context.init();
            const transport = await context.get(McpServerService).createStreamableHttpTransport({ enableJsonResponse: true });
            response.on('close', () => cleanup.push(context.close()));
            await transport.handleRequest(request, response, JSON.parse(Buffer.concat(chunks).toString()));
        });
        http.listen(0, '127.0.0.1');
        await once(http, 'listening');
        const address = http.address();
        if (!address || typeof address === 'string') {
            throw new Error('Missing test server address.');
        }
        const client = new McpClient({ url: `http://127.0.0.1:${address.port}/mcp`, authToken: 'test-only-token' });
        adapter = new McpToolAdapter([client]);
        const tools = await adapter.discoverTools();
        const inference = {
            run: vi
                .fn<AgentInferenceBase['run']>()
                .mockResolvedValueOnce({
                    text: '',
                    toolCalls: [{ toolCallId: 'remote-call', toolName: 'echo', input: { value: 'verified' } }],
                    usage: null,
                    finishReason: 'tool-calls',
                })
                .mockResolvedValueOnce({ text: 'Inspection complete.', toolCalls: [], usage: null, finishReason: 'stop' }),
            stream: vi.fn<AgentInferenceBase['stream']>(),
        };
        runtime = new AgentRuntime(inference);
        runtime.join(new Agent({ id: 'inspector', name: 'Inspector', instruction: 'Inspect the supplied input.', tools }));
        const guard = vi.fn().mockResolvedValue(undefined);

        // act
        const outcome = await runtime.runLoop('inspector', 'Inspect input.', { beforeToolCall: guard });

        // assert
        expect(outcome.status).toBe('completed');
        expect(execute).toHaveBeenCalledExactlyOnceWith({ value: 'verified' });
        expect(guard).toHaveBeenCalledOnce();
        expect(guard.mock.invocationCallOrder[0]).toBeLessThan(execute.mock.invocationCallOrder[0]);
        expect(contexts.every((context) => context.get(McpRegistryService).tools.has('echo'))).toBe(true);
        expect(tools['echo'].inputSchema).toMatchObject({ kind: 'json-schema', jsonSchema: { type: 'object', required: ['value'] } });
        expect(tools['echo'].outputSchema).toMatchObject({ kind: 'json-schema', jsonSchema: { type: 'object', required: ['value', 'verified'] } });
        expect(inference.run.mock.calls[1][0].prompt.messages).toContainEqual({
            role: 'tool',
            content: [{ type: 'tool-result', toolCallId: 'remote-call', toolName: 'echo', output: { value: 'verified', verified: true } }],
        });
        expect(authorizations.length).toBeGreaterThan(2);
        expect(new Set(authorizations)).toEqual(new Set(['Bearer test-only-token']));
    });
});
