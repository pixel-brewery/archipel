// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, PrismaHealthIndicator } from '@nestjs/terminus';
import { DatabaseService } from '../services/DatabaseService.js';

// #endregion

/**
 * Health indicator for database connectivity.
 *
 * @public
 */
@Injectable()
export class DatabaseHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _prisma: PrismaHealthIndicator;
    private readonly _databaseService: DatabaseService;

    // #endregion

    // #region Ctor

    public constructor(prismaHealthIndicator: PrismaHealthIndicator, databaseService: DatabaseService) {
        this._prisma = prismaHealthIndicator;
        this._databaseService = databaseService;
    }

    // #endregion

    //#region Properties

    public readonly key: string = 'database';

    //#endregion

    // #region Methods

    /**
     * Checks database connectivity via a Prisma ping.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): Promise<HealthIndicatorResult<'database'>> {
        return Promise.resolve(this._prisma.pingCheck('database', this._databaseService as unknown as { $queryRawUnsafe: (query: string) => unknown }));
    }

    // #endregion
}
