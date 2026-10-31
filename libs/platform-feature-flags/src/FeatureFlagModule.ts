// #region Imports

import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { type Abstract, type DynamicModule, type Provider, type Type, Module } from '@nestjs/common';
import { FeatureFlagReaderBase } from './abstracts/FeatureFlagReaderBase.js';
import { FeatureFlagWriterBase } from './abstracts/FeatureFlagWriterBase.js';
import { FeatureFlagGuard } from './guards/FeatureFlagGuard.js';
import type { IFeatureFlagModuleOptions } from './models/IFeatureFlagModuleOptions.js';

// #endregion

/**
 * NestJS module providing feature flag infrastructure.
 * Exposes a configurable feature flag reader and a route guard.
 * Optionally exposes a writer abstract base for CRUD operations when `featureFlagWriter` is provided.
 * The specific provider (Azure App Configuration, Vercel Edge Config) is selected via the options.
 *
 * @public
 */
@Module({})
export class FeatureFlagModule {
    // #region Methods

    /**
     * Configures the module with the specified options.
     *
     * @public
     * @param options - The module configuration options.
     * @returns Dynamic module definition.
     */
    public static register(options: IFeatureFlagModuleOptions): DynamicModule {
        const providers: Array<Provider> = [
            {
                provide: FeatureFlagReaderBase,
                useClass: options.featureFlagReader,
            },
            FeatureFlagGuard,
        ];

        const exports: Array<Provider | Type | Abstract<unknown>> = [FeatureFlagReaderBase, FeatureFlagGuard];

        if (options.featureFlagWriter) {
            providers.push({
                provide: FeatureFlagWriterBase,
                useClass: options.featureFlagWriter,
            });
            exports.push(FeatureFlagWriterBase);
        }

        return {
            global: options.isGlobal ?? true,
            module: FeatureFlagModule,
            imports: [ConfigModule.register('platform-feature-flags', options.configEntries ?? [])],
            providers,
            exports,
        };
    }

    // #endregion
}
