// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseService } from './services/DatabaseService.js';
import { PrismaService } from './services/PrismaService.js';

// #endregion

/**
 * Represents the database module configuration.
 *
 * @public
 */
export interface IDatabaseModuleConfig {
    /**
     * A Prisma driver adapter instance (e.g. `PrismaPg`, `PrismaLibSQL`).
     * Required for Prisma 7+ with the new `prisma-client` generator.
     */
    adapter?: unknown;
    /** Future extension point for Prisma middlewares */
    middlewares?: Array<unknown>;
}

/**
 * Represents the database module.
 *
 * @public
 */
export const DATABASE_MODULE_CONFIG = 'DATABASE_MODULE_CONFIG';

@Module({
    providers: [
        {
            provide: DATABASE_MODULE_CONFIG,
            useValue: {} as IDatabaseModuleConfig,
        },
        {
            provide: PrismaService,
            useFactory: (configService: ConfigService, moduleConfig: IDatabaseModuleConfig) =>
                new PrismaService(configService, { adapter: moduleConfig.adapter }),
            inject: [ConfigService, DATABASE_MODULE_CONFIG],
        },
        {
            provide: DatabaseService,
            useFactory: (configService: ConfigService, moduleConfig: IDatabaseModuleConfig) =>
                new DatabaseService(configService, { adapter: moduleConfig.adapter }),
            inject: [ConfigService, DATABASE_MODULE_CONFIG],
        },
    ],
    exports: [DatabaseService, PrismaService],
})
export class DatabaseModule {
    // #region Methods

    /**
     * Builds the provider array for dynamic module registration.
     *
     * @param config - The database module configuration
     * @returns An array of providers for PrismaService and DatabaseService
     *
     * @private
     */
    private static buildProviders(config: IDatabaseModuleConfig): DynamicModule['providers'] {
        return [
            {
                provide: DATABASE_MODULE_CONFIG,
                useValue: config,
            },
            {
                provide: PrismaService,
                useFactory: (configService: ConfigService) => new PrismaService(configService, { adapter: config.adapter }),
                inject: [ConfigService],
            },
            {
                provide: DatabaseService,
                useFactory: (configService: ConfigService) => new DatabaseService(configService, { adapter: config.adapter }),
                inject: [ConfigService],
            },
        ];
    }

    /**
     * Registers the `DatabaseModule` globally with the provided configuration.
     *
     * Use this method when you need to configure a Prisma adapter (e.g. `PrismaPg`)
     * for Prisma 7+ compatibility.
     *
     * @param config - The database module configuration including the adapter
     * @returns A `DynamicModule` that can be imported globally
     *
     * @example
     * ```typescript
     * import { PrismaPg } from '@prisma/adapter-pg';
     *
     * DatabaseModule.forRoot({
     *   adapter: new PrismaPg(connectionUrl),
     * })
     * ```
     *
     * @public
     */
    public static forRoot(config?: IDatabaseModuleConfig): DynamicModule {
        return {
            global: true,
            module: DatabaseModule,
            providers: DatabaseModule.buildProviders(config ?? {}),
            exports: [DatabaseService, PrismaService],
        };
    }

    /**
     * Registers the `DatabaseModule` with the provided configuration.
     *
     * Use this method for non-global registration with a Prisma adapter.
     *
     * @param config - The database module configuration including the adapter
     * @returns A `DynamicModule` that can be imported
     *
     * @public
     */
    public static register(config?: IDatabaseModuleConfig): DynamicModule {
        return {
            module: DatabaseModule,
            providers: DatabaseModule.buildProviders(config ?? {}),
            exports: [DatabaseService, PrismaService],
        };
    }

    // #endregion
}
