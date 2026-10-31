import { SetMetadata } from '@nestjs/common';
import type { IMcpHandlerMetadata } from '../interfaces/IMcpHandlerMetadata.js';
import type { IMcpPromptMetadata } from '../interfaces/IMcpPromptMetadata.js';
import { MCP_HANDLER_METADATA_KEY } from '../tokens/McpTokens.js';

/**
 * Marks a method as an MCP prompt handler.
 *
 * The decorated method will be discovered at module initialization and registered
 * with the MCP server. The method receives the parsed prompt arguments and
 * should return an `MCP GetPromptResult`.
 *
 * @param options - Prompt registration metadata.
 */
export function McpPrompt(options: IMcpPromptMetadata): MethodDecorator {
    return (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const existingHandlers: IMcpHandlerMetadata[] = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, target.constructor) ?? [];

        const handler: IMcpHandlerMetadata = {
            type: 'prompt',
            methodName: String(propertyKey),
            metadata: options as unknown as Record<string, unknown>,
        };

        Reflect.defineMetadata(MCP_HANDLER_METADATA_KEY, [...existingHandlers, handler], target.constructor);

        SetMetadata(MCP_HANDLER_METADATA_KEY, handler)(target, propertyKey, descriptor);

        return descriptor;
    };
}
