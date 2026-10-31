// #region Imports

import { ConfigModule, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, Module, type Type } from '@nestjs/common';
import { AnalyticsClientBase } from './abstracts/AnalyticsClientBase.js';

// #endregion

// #region Interfaces

/**
 * Configuration options for the `AnalyticsModule`.
 *
 * @public
 */
export interface IAnalyticsModuleOptions {
    /**
     * Concrete implementation of the {@link AnalyticsClientBase}.
     * For example, `SentryAnalyticsClient`, `AppInsightsAnalyticsClient`, `DatadogAnalyticsClient`, or `NoopAnalyticsClient`.
     */
    analyticsClient: Type<AnalyticsClientBase>;

    /**
     * Provider-specific configuration entries to register with the config module.
     */
    configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * When `true` the module is registered globally.
     */
    isGlobal?: boolean;
}

// #endregion

/**
 * NestJS module providing generic analytics and error tracking infrastructure.
 * The specific analytics provider (Sentry, Application Insights, Datadog) is selected via the options.
 *
 * @public
 */
@Module({})
export class AnalyticsModule {
    // #region Methods

    /**
     * Configures the module with the specified options.
     *
     * @public
     * @param options - The module configuration options.
     * @returns Dynamic module definition.
     */
    public static register(options: IAnalyticsModuleOptions): DynamicModule {
        const providers = [
            {
                provide: AnalyticsClientBase,
                useClass: options.analyticsClient,
            },
        ];

        return {
            global: options.isGlobal ?? false,
            module: AnalyticsModule,
            imports: [ConfigModule.register('platform-analytics', options.configEntries ?? [])],
            providers: providers,
            exports: [AnalyticsClientBase],
        };
    }

    // #endregion
}
