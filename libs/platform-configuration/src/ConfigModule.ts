// #region Imports

import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigRegistry, IConfigRegistryEntry } from './ConfigRegistry.js';
import { ConfigService } from './services/ConfigService.js';
import { ConfigStrategyBase } from './strategies/abstracts/ConfigStrategyBase.js';

// #endregion

/**
 * The `IConfigModuleOptions` interface.
 *
 * @public
 */
export interface IConfigModuleOptions {
    strategyFactory?: (...args: Array<unknown>) => ConfigStrategyBase;
    statics?: Record<string, string>;
}

/**
 * The `ConfigModule` class.
 *
 * @public
 */
@Global()
@Module({})
export class ConfigModule {
    // #region Methods

    /**
     * Registers environment variable keys from a library module into the
     * central {@link ConfigRegistry}. Call this in each library's module
     * to declare the configuration it depends upon.
     *
     * @param module - The logical module name (e.g. `'platform-authentication'`).
     * @param entries - The configuration entries the module depends on.
     * @returns A `DynamicModule` that can be added to the module's `imports` array.
     */
    public static register(module: string, entries: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>): DynamicModule {
        ConfigRegistry.register(module, entries);

        return {
            module: ConfigModule,
        };
    }

    /**
     * Bootstraps the global configuration service. Call this once in the
     * application's root module.
     *
     * @param options - Strategy factory and optional static overrides.
     * @returns A global `DynamicModule` providing `ConfigService`.
     */
    public static forRoot(options: Partial<IConfigModuleOptions>): DynamicModule {
        if (!options.strategyFactory) {
            throw new Error('ConfigModule.forRoot() requires a strategyFactory. Provide a configuration strategy (e.g. EnvConfigStrategy).');
        }

        return {
            global: true,
            module: ConfigModule,
            providers: [
                {
                    provide: ConfigStrategyBase,
                    useFactory: options.strategyFactory,
                },
                {
                    provide: ConfigService,
                    useFactory: (strategy: ConfigStrategyBase, statics: Record<string, string>) => {
                        const service = new ConfigService(strategy, statics);
                        service.initialize();

                        return service;
                    },
                    inject: [ConfigStrategyBase, 'CONFIG_STATICS'],
                },
                {
                    provide: 'CONFIG_STATICS',
                    useValue: options.statics ?? {},
                },
            ],
            exports: [ConfigService],
        };
    }

    // #endregion
}
