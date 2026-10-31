// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IPrismaServiceOptions, PrismaService } from './PrismaService.js';
import { IRepositoryDatabase } from '../types/IRepositoryDatabase.js';

// #endregion

/**
 * Represents the database service.
 *
 * @public
 */
@Injectable()
export class DatabaseService extends PrismaService implements IRepositoryDatabase {
    // #region Ctor

    /**
     * Constructs a new instance of the `DatabaseService` class.
     *
     * @public
     */
    public constructor(configService: ConfigService, options?: IPrismaServiceOptions) {
        super(configService, options);
    }

    // #endregion

    // #region Methods

    /**
     * Creates a new transaction.
     *
     * @public
     * @param arg - The argument.
     * @param options - The options.
     * @returns Returns the result of the transaction.
     */
    public transaction<P extends Array<Prisma.PrismaPromise<unknown>>>(
        arg: [...P],
        options?: Parameters<PrismaService['$transaction']>[1],
    ): ReturnType<PrismaService['$transaction']> {
        return (
            super['$transaction'] as unknown as (
                arg: [...P],
                options?: Parameters<PrismaService['$transaction']>[1],
            ) => ReturnType<PrismaService['$transaction']>
        )(arg, options);
    }

    /**
     * Executes a transactional callback (extended overload missing in base typing wrapper).
     */
    public transactionCallback<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>, options?: Parameters<PrismaService['$transaction']>[1]): Promise<T> {
        return (
            super['$transaction'] as unknown as (
                fn: (tx: Prisma.TransactionClient) => Promise<T>,
                options?: Parameters<PrismaService['$transaction']>[1],
            ) => Promise<T>
        )(fn, options);
    }

    // #endregion
}
