import 'reflect-metadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IMcpHandlerMetadata } from '../interfaces/IMcpHandlerMetadata.js';
import { MCP_HANDLER_METADATA_KEY } from '../tokens/McpTokens.js';
import { McpDiscoveryService } from './McpDiscoveryService.js';
import { McpRegistryService } from './McpRegistryService.js';

describe('McpDiscoveryService', () => {
    let registry: McpRegistryService;
    let discoveryServiceMock: { getProviders: ReturnType<typeof vi.fn> };
    let metadataScannerMock: Record<string, unknown>;

    beforeEach(() => {
        // arrange
        registry = new McpRegistryService();
        discoveryServiceMock = { getProviders: vi.fn().mockReturnValue([]) };
        metadataScannerMock = {};
    });

    function createDiscoveryService(): McpDiscoveryService {
        return new McpDiscoveryService(discoveryServiceMock as never, metadataScannerMock as never, registry);
    }

    it('should register discovered tool handlers from providers', () => {
        // arrange
        class FakeToolProvider {
            public myTool() {
                return { content: [{ type: 'text', text: 'result' }] };
            }
        }

        const toolMeta: IMcpHandlerMetadata = {
            type: 'tool',
            methodName: 'myTool',
            metadata: { name: 'my-tool', description: 'A tool' },
        };

        const instance = new FakeToolProvider();
        Reflect.defineMetadata(MCP_HANDLER_METADATA_KEY, [toolMeta], FakeToolProvider);
        discoveryServiceMock.getProviders.mockReturnValue([{ instance }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        expect(registry.tools.size).toBe(1);
        expect(registry.tools.has('my-tool')).toBe(true);
    });

    it('should register discovered resource handlers from providers', () => {
        // arrange
        class FakeResourceProvider {
            public readConfig() {
                return { contents: [] };
            }
        }

        const resourceMeta: IMcpHandlerMetadata = {
            type: 'resource',
            methodName: 'readConfig',
            metadata: { name: 'config', uri: 'config://app' },
        };

        const instance = new FakeResourceProvider();
        Reflect.defineMetadata(MCP_HANDLER_METADATA_KEY, [resourceMeta], FakeResourceProvider);
        discoveryServiceMock.getProviders.mockReturnValue([{ instance }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        expect(registry.resources.size).toBe(1);
        expect(registry.resources.has('config')).toBe(true);
    });

    it('should register discovered prompt handlers from providers', () => {
        // arrange
        class FakePromptProvider {
            public greet() {
                return { messages: [] };
            }
        }

        const promptMeta: IMcpHandlerMetadata = {
            type: 'prompt',
            methodName: 'greet',
            metadata: { name: 'greet', description: 'Greeting' },
        };

        const instance = new FakePromptProvider();
        Reflect.defineMetadata(MCP_HANDLER_METADATA_KEY, [promptMeta], FakePromptProvider);
        discoveryServiceMock.getProviders.mockReturnValue([{ instance }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        expect(registry.prompts.size).toBe(1);
        expect(registry.prompts.has('greet')).toBe(true);
    });

    it('should skip providers without MCP metadata', () => {
        // arrange
        class PlainProvider {
            public doSomething() {
                return;
            }
        }

        const instance = new PlainProvider();
        discoveryServiceMock.getProviders.mockReturnValue([{ instance }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        expect(registry.tools.size).toBe(0);
        expect(registry.resources.size).toBe(0);
        expect(registry.prompts.size).toBe(0);
    });

    it('should skip providers with null instance', () => {
        // arrange
        discoveryServiceMock.getProviders.mockReturnValue([{ instance: null }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        expect(registry.tools.size).toBe(0);
    });

    it('should bind handler methods to the provider instance', () => {
        // arrange
        class StatefulProvider {
            public value = 42;

            public getTool() {
                return { content: [{ type: 'text', text: String(this.value) }] };
            }
        }

        const toolMeta: IMcpHandlerMetadata = {
            type: 'tool',
            methodName: 'getTool',
            metadata: { name: 'stateful-tool', description: 'Returns instance state' },
        };

        const instance = new StatefulProvider();
        Reflect.defineMetadata(MCP_HANDLER_METADATA_KEY, [toolMeta], StatefulProvider);
        discoveryServiceMock.getProviders.mockReturnValue([{ instance }]);

        const service = createDiscoveryService();

        // act
        service.onModuleInit();

        // assert
        const registeredHandler = registry.tools.get('stateful-tool')?.handler;
        expect(registeredHandler).toBeDefined();

        const result = registeredHandler!() as { content: Array<{ text: string }> };
        expect(result.content[0].text).toBe('42');
    });

    it('should scan providers only once when lifecycle initialization is repeated', () => {
        // arrange
        const service = createDiscoveryService();

        // act
        service.onModuleInit();
        service.discoverHandlers();

        // assert
        expect(discoveryServiceMock.getProviders).toHaveBeenCalledOnce();
    });
});
