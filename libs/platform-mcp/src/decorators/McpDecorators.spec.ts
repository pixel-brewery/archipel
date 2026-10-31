import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import type { IMcpHandlerMetadata } from '../interfaces/IMcpHandlerMetadata.js';
import { MCP_HANDLER_METADATA_KEY } from '../tokens/McpTokens.js';
import { McpPrompt } from './McpPrompt.js';
import { McpResource } from './McpResource.js';
import { McpTool } from './McpTool.js';

const getMethodDescriptor = (target: object, propertyKey: string): PropertyDescriptor => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (!descriptor) {
        throw new Error(`Missing method descriptor for ${propertyKey}`);
    }

    return descriptor;
};

describe('MCP Decorators', () => {
    describe('McpTool', () => {
        it('should store tool metadata on the class constructor', () => {
            // arrange & act
            class TestProvider {
                public myTool() {
                    return { content: [] };
                }
            }
            McpTool({ name: 'my-tool', description: 'Test tool' })(TestProvider.prototype, 'myTool', getMethodDescriptor(TestProvider.prototype, 'myTool'));

            // assert
            const handlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, TestProvider);
            expect(handlers).toBeDefined();
            expect(handlers).toHaveLength(1);
            expect(handlers[0].type).toBe('tool');
            expect(handlers[0].methodName).toBe('myTool');
            expect((handlers[0].metadata as Record<string, unknown>)['name']).toBe('my-tool');
        });

        it('should accumulate multiple tool decorators on the same class', () => {
            // arrange & act
            class MultiToolProvider {
                public toolA() {
                    return { content: [] };
                }

                public toolB() {
                    return { content: [] };
                }
            }
            McpTool({ name: 'tool-a', description: 'A' })(MultiToolProvider.prototype, 'toolA', getMethodDescriptor(MultiToolProvider.prototype, 'toolA'));
            McpTool({ name: 'tool-b', description: 'B' })(MultiToolProvider.prototype, 'toolB', getMethodDescriptor(MultiToolProvider.prototype, 'toolB'));

            // assert
            const handlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, MultiToolProvider);
            expect(handlers).toHaveLength(2);
            expect(handlers.map((h) => h.methodName)).toContain('toolA');
            expect(handlers.map((h) => h.methodName)).toContain('toolB');
        });
    });

    describe('McpResource', () => {
        it('should store resource metadata on the class constructor', () => {
            // arrange & act
            class TestProvider {
                public readConfig() {
                    return { contents: [] };
                }
            }
            McpResource({ name: 'config', uri: 'config://app', mimeType: 'application/json' })(
                TestProvider.prototype,
                'readConfig',
                getMethodDescriptor(TestProvider.prototype, 'readConfig'),
            );

            // assert
            const handlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, TestProvider);
            expect(handlers).toBeDefined();
            expect(handlers).toHaveLength(1);
            expect(handlers[0].type).toBe('resource');
            expect(handlers[0].methodName).toBe('readConfig');
            expect((handlers[0].metadata as Record<string, unknown>)['uri']).toBe('config://app');
        });
    });

    describe('McpPrompt', () => {
        it('should store prompt metadata on the class constructor', () => {
            // arrange & act
            class TestProvider {
                public greet() {
                    return { messages: [] };
                }
            }
            McpPrompt({ name: 'greet', description: 'Greeting prompt' })(TestProvider.prototype, 'greet', getMethodDescriptor(TestProvider.prototype, 'greet'));

            // assert
            const handlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, TestProvider);
            expect(handlers).toBeDefined();
            expect(handlers).toHaveLength(1);
            expect(handlers[0].type).toBe('prompt');
            expect(handlers[0].methodName).toBe('greet');
            expect((handlers[0].metadata as Record<string, unknown>)['name']).toBe('greet');
        });
    });

    describe('mixed decorators', () => {
        it('should accumulate tool, resource, and prompt decorators on the same class', () => {
            // arrange & act
            class MixedProvider {
                public calculate() {
                    return { content: [] };
                }

                public getStatus() {
                    return { contents: [] };
                }

                public review() {
                    return { messages: [] };
                }
            }
            McpTool({ name: 'calc', description: 'Calculator' })(
                MixedProvider.prototype,
                'calculate',
                getMethodDescriptor(MixedProvider.prototype, 'calculate'),
            );
            McpResource({ name: 'status', uri: 'status://health' })(
                MixedProvider.prototype,
                'getStatus',
                getMethodDescriptor(MixedProvider.prototype, 'getStatus'),
            );
            McpPrompt({ name: 'review', description: 'Code review' })(
                MixedProvider.prototype,
                'review',
                getMethodDescriptor(MixedProvider.prototype, 'review'),
            );

            // assert
            const handlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, MixedProvider);
            expect(handlers).toHaveLength(3);

            const types = handlers.map((h) => h.type);
            expect(types).toContain('tool');
            expect(types).toContain('resource');
            expect(types).toContain('prompt');
        });
    });
});
