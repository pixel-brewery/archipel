import { afterEach, describe, expect, it, vi } from 'vitest';
import type { McpClientBase } from '@pixel-brewery/archipel-platform-mcp/client';
import { McpToolAdapter } from './McpToolAdapter.js';
const specification = { name: 'echo', description: 'Echo', inputSchema: { type: 'object', properties: { value: { type: 'string' } }, required: ['value'] } };
const fake = (): McpClientBase => ({
    connect: vi.fn().mockResolvedValue(undefined),
    listTools: vi.fn().mockResolvedValue([specification]),
    callTool: vi.fn().mockResolvedValue({ content: [{ type: 'text', text: 'answer' }] }),
    close: vi.fn().mockResolvedValue(undefined),
    ping: vi.fn().mockResolvedValue(undefined),
});
afterEach(() => vi.restoreAllMocks());
describe('MCP tools as ordinary agent tools', () => {
    it('shares discovery and forwards validated inputs and cancellation', async () => {
        // arrange
        const client = fake();
        const registry = new McpToolAdapter([client]);
        const [tools] = await Promise.all([registry.discoverTools(), registry.discoverTools()]);
        const signal = new AbortController().signal;
        // act
        const output = await tools['echo'].execute?.({ value: 'input' }, { toolCallId: 'call', messages: [], abortSignal: signal });
        // assert
        expect(output).toBe('answer');
        expect(client.listTools).toHaveBeenCalledOnce();
        expect(client.callTool).toHaveBeenCalledWith('echo', { value: 'input' }, signal);
    });
    it('rejects schema-invalid input before any remote effect', async () => {
        // arrange
        const client = fake();
        const tools = await new McpToolAdapter([client]).discoverTools();
        // act
        const output = tools['echo'].execute?.({ value: 7 }, { toolCallId: 'call', messages: [] });
        // assert
        await expect(output).rejects.toThrowError();
        expect(client.callTool).not.toHaveBeenCalled();
    });
    it('preserves a result containing nontext protocol content', async () => {
        // arrange
        const client = fake();
        const result = { content: [{ type: 'image' as const, data: 'dGVzdA==', mimeType: 'image/png' }], _meta: { reference: 'test-reference' } };
        vi.mocked(client.callTool).mockResolvedValue(result);
        const tools = await new McpToolAdapter([client]).discoverTools();
        // act
        const output = await tools['echo'].execute?.({ value: 'input' }, { toolCallId: 'call', messages: [] });
        // assert
        expect(output).toEqual(result);
    });
    it('rejects cross-server name collisions', async () => {
        // arrange
        const registry = new McpToolAdapter([fake(), fake()]);
        // act
        const tools = registry.discoverTools();
        // assert
        await expect(tools).rejects.toMatchObject({ code: 'MCP_TOOL_CAPACITY' });
    });
    it('wraps discovery failures and closes every owned client', async () => {
        // arrange
        const client = fake();
        vi.mocked(client.listTools).mockRejectedValue(new Error('private transport failure'));
        const registry = new McpToolAdapter([client]);
        // act
        const tools = registry.discoverTools();
        // assert
        await expect(tools).rejects.toMatchObject({ code: 'MCP_DISCOVERY_FAILED' });
        await registry.close();
        expect(client.close).toHaveBeenCalledOnce();
        await expect(registry.discoverTools()).rejects.toMatchObject({ code: 'MCP_CLOSED' });
    });
    it('refuses a previously discovered tool after closing the registry', async () => {
        // arrange
        const registry = new McpToolAdapter([fake()]);
        const tools = await registry.discoverTools();
        await registry.close();
        // act
        const output = tools['echo'].execute?.({ value: 'input' }, { toolCallId: 'call', messages: [] });
        // assert
        await expect(output).rejects.toMatchObject({ code: 'MCP_CLOSED' });
    });
    it('reports failed client teardown', async () => {
        // arrange
        const client = fake();
        vi.mocked(client.close).mockRejectedValue(new Error('cleanup'));
        // act
        const result = new McpToolAdapter([client]).close();
        // assert
        await expect(result).rejects.toMatchObject({ code: 'MCP_CLOSE_FAILED' });
    });
    it('rejects invalid registry budgets', () => {
        // arrange
        const clients = Array.from({ length: 17 }, fake);
        // act
        const excessive = () => new McpToolAdapter(clients);
        const invalid = () => new McpToolAdapter([], 0);
        // assert
        expect(excessive).toThrowError();
        expect(invalid).toThrowError();
    });
});
