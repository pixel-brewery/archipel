import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type CallToolResult, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import type { IMcpModuleOptions } from '../interfaces/IMcpModuleOptions.js';
import { McpRegistryService } from './McpRegistryService.js';
import { McpServerService } from './McpServerService.js';

vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => {
    const registerToolFn = vi.fn();
    const registerResourceFn = vi.fn();
    const registerPromptFn = vi.fn();
    const connectFn = vi.fn().mockResolvedValue(undefined);
    const closeFn = vi.fn().mockResolvedValue(undefined);

    class MockMcpServer {
        public registerTool = registerToolFn;
        public registerResource = registerResourceFn;
        public registerPrompt = registerPromptFn;
        public connect = connectFn;
        public close = closeFn;
    }

    class MockResourceTemplate {
        public uri: string;
        constructor(uri: string) {
            this.uri = uri;
        }
    }

    return {
        McpServer: MockMcpServer,
        ResourceTemplate: MockResourceTemplate,
    };
});

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => {
    class MockStdioServerTransport {
        public close = vi.fn().mockResolvedValue(undefined);
    }

    return { StdioServerTransport: MockStdioServerTransport };
});

vi.mock('@modelcontextprotocol/sdk/server/sse.js', () => {
    class MockSSEServerTransport {
        public close = vi.fn().mockResolvedValue(undefined);
    }

    return { SSEServerTransport: MockSSEServerTransport };
});

vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => {
    class MockStreamableHTTPServerTransport {
        public close = vi.fn().mockResolvedValue(undefined);
    }

    return { StreamableHTTPServerTransport: MockStreamableHTTPServerTransport };
});

afterEach(() => {
    if (vi.isFakeTimers()) {
        vi.clearAllTimers();
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
});

function registeredHandler(service: McpServerService): (input: unknown, extra: unknown) => Promise<CallToolResult> {
    const registration = vi.mocked(service.server.registerTool).mock.calls[0];
    if (!registration) {
        throw new Error('Missing test tool registration.');
    }
    return registration[2] as (input: unknown, extra: unknown) => Promise<CallToolResult>;
}

describe('McpServerService', () => {
    let service: McpServerService;
    let registry: McpRegistryService;
    let options: IMcpModuleOptions;
    let discovery: { discoverHandlers: ReturnType<typeof vi.fn> };

    beforeEach(() => {
        // arrange
        vi.clearAllMocks();
        registry = new McpRegistryService();
        options = { name: 'test-server', version: '1.0.0' };
        discovery = { discoverHandlers: vi.fn() };
        service = new McpServerService(options, registry, discovery as never);
    });

    describe('registered tool execution contract', () => {
        it('executes a schema-valid registered handler and preserves its standard result', async () => {
            // arrange
            vi.useFakeTimers();
            const output: CallToolResult = { content: [{ type: 'text', text: 'verified' }], structuredContent: { verified: true } };
            const execute = vi.fn().mockResolvedValue(output);
            registry.registerTool({ name: 'inspect', inputSchema: { value: z.string() } }, execute);
            service.onModuleInit();
            // act
            const result = await registeredHandler(service)({ value: 'input' }, {});
            // assert
            expect(result).toEqual(output);
            expect(execute).toHaveBeenCalledExactlyOnceWith({ value: 'input' }, {});
        });

        it('rejects schema-invalid arguments before calling the registered handler', async () => {
            // arrange
            vi.useFakeTimers();
            const execute = vi.fn();
            registry.registerTool({ name: 'inspect', inputSchema: { value: z.string() } }, execute);
            service.onModuleInit();
            // act
            const result = registeredHandler(service)({ value: 7 }, {});
            // assert
            await expect(result).rejects.toMatchObject({ code: ErrorCode.InvalidParams });
            expect(execute).not.toHaveBeenCalled();
        });

        it('denies missing required scopes before any handler effect', async () => {
            // arrange
            vi.useFakeTimers();
            const execute = vi.fn();
            registry.registerTool({ name: 'inspect', requiredScopes: ['inspect'] }, execute);
            service.onModuleInit();
            // act
            const result = registeredHandler(service)({}, {});
            // assert
            await expect(result).rejects.toMatchObject({ code: ErrorCode.InvalidRequest });
            expect(execute).not.toHaveBeenCalled();
        });

        it('allows a handler when all required scopes are supplied', async () => {
            // arrange
            vi.useFakeTimers();
            const execute = vi.fn().mockResolvedValue({ content: [] });
            registry.registerTool({ name: 'inspect', requiredScopes: ['inspect'] }, execute);
            service.onModuleInit();
            const extra = { scopes: ['inspect'] };
            // act
            await registeredHandler(service)({}, extra);
            // assert
            expect(execute).toHaveBeenCalledExactlyOnceWith({}, extra);
        });

        it('uses the standard SDK authentication scopes for a protected tool', async () => {
            // arrange
            vi.useFakeTimers();
            const execute = vi.fn().mockResolvedValue({ content: [] });
            registry.registerTool({ name: 'inspect', requiredScopes: ['inspect'] }, execute);
            service.onModuleInit();
            const extra = { authInfo: { token: 'test-only-token', clientId: 'test-client', scopes: ['inspect'] } };
            // act
            await registeredHandler(service)({}, extra);
            // assert
            expect(execute).toHaveBeenCalledExactlyOnceWith({}, extra);
        });

        it.each([{ scopes: [] }, { scopes: [7] }, null, {}])(
            'does not let legacy scopes override an authoritative authentication context (%j)',
            async (authInfo) => {
                // arrange
                vi.useFakeTimers();
                const execute = vi.fn();
                registry.registerTool({ name: 'inspect', requiredScopes: ['inspect'] }, execute);
                service.onModuleInit();
                // act
                const result = registeredHandler(service)({}, { authInfo, scopes: ['inspect'] });
                // assert
                await expect(result).rejects.toMatchObject({ code: ErrorCode.InvalidRequest });
                expect(execute).not.toHaveBeenCalled();
            },
        );

        it('maps an application handler failure to the protocol error contract', async () => {
            // arrange
            vi.useFakeTimers();
            registry.registerTool({ name: 'inspect' }, vi.fn().mockRejectedValue(new Error('test-only-handler-failure')));
            service.onModuleInit();
            // act
            const result = registeredHandler(service)({}, {});
            // assert
            await expect(result).rejects.toMatchObject({ code: ErrorCode.InternalError });
        });

        it('bounds an unresponsive registered handler without retrying its effect', async () => {
            // arrange
            vi.useFakeTimers();
            const execute = vi.fn(() => new Promise<never>(() => undefined));
            registry.registerTool({ name: 'inspect' }, execute);
            service.onModuleInit();
            const result = registeredHandler(service)({}, {});
            const rejected = expect(result).rejects.toMatchObject({ code: ErrorCode.RequestTimeout });
            // act
            await vi.advanceTimersByTimeAsync(30000);
            // assert
            await rejected;
            expect(execute).toHaveBeenCalledOnce();
        });
    });

    describe('onModuleInit', () => {
        it('should initialize the MCP server with the configured name and version', () => {
            // act
            service.onModuleInit();

            // assert
            expect(service.server).toBeDefined();
            expect(service.server.registerTool).toBeDefined();
        });

        it('should not throw when there are no registered handlers', () => {
            // act & assert
            expect(() => service.onModuleInit()).not.toThrow();
        });

        it('should register tools from the registry on the MCP server', () => {
            // arrange
            registry.registerTool({ name: 'my-tool', description: 'Test tool' }, () => ({ content: [] }));

            // act
            service.onModuleInit();

            // assert
            expect(service.server.registerTool).toHaveBeenCalledWith('my-tool', expect.objectContaining({ description: 'Test tool' }), expect.any(Function));
        });

        it('should discover handlers before registering the server snapshot', () => {
            // arrange
            discovery.discoverHandlers.mockImplementation(() => {
                registry.registerTool({ name: 'discovered-tool', description: 'Discovered tool' }, () => ({
                    content: [],
                }));
            });

            // act
            service.onModuleInit();

            // assert
            expect(discovery.discoverHandlers).toHaveBeenCalledOnce();
            expect(service.server.registerTool).toHaveBeenCalledWith(
                'discovered-tool',
                expect.objectContaining({ description: 'Discovered tool' }),
                expect.any(Function),
            );
        });

        it('should register static resources from the registry on the MCP server', () => {
            // arrange
            registry.registerResource({ name: 'config', uri: 'config://app', mimeType: 'text/plain' }, () => ({
                contents: [],
            }));

            // act
            service.onModuleInit();

            // assert
            expect(service.server.registerResource).toHaveBeenCalledWith(
                'config',
                'config://app',
                expect.objectContaining({ mimeType: 'text/plain' }),
                expect.any(Function),
            );
        });

        it('should register template resources using ResourceTemplate', () => {
            // arrange
            registry.registerResource({ name: 'user-profile', uri: 'users://{userId}/profile', mimeType: 'application/json' }, () => ({ contents: [] }));

            // act
            service.onModuleInit();

            // assert
            expect(service.server.registerResource).toHaveBeenCalledWith(
                'user-profile',
                expect.objectContaining({ uri: 'users://{userId}/profile' }),
                expect.objectContaining({ mimeType: 'application/json' }),
                expect.any(Function),
            );
        });

        it('should register prompts from the registry on the MCP server', () => {
            // arrange
            registry.registerPrompt({ name: 'greet', description: 'Greeting prompt' }, () => ({ messages: [] }));

            // act
            service.onModuleInit();

            // assert
            expect(service.server.registerPrompt).toHaveBeenCalledWith(
                'greet',
                expect.objectContaining({ description: 'Greeting prompt' }),
                expect.any(Function),
            );
        });
    });

    describe('server property', () => {
        it('should throw if accessed before initialization', () => {
            // act & assert
            expect(() => service.server).toThrow('McpServer has not been initialized');
        });

        it('should return the server instance after initialization', () => {
            // arrange
            service.onModuleInit();

            // act & assert
            expect(service.server).toBeDefined();
        });
    });

    describe('connectStdio', () => {
        it('should create and connect a stdio transport', async () => {
            // arrange
            service.onModuleInit();

            // act
            const transport = await service.connectStdio();

            // assert
            expect(transport).toBeDefined();
            expect(service.server.connect).toHaveBeenCalled();
        });
    });

    describe('createStreamableHttpTransport', () => {
        it('should create and connect a Streamable HTTP transport', async () => {
            // arrange
            service.onModuleInit();

            // act
            const transport = await service.createStreamableHttpTransport();

            // assert
            expect(transport).toBeDefined();
            expect(service.server.connect).toHaveBeenCalled();
        });
    });

    describe('createSseTransport', () => {
        it('should create and connect an SSE transport', async () => {
            // arrange
            service.onModuleInit();
            const mockResponse = {} as never;

            // act
            const transport = await service.createSseTransport({ endpoint: '/sse' }, mockResponse);

            // assert
            expect(transport).toBeDefined();
            expect(service.server.connect).toHaveBeenCalled();
        });
    });

    describe('connectTransport', () => {
        it('should connect a custom transport', async () => {
            // arrange
            service.onModuleInit();
            const customTransport = { close: vi.fn().mockResolvedValue(undefined) } as never;

            // act
            await service.connectTransport(customTransport);

            // assert
            expect(service.server.connect).toHaveBeenCalledWith(customTransport);
        });
    });

    describe('onModuleDestroy', () => {
        it('should close all active transports and the server', async () => {
            // arrange
            service.onModuleInit();
            await service.connectStdio();

            // act
            await service.onModuleDestroy();

            // assert
            expect(service.server.close).toHaveBeenCalled();
        });
    });
});
