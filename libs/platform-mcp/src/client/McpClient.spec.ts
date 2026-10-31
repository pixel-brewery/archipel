import { Logger } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { McpClient } from './McpClient.js';
import { McpClientHealthIndicator } from './McpClientHealthIndicator.js';
import { McpClientError } from './errors/McpClientError.js';
import type { McpClientBase } from './abstracts/McpClientBase.js';
const sdk = vi.hoisted(() => ({ connect: vi.fn(), listTools: vi.fn(), callTool: vi.fn(), ping: vi.fn(), close: vi.fn(), transport: vi.fn() }));
vi.mock('@modelcontextprotocol/sdk/client/index.js', () => {
    /**
     * Replaces the SDK boundary while preserving observable transport calls.
     */
    class ProtocolDouble {
        // #region Fields
        /**
         * Spy for SDK protocol initialization.
         */
        public connect: typeof sdk.connect = sdk.connect;
        /**
         * Spy for remote tool discovery.
         */
        public listTools: typeof sdk.listTools = sdk.listTools;
        /**
         * Spy for remote tool effects.
         */
        public callTool: typeof sdk.callTool = sdk.callTool;
        /**
         * Spy for the independent readiness probe.
         */
        public ping: typeof sdk.ping = sdk.ping;
        /**
         * Spy for transport cleanup.
         */
        public close: typeof sdk.close = sdk.close;
        // #endregion

        // #region Ctor
        // #endregion

        // #region Properties
        // #endregion

        // #region Methods
        // #endregion
    }
    return { Client: ProtocolDouble };
});
vi.mock('@modelcontextprotocol/sdk/client/streamableHttp.js', () => {
    /**
     * Replaces the SDK boundary while preserving observable transport calls.
     */
    class StreamableHttpTransportDouble {
        // #region Fields
        // #endregion

        // #region Ctor
        /**
         * Captures the endpoint and request settings passed to the SDK transport.
         *
         * @param arguments_ - SDK transport constructor arguments to capture for assertions.
         */
        public constructor(...arguments_: unknown[]) {
            sdk.transport(...arguments_);
        }
        // #endregion

        // #region Properties
        // #endregion

        // #region Methods
        // #endregion
    }
    return { StreamableHTTPClientTransport: StreamableHttpTransportDouble };
});
const options = { url: 'https://mcp.example.test/mcp', authToken: 'test-only-token' };
const specification = { name: 'echo', description: 'Echo', inputSchema: { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] } };
const fake = (): McpClientBase => ({
    connect: vi.fn().mockResolvedValue(undefined),
    listTools: vi.fn().mockResolvedValue([specification]),
    callTool: vi.fn().mockResolvedValue({ content: [{ type: 'text', text: 'answer' }] }),
    close: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
});
beforeEach(() => {
    sdk.connect.mockReset().mockResolvedValue(undefined);
    sdk.listTools.mockReset().mockResolvedValue({ tools: [specification] });
    sdk.callTool.mockReset().mockResolvedValue({ content: [{ type: 'text', text: 'answer' }] });
    sdk.ping.mockReset().mockResolvedValue({});
    sdk.close.mockReset().mockResolvedValue(undefined);
    sdk.transport.mockReset();
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});
describe('Bounded streamable HTTP MCP adapter', () => {
    it('shares connection initialization and supplies caller credentials only to the transport', async () => {
        // arrange
        const client = new McpClient(options);
        // act
        await Promise.all([client.connect(), client.connect()]);
        // assert
        expect(sdk.connect).toHaveBeenCalledOnce();
        const headers = sdk.transport.mock.calls[0][1].requestInit.headers as Headers;
        expect(headers.get('authorization')).toBe('Bearer test-only-token');
    });
    it('wraps a failed connection without exposing credentials', async () => {
        // arrange
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const client = new McpClient(options);
        sdk.connect.mockRejectedValue(new Error('private credential'));
        // act
        const result = client.connect();
        // assert
        await expect(result).rejects.toMatchObject({ code: 'MCP_CONNECT_FAILED', message: 'MCP operation failed.' });
        await expect(result).rejects.toBeInstanceOf(McpClientError);
        expect(warn).toHaveBeenCalledWith(
            expect.objectContaining({ operation: 'connect', requestId: expect.any(String), duration: expect.any(Number), code: 'MCP_CONNECT_FAILED' }),
        );
        expect(JSON.stringify(warn.mock.calls)).not.toContain('private credential');
    });
    it('discovers tools across all pages', async () => {
        // arrange
        const client = new McpClient(options);
        sdk.listTools
            .mockResolvedValueOnce({ tools: [specification], nextCursor: 'next' })
            .mockResolvedValueOnce({ tools: [{ ...specification, name: 'second' }] });
        // act
        const tools = await client.listTools();
        // assert
        expect(tools.map((tool) => tool.name)).toEqual(['echo', 'second']);
        expect(sdk.listTools.mock.calls[1][0]).toEqual({ cursor: 'next' });
    });
    it('rejects cyclic empty pagination instead of looping forever', async () => {
        // arrange
        const client = new McpClient(options);
        sdk.listTools.mockResolvedValue({ tools: [], nextCursor: 'same' });
        // act
        const tools = client.listTools();
        // assert
        await expect(tools).rejects.toMatchObject({ code: 'MCP_PAGINATION' });
        expect(sdk.listTools).toHaveBeenCalledTimes(2);
    });
    it('rejects excessive tools before allocating an unbounded catalog', async () => {
        // arrange
        const client = new McpClient({ ...options, maxTools: 1 });
        sdk.listTools.mockResolvedValue({ tools: [specification, { ...specification, name: 'second' }] });
        // act
        const tools = client.listTools();
        // assert
        await expect(tools).rejects.toMatchObject({ code: 'MCP_TOOL_CAPACITY' });
    });
    it('preserves text and nontext blocks in the standard remote result', async () => {
        // arrange
        const client = new McpClient(options);
        sdk.callTool.mockResolvedValue({
            content: [
                { type: 'text', text: 'first' },
                { type: 'image', data: 'dGVzdC1vbmx5LWltYWdl', mimeType: 'image/png' },
                { type: 'text', text: 'second' },
            ],
        });
        // act
        const output = await client.callTool('echo', { value: 'input' });
        // assert
        expect(output).toEqual({
            content: [
                { type: 'text', text: 'first' },
                { type: 'image', data: 'dGVzdC1vbmx5LWltYWdl', mimeType: 'image/png' },
                { type: 'text', text: 'second' },
            ],
        });
        expect(sdk.callTool).toHaveBeenCalledOnce();
    });
    it('preserves structured output and protocol metadata', async () => {
        // arrange
        const client = new McpClient(options);
        const response = { content: [{ type: 'text', text: 'verified' }], structuredContent: { verified: true }, _meta: { reference: 'test-reference' } };
        sdk.callTool.mockResolvedValue(response);
        // act
        const output = await client.callTool('echo', {});
        // assert
        expect(output).toEqual(response);
    });
    it('does not retry an ambiguous remote effect', async () => {
        // arrange
        const client = new McpClient(options);
        sdk.callTool.mockRejectedValue(new Error('remote API secret'));
        // act
        const output = client.callTool('send', {});
        // assert
        await expect(output).rejects.toMatchObject({ code: 'MCP_TOOL_FAILED' });
        expect(sdk.callTool).toHaveBeenCalledOnce();
    });
    it.each([{ isError: true, content: [{ type: 'text', text: 'private remote failure' }] }, { content: null }])(
        'rejects an unusable remote result (%j)',
        async (result) => {
            // arrange
            const client = new McpClient(options);
            sdk.callTool.mockResolvedValue(result);
            // act
            const output = client.callTool('echo', {});
            // assert
            await expect(output).rejects.toMatchObject({ code: 'MCP_TOOL_FAILED' });
        },
    );
    it('does not invoke a tool for an already aborted caller', async () => {
        // arrange
        const client = new McpClient(options);
        const controller = new AbortController();
        controller.abort();
        // act
        const result = client.callTool('echo', {}, controller.signal);
        // assert
        await expect(result).rejects.toThrowError();
        expect(sdk.callTool).not.toHaveBeenCalled();
    });
    it('times out a connection that never resolves', async () => {
        // arrange
        vi.useFakeTimers();
        sdk.connect.mockImplementation(() => new Promise(() => undefined));
        const result = new McpClient({ ...options, timeoutMs: 10 }).connect();
        const rejected = expect(result).rejects.toThrowError();
        // act
        await vi.advanceTimersByTimeAsync(10);
        // assert
        await rejected;
    });
    it('probes readiness without invoking a business tool', async () => {
        // arrange
        const client = new McpClient(options);
        // act
        await client.ping();
        // assert
        expect(sdk.ping).toHaveBeenCalledWith(expect.objectContaining({ timeout: 3000 }));
        expect(sdk.callTool).not.toHaveBeenCalled();
    });
    it('closes once and refuses reuse after disposal', async () => {
        // arrange
        const client = new McpClient(options);
        await client.connect();
        // act
        await Promise.all([client.close(), client.close()]);
        // assert
        expect(sdk.close).toHaveBeenCalledOnce();
        await expect(client.connect()).rejects.toMatchObject({ code: 'MCP_CLOSED' });
    });
    it('reports failed cleanup without leaking transport details', async () => {
        // arrange
        sdk.close.mockRejectedValue(new Error('credential-bearing URL'));
        const client = new McpClient(options);
        // act
        const result = client.close();
        // assert
        await expect(result).rejects.toMatchObject({ code: 'MCP_CLOSE_FAILED' });
    });
    it.each(['not-a-url', 'file:///private', 'https://user:password@example.test'])('rejects an invalid transport URL (%s)', (url) => {
        // arrange
        const invalid = { url };
        // act
        const create = () => new McpClient(invalid);
        // assert
        expect(create).toThrowError(expect.objectContaining({ code: 'INVALID_MCP_OPTIONS' }));
    });
    it.each([{ authToken: 'test-only-token\ninvalid' }, { headers: { 'invalid header': 'test-only-token' } }])(
        'sanitizes invalid transport headers (%j)',
        (invalid) => {
            // arrange
            const configuration = { ...options, ...invalid };
            // act
            const create = () => new McpClient(configuration);
            // assert
            expect(create).toThrowError(expect.objectContaining({ code: 'INVALID_MCP_OPTIONS', message: 'MCP transport settings are invalid.' }));
        },
    );
});
describe('MCP client readiness', () => {
    it('reports health without credentials or remote payloads', async () => {
        // arrange
        const client = fake();
        const healthy = new McpClientHealthIndicator(client);
        // act
        const result = await healthy.check();
        // assert
        expect(result).toEqual({ 'mcp-client': { status: 'up' } });
    });
    it('reports an unavailable service as down without leaking its error', async () => {
        // arrange
        vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const client = fake();
        vi.mocked(client.ping).mockRejectedValue(new Error('private credential'));
        // act
        const result = await new McpClientHealthIndicator(client).check();
        // assert
        expect(result).toEqual({ 'mcp-client': { status: 'down' } });
    });
});
