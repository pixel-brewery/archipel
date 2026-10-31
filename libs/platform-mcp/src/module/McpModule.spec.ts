import { describe, expect, it } from 'vitest';
import type { IMcpModuleOptions } from '../interfaces/IMcpModuleOptions.js';
import type { IMcpModuleOptionsFactory } from '../interfaces/IMcpModuleOptionsFactory.js';
import { McpDiscoveryService } from '../services/McpDiscoveryService.js';
import { McpRegistryService } from '../services/McpRegistryService.js';
import { McpServerService } from '../services/McpServerService.js';
import { MCP_MODULE_OPTIONS } from '../tokens/McpTokens.js';
import { McpModule } from './McpModule.js';

describe('McpModule', () => {
    describe('register', () => {
        it('should return a dynamic module with the provided options as a value provider', () => {
            // arrange
            const options: IMcpModuleOptions = { name: 'test-server', version: '1.0.0' };

            // act
            const dynamicModule = McpModule.register(options);

            // assert
            expect(dynamicModule.module).toBe(McpModule);
            expect(dynamicModule.global).toBe(true);

            const optionsProvider = dynamicModule.providers?.find((p) => typeof p === 'object' && 'provide' in p && p.provide === MCP_MODULE_OPTIONS);

            expect(optionsProvider).toBeDefined();
            expect((optionsProvider as { useValue: IMcpModuleOptions }).useValue).toBe(options);
        });

        it('should export discovery, registry, and server services', () => {
            // arrange
            const options: IMcpModuleOptions = { name: 'test', version: '0.0.1' };

            // act
            const dynamicModule = McpModule.register(options);

            // assert
            expect(dynamicModule.exports).toContain(McpDiscoveryService);
            expect(dynamicModule.exports).toContain(McpRegistryService);
            expect(dynamicModule.exports).toContain(McpServerService);
        });

        it('should include McpDiscoveryService in providers', () => {
            // arrange
            const options: IMcpModuleOptions = { name: 'test', version: '0.0.1' };

            // act
            const dynamicModule = McpModule.register(options);

            // assert
            expect(dynamicModule.providers).toContain(McpDiscoveryService);
        });
    });

    describe('registerAsync', () => {
        it('should return a dynamic module when using useFactory', () => {
            // arrange & act
            const dynamicModule = McpModule.registerAsync({
                useFactory: () => ({ name: 'async-server', version: '2.0.0' }),
            });

            // assert
            expect(dynamicModule.module).toBe(McpModule);
            expect(dynamicModule.global).toBe(true);

            const optionsProvider = dynamicModule.providers?.find((p) => typeof p === 'object' && 'provide' in p && p.provide === MCP_MODULE_OPTIONS);

            expect(optionsProvider).toBeDefined();
            expect((optionsProvider as { useFactory: () => IMcpModuleOptions }).useFactory).toBeDefined();
        });

        it('should export discovery, registry, and server services', () => {
            // arrange & act
            const dynamicModule = McpModule.registerAsync({
                useFactory: () => ({ name: 'async-server', version: '2.0.0' }),
            });

            // assert
            expect(dynamicModule.exports).toContain(McpDiscoveryService);
            expect(dynamicModule.exports).toContain(McpRegistryService);
            expect(dynamicModule.exports).toContain(McpServerService);
        });

        it('should support useExisting for factory-based configuration', () => {
            // arrange
            class ExistingFactory implements IMcpModuleOptionsFactory {
                public createMcpOptions(): IMcpModuleOptions {
                    return { name: 'existing', version: '1.0.0' };
                }
            }

            // act
            const dynamicModule = McpModule.registerAsync({
                useExisting: ExistingFactory,
            });

            // assert
            const optionsProvider = dynamicModule.providers?.find((p) => typeof p === 'object' && 'provide' in p && p.provide === MCP_MODULE_OPTIONS);

            expect(optionsProvider).toBeDefined();
            expect((optionsProvider as { inject: unknown[] }).inject).toContain(ExistingFactory);
        });

        it('should support useClass for class-based configuration', () => {
            // arrange
            class McpConfigService implements IMcpModuleOptionsFactory {
                public createMcpOptions(): IMcpModuleOptions {
                    return { name: 'class-based', version: '3.0.0' };
                }
            }

            // act
            const dynamicModule = McpModule.registerAsync({
                useClass: McpConfigService,
            });

            // assert
            const classProvider = dynamicModule.providers?.find((p) => typeof p === 'object' && 'provide' in p && p.provide === McpConfigService);

            expect(classProvider).toBeDefined();

            const optionsProvider = dynamicModule.providers?.find((p) => typeof p === 'object' && 'provide' in p && p.provide === MCP_MODULE_OPTIONS);

            expect(optionsProvider).toBeDefined();
            expect((optionsProvider as { inject: unknown[] }).inject).toContain(McpConfigService);
        });

        it('should forward additional imports to the dynamic module', () => {
            // arrange
            class SomeExternalModule {}

            // act
            const dynamicModule = McpModule.registerAsync({
                imports: [SomeExternalModule as never],
                useFactory: () => ({ name: 'imported', version: '1.0.0' }),
            });

            // assert
            expect(dynamicModule.imports).toContain(SomeExternalModule);
        });

        it('should return an empty providers array when no strategy is specified', () => {
            // act
            const dynamicModule = McpModule.registerAsync({});

            // assert
            expect(dynamicModule.providers).toBeDefined();
            expect(dynamicModule.exports).toContain(McpRegistryService);
        });
    });
});
