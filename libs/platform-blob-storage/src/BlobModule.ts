// #region Imports

import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { HttpModule } from '@nestjs/axios';
import { Module, type DynamicModule, type Provider, type Type } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BlobObjectPersistenceBase } from './abstracts/BlobObjectPersistenceBase.js';
import { BlobVariantPersistenceBase } from './abstracts/BlobVariantPersistenceBase.js';
import { PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES } from './env.js';
import { BlobService } from './services/BlobService.js';
import type { BlobStorageStrategyBase } from './strategies/abstracts/BlobStorageStrategyBase.js';
import { BLOB_STORAGE_STRATEGY_TOKEN } from './tokens/BlobStorageTokens.js';

// #endregion

// #region Interfaces

export interface IBlobModuleOptions {
    readonly storageStrategy: Type<BlobStorageStrategyBase>;
    readonly isGlobal?: boolean;
    readonly configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;
    readonly objectPersistence?: Type<BlobObjectPersistenceBase>;
    readonly variantPersistence?: Type<BlobVariantPersistenceBase>;
}

// #endregion

/**
 * NestJS module responsible for providing blob storage services.
 * Uses a strategy pattern to support pluggable storage backends.
 *
 * @example
 * ```typescript
 * import { BlobModule } from '@pixel-brewery/archipel-platform-blob-storage';
 * import { VercelBlobStorageStrategy, VERCEL_CONFIG_ENTRIES } from '@pixel-brewery/archipel-platform-blob-storage/strategies/vercel';
 *
 * BlobModule.register({
 *   storageStrategy: VercelBlobStorageStrategy,
 *   configEntries: VERCEL_CONFIG_ENTRIES,
 * });
 * ```
 *
 * @public
 */
@Module({})
export class BlobModule {
    // #region Methods

    /**
     * Configures the module with the specified storage strategy.
     *
     * @public
     * @param options - The module configuration options.
     * @returns Dynamic module definition.
     */
    public static register(options: IBlobModuleOptions): DynamicModule {
        const isGlobal = options.isGlobal ?? true;
        const configEntries = options.configEntries ?? PLATFORM_BLOB_STORAGE_CONFIG_ENTRIES;

        const providers: Array<Provider> = [{ provide: BLOB_STORAGE_STRATEGY_TOKEN, useClass: options.storageStrategy }, BlobService];

        if (options.objectPersistence) {
            providers.push({
                provide: BlobObjectPersistenceBase,
                useClass: options.objectPersistence,
            });
        }

        if (options.variantPersistence) {
            providers.push({
                provide: BlobVariantPersistenceBase,
                useClass: options.variantPersistence,
            });
        }

        return {
            module: BlobModule,
            global: isGlobal,
            imports: [ConfigModule.register('platform-blob-storage', configEntries), HttpModule, MulterModule.register({ dest: './uploads' })],
            providers,
            exports: [BlobService],
        };
    }

    // #endregion
}
