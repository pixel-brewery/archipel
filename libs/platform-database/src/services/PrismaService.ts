// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DB_AUTO_CONNECTION } from '../configKeys.js';

// #endregion

/**
 * Represents the options for the PrismaService.
 *
 * @public
 */
export interface IPrismaServiceOptions {
    /**
     * A Prisma driver adapter instance (e.g. `PrismaPg`, `PrismaLibSQL`).
     * Required for Prisma 7+ with the new `prisma-client` generator.
     */
    adapter?: unknown;
}

/**
 * Represents the prisma service.
 *
 * @public
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    // #region Fields

    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `PrismaService` class.
     *
     * @public
     */
    public constructor(configService: ConfigService, options?: IPrismaServiceOptions) {
        super({
            ...(options?.adapter ? { adapter: options.adapter as never } : {}),
        });

        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * @public
     */
    public async onModuleInit(): Promise<void> {
        if (this.isConnectionDisabled()) {
            return;
        }

        await (this as unknown as PrismaClient).$connect();
    }

    /**
     * @public
     */
    public async onModuleDestroy(): Promise<void> {
        if (this.isConnectionDisabled()) {
            return;
        }

        await Promise.race([
            (this as unknown as PrismaClient).$disconnect(),
            new Promise<void>((_, reject) => setTimeout(() => reject(new Error('PrismaService shutdown timeout after 5000ms')), 5000)),
        ]);
    }

    private isConnectionDisabled(): boolean {
        return this._configService.tryGet<boolean>(DB_AUTO_CONNECTION.key, true);
    }

    // #endregion
}
