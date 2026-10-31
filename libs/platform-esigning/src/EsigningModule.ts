// #region Imports

import { ConfigModule, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, type InjectionToken, Module, type ModuleMetadata, type OptionalFactoryDependency, type Provider, type Type } from '@nestjs/common';
import { EsigningClientBase } from './abstracts/EsigningClientBase.js';
import { EsigningPersistenceBase } from './abstracts/EsigningPersistenceBase.js';
import { EsigningService } from './services/EsigningService.js';

// #endregion

// #region Interfaces

/**
 * Configuration options for the {@link EsigningModule}.
 *
 * @public
 */
export interface IEsigningModuleOptions {
    /**
     * Concrete implementation of the {@link EsigningClientBase}.
     * For example, `InternalEsigningProvider`, `DocuSignClient`, `AdobeSignClient`, etc.
     */
    provider: Type<EsigningClientBase>;

    /**
     * Provider-specific configuration entries to register with the config module.
     */
    configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * Concrete implementation of the {@link EsigningPersistenceBase}.
     * Required when the application needs to persist signing request state.
     */
    persistence?: Type<EsigningPersistenceBase>;

    /**
     * When `true` the module is registered globally.
     */
    isGlobal?: boolean;
}

/**
 * Async configuration options for the {@link EsigningModule}.
 *
 * @public
 */
export interface IEsigningModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /**
     * Injection tokens to make available to the factory.
     */
    inject?: Array<InjectionToken | OptionalFactoryDependency>;

    /**
     * Factory function that returns module options (or a promise).
     */
    useFactory?: (...args: Array<unknown>) => IEsigningModuleOptions | Promise<IEsigningModuleOptions>;

    /**
     * Existing provider that implements {@link IEsigningModuleOptionsFactory}.
     */
    useExisting?: Type<IEsigningModuleOptionsFactory>;

    /**
     * Class to instantiate as factory.
     */
    useClass?: Type<IEsigningModuleOptionsFactory>;

    /**
     * When `true` the module is registered globally.
     */
    isGlobal?: boolean;
}

/**
 * Factory interface for creating e-signing module options asynchronously.
 *
 * @public
 */
export interface IEsigningModuleOptionsFactory {
    /**
     * Creates the module options.
     *
     * @returns The module configuration options or a promise resolving to them.
     */
    createEsigningOptions(): IEsigningModuleOptions | Promise<IEsigningModuleOptions>;
}

// #endregion

/**
 * NestJS module providing generic e-signing infrastructure.
 * Exposes a configurable signing client and optional persistence tracking.
 * The specific e-signing provider is selected via the options.
 *
 * @public
 */
@Module({})
export class EsigningModule {
    // #region Methods

    /**
     * Configures the module with the specified options.
     *
     * @public
     * @param options - The module configuration options.
     * @returns Dynamic module definition.
     */
    public static register(options: IEsigningModuleOptions): DynamicModule {
        const providers = [
            {
                provide: EsigningClientBase,
                useClass: options.provider,
            },
            EsigningService,
            ...(options.persistence
                ? [
                      {
                          provide: EsigningPersistenceBase,
                          useClass: options.persistence,
                      },
                  ]
                : []),
        ];

        return {
            global: options.isGlobal ?? false,
            module: EsigningModule,
            imports: [ConfigModule.register('platform-esigning', options.configEntries ?? [])],
            providers: providers,
            exports: [EsigningClientBase, EsigningService],
        };
    }

    /**
     * Configures the module asynchronously with factory-based options.
     * Use this when the provider type or configuration entries need to be resolved
     * at runtime (e.g., from environment or a config service).
     *
     * @public
     * @param options - The async module configuration options.
     * @returns Dynamic module definition.
     */
    public static registerAsync(options: IEsigningModuleAsyncOptions): DynamicModule {
        const asyncProviders = EsigningModule.createAsyncProviders(options);

        return {
            global: options.isGlobal ?? false,
            module: EsigningModule,
            imports: [...(options.imports ?? [])],
            providers: [...asyncProviders, EsigningService],
            exports: [EsigningClientBase, EsigningService],
        };
    }

    private static createAsyncProviders(options: IEsigningModuleAsyncOptions): Array<Provider> {
        if (options.useFactory) {
            const factory = options.useFactory;

            return [
                {
                    provide: EsigningClientBase,
                    useFactory: async (...args: Array<unknown>) => {
                        const moduleOptions = await factory(...args);

                        return EsigningModule.createProviderInstance(moduleOptions);
                    },
                    inject: options.inject ?? [],
                },
            ];
        }

        if (options.useExisting) {
            return [
                {
                    provide: EsigningClientBase,
                    useFactory: async (factory: IEsigningModuleOptionsFactory) => {
                        const moduleOptions = await factory.createEsigningOptions();

                        return EsigningModule.createProviderInstance(moduleOptions);
                    },
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
                    provide: EsigningClientBase,
                    useFactory: async (factory: IEsigningModuleOptionsFactory) => {
                        const moduleOptions = await factory.createEsigningOptions();

                        return EsigningModule.createProviderInstance(moduleOptions);
                    },
                    inject: [options.useClass],
                },
            ];
        }

        return [];
    }

    private static createProviderInstance(options: IEsigningModuleOptions): EsigningClientBase {
        return new options.provider();
    }

    // #endregion
}
