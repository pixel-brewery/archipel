import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import { DiscoveryModule, MetadataScanner } from '@nestjs/core';
import type { IMcpModuleAsyncOptions } from '../interfaces/IMcpModuleAsyncOptions.js';
import type { IMcpModuleOptions } from '../interfaces/IMcpModuleOptions.js';
import type { IMcpModuleOptionsFactory } from '../interfaces/IMcpModuleOptionsFactory.js';
import { McpDiscoveryService } from '../services/McpDiscoveryService.js';
import { McpRegistryService } from '../services/McpRegistryService.js';
import { McpServerService } from '../services/McpServerService.js';
import { MCP_MODULE_OPTIONS } from '../tokens/McpTokens.js';

/**
 * NestJS dynamic module that bootstraps an MCP server.
 *
 * Import via `McpModule.register()` for synchronous configuration
 * or `McpModule.registerAsync()` for factory-based configuration.
 *
 * @example
 * ```typescript
 * McpModule.register({
 *     name: 'my-mcp-server',
 *     version: '1.0.0',
 * })
 * ```
 */
@Module({})
export class McpModule {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Registers the MCP module with synchronous options.
     *
     * @param options - MCP server configuration.
     * @returns A configured dynamic module.
     */
    public static register(options: IMcpModuleOptions): DynamicModule {
        const optionsProvider: Provider = {
            provide: MCP_MODULE_OPTIONS,
            useValue: options,
        };

        return {
            module: McpModule,
            imports: [DiscoveryModule],
            providers: [optionsProvider, MetadataScanner, McpRegistryService, McpDiscoveryService, McpServerService],
            exports: [McpDiscoveryService, McpRegistryService, McpServerService],
            global: true,
        };
    }

    /**
     * Registers the MCP module with asynchronous options.
     *
     * @param options - Async MCP server configuration.
     * @returns A configured dynamic module.
     */
    public static registerAsync(options: IMcpModuleAsyncOptions): DynamicModule {
        const asyncProviders = McpModule.createAsyncProviders(options);

        return {
            module: McpModule,
            imports: [...(options.imports ?? []), DiscoveryModule],
            providers: [...asyncProviders, MetadataScanner, McpRegistryService, McpDiscoveryService, McpServerService],
            exports: [McpDiscoveryService, McpRegistryService, McpServerService],
            global: true,
        };
    }

    private static createAsyncProviders(options: IMcpModuleAsyncOptions): Provider[] {
        if (options.useFactory) {
            return [
                {
                    provide: MCP_MODULE_OPTIONS,
                    useFactory: options.useFactory,
                    inject: options.inject ?? [],
                },
            ];
        }

        if (options.useExisting) {
            return [
                {
                    provide: MCP_MODULE_OPTIONS,
                    useFactory: async (factory: IMcpModuleOptionsFactory) => factory.createMcpOptions(),
                    inject: [options.useExisting],
                },
            ];
        }

        if (options.useClass) {
            return [
                {
                    provide: options.useClass,
                    useClass: options.useClass,
                },
                {
                    provide: MCP_MODULE_OPTIONS,
                    useFactory: async (factory: IMcpModuleOptionsFactory) => factory.createMcpOptions(),
                    inject: [options.useClass],
                },
            ];
        }

        return [];
    }

    // #endregion
}
