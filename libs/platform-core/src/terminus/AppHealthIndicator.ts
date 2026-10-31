// #region Imports

import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { APP_VERSION, GIT_COMMIT } from '../env.js';

// #endregion

/**
 * Health indicator for the application.
 *
 * @public
 */
@Injectable()
export class AppHealthIndicator {
    // #region Fields

    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `{@link AppHealthIndicator}` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Checks if the Open Food Facts API is reachable.
     *
     * @public
     * @returns The health indicator result.
     */
    public isHealthy(): HealthIndicatorResult<'app'> {
        const appVersion = this._configService.tryGet<string>(APP_VERSION.key, 'unknown');
        const gitCommit = this._configService.tryGet<string>(GIT_COMMIT.key, 'unknown');

        return {
            app: {
                status: 'up',
                version: appVersion,
                commit: gitCommit,
            },
        };
    }

    // #endregion
}
