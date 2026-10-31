import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import type { IMcpHandlerMetadata } from '../interfaces/IMcpHandlerMetadata.js';
import type { IMcpPromptMetadata } from '../interfaces/IMcpPromptMetadata.js';
import type { IMcpResourceMetadata } from '../interfaces/IMcpResourceMetadata.js';
import type { IMcpToolMetadata } from '../interfaces/IMcpToolMetadata.js';
import { MCP_HANDLER_METADATA_KEY } from '../tokens/McpTokens.js';
import { McpRegistryService } from './McpRegistryService.js';

/**
 * Discovers all NestJS providers that have methods decorated with
 * `@McpTool`, `@McpResource`, or `@McpPrompt` and registers them
 * in the {@link McpRegistryService}.
 */
@Injectable()
export class McpDiscoveryService implements OnModuleInit {
    // #region Fields

    private readonly _logger = new Logger(McpDiscoveryService.name);
    private readonly _discoveryService: DiscoveryService;
    private readonly _metadataScanner: MetadataScanner;
    private readonly _registry: McpRegistryService;
    private _hasDiscoveredHandlers = false;

    // #endregion

    // #region Ctor

    /**
     * Creates handler discovery over the application's registered NestJS providers.
     *
     * @param discoveryService - Inventory of instantiated application providers.
     * @param metadataScanner - NestJS metadata scanner supplied by module composition.
     * @param registry - Catalog receiving each discovered, bound handler.
     */
    public constructor(discoveryService: DiscoveryService, metadataScanner: MetadataScanner, registry: McpRegistryService) {
        this._discoveryService = discoveryService;
        this._metadataScanner = metadataScanner;
        this._registry = registry;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Called by NestJS after the module is initialized.
     * Scans all providers and registers discovered MCP handlers.
     */
    public onModuleInit(): void {
        this.discoverHandlers();
    }

    /**
     * Discovers and registers MCP handlers exactly once.
     *
     * @remarks
     * `McpServerService` invokes this method explicitly before it snapshots
     * the registry. This avoids relying on relative lifecycle-hook ordering,
     * which changed in NestJS 12.
     */
    public discoverHandlers(): void {
        if (this._hasDiscoveredHandlers) {
            return;
        }

        const providers = this._discoveryService.getProviders();

        for (const wrapper of providers) {
            const { instance } = wrapper;

            if (!instance || typeof instance !== 'object') {
                continue;
            }

            const handlers: IMcpHandlerMetadata[] | undefined = Reflect.getMetadata(MCP_HANDLER_METADATA_KEY, instance.constructor);

            if (!handlers || handlers.length === 0) {
                continue;
            }

            for (const handlerMeta of handlers) {
                const methodRef = (instance as Record<string, unknown>)[handlerMeta.methodName];

                if (typeof methodRef !== 'function') {
                    this._logger.warn(`Handler method "${handlerMeta.methodName}" not found on ${instance.constructor.name}`);
                    continue;
                }

                const boundMethod = methodRef.bind(instance) as (...args: unknown[]) => unknown;

                switch (handlerMeta.type) {
                    case 'tool':
                        this._registry.registerTool(handlerMeta.metadata as unknown as IMcpToolMetadata, boundMethod);
                        break;

                    case 'resource':
                        this._registry.registerResource(handlerMeta.metadata as unknown as IMcpResourceMetadata, boundMethod);
                        break;

                    case 'prompt':
                        this._registry.registerPrompt(handlerMeta.metadata as unknown as IMcpPromptMetadata, boundMethod);
                        break;
                }
            }
        }

        this._hasDiscoveredHandlers = true;

        this._logger.log(
            `Discovered ${this._registry.tools.size} tool(s), ` + `${this._registry.resources.size} resource(s), ` + `${this._registry.prompts.size} prompt(s)`,
        );
    }

    // #endregion
}
