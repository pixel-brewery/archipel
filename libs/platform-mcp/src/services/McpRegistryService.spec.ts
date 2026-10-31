import { beforeEach, describe, expect, it } from 'vitest';
import type { IMcpPromptMetadata } from '../interfaces/IMcpPromptMetadata.js';
import type { IMcpResourceMetadata } from '../interfaces/IMcpResourceMetadata.js';
import type { IMcpToolMetadata } from '../interfaces/IMcpToolMetadata.js';
import { McpRegistryService } from './McpRegistryService.js';

describe('McpRegistryService', () => {
    let service: McpRegistryService;

    beforeEach(() => {
        // arrange
        service = new McpRegistryService();
    });

    describe('registerTool', () => {
        it('should register a tool and expose it via the tools map', () => {
            // arrange
            const metadata: IMcpToolMetadata = { name: 'test-tool', description: 'A test tool' };
            const handler = () => ({ content: [] });

            // act
            service.registerTool(metadata, handler);

            // assert
            expect(service.tools.size).toBe(1);
            expect(service.tools.has('test-tool')).toBe(true);
            expect(service.tools.get('test-tool')?.metadata).toBe(metadata);
            expect(service.tools.get('test-tool')?.handler).toBe(handler);
        });

        it('should overwrite an existing tool with the same name', () => {
            // arrange
            const metadata1: IMcpToolMetadata = { name: 'duplicate', description: 'First' };
            const metadata2: IMcpToolMetadata = { name: 'duplicate', description: 'Second' };
            const handler1 = () => ({ content: [] });
            const handler2 = () => ({ content: [{ type: 'text' as const, text: 'updated' }] });

            // act
            service.registerTool(metadata1, handler1);
            service.registerTool(metadata2, handler2);

            // assert
            expect(service.tools.size).toBe(1);
            expect(service.tools.get('duplicate')?.metadata.description).toBe('Second');
            expect(service.tools.get('duplicate')?.handler).toBe(handler2);
        });

        it('should register multiple distinct tools', () => {
            // arrange
            const toolA: IMcpToolMetadata = { name: 'tool-a', description: 'Tool A' };
            const toolB: IMcpToolMetadata = { name: 'tool-b', description: 'Tool B' };
            const handler = () => ({ content: [] });

            // act
            service.registerTool(toolA, handler);
            service.registerTool(toolB, handler);

            // assert
            expect(service.tools.size).toBe(2);
            expect(service.tools.has('tool-a')).toBe(true);
            expect(service.tools.has('tool-b')).toBe(true);
        });
    });

    describe('registerResource', () => {
        it('should register a resource and expose it via the resources map', () => {
            // arrange
            const metadata: IMcpResourceMetadata = { name: 'config', uri: 'config://app' };
            const handler = () => ({ contents: [] });

            // act
            service.registerResource(metadata, handler);

            // assert
            expect(service.resources.size).toBe(1);
            expect(service.resources.has('config')).toBe(true);
            expect(service.resources.get('config')?.metadata).toBe(metadata);
        });

        it('should overwrite an existing resource with the same name', () => {
            // arrange
            const metadata1: IMcpResourceMetadata = { name: 'config', uri: 'config://v1' };
            const metadata2: IMcpResourceMetadata = { name: 'config', uri: 'config://v2' };
            const handler1 = () => ({ contents: [] });
            const handler2 = () => ({ contents: [] });

            // act
            service.registerResource(metadata1, handler1);
            service.registerResource(metadata2, handler2);

            // assert
            expect(service.resources.size).toBe(1);
            expect(service.resources.get('config')?.metadata.uri).toBe('config://v2');
        });
    });

    describe('registerPrompt', () => {
        it('should register a prompt and expose it via the prompts map', () => {
            // arrange
            const metadata: IMcpPromptMetadata = { name: 'greet', description: 'A greeting prompt' };
            const handler = () => ({ messages: [] });

            // act
            service.registerPrompt(metadata, handler);

            // assert
            expect(service.prompts.size).toBe(1);
            expect(service.prompts.has('greet')).toBe(true);
            expect(service.prompts.get('greet')?.metadata).toBe(metadata);
        });

        it('should overwrite an existing prompt with the same name', () => {
            // arrange
            const metadata1: IMcpPromptMetadata = { name: 'greet', description: 'Version 1' };
            const metadata2: IMcpPromptMetadata = { name: 'greet', description: 'Version 2' };
            const handler1 = () => ({ messages: [] });
            const handler2 = () => ({ messages: [] });

            // act
            service.registerPrompt(metadata1, handler1);
            service.registerPrompt(metadata2, handler2);

            // assert
            expect(service.prompts.size).toBe(1);
            expect(service.prompts.get('greet')?.metadata.description).toBe('Version 2');
        });
    });

    describe('initial state', () => {
        it('should start with empty registries', () => {
            // assert
            expect(service.tools.size).toBe(0);
            expect(service.resources.size).toBe(0);
            expect(service.prompts.size).toBe(0);
        });
    });
});
