// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { MAIL_HOST, MAIL_PORT, MAIL_USER } from '../env.js';

// #endregion

/**
 * Health indicator for mail service.
 *
 * @public
 */
@Injectable()
export class MailHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `{@link MailHealthIndicator}` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        this._configService = configService;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'mail';

    // #endregion

    // #region Methods

    /**
     * Checks if the mail configuration is valid.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): HealthIndicatorResult<'mail'> {
        const mailHost = this._configService.tryGet<string>(MAIL_HOST.key, '');
        const mailUser = this._configService.tryGet<string>(MAIL_USER.key, '');
        const mailPort = this._configService.tryGet<number>(MAIL_PORT.key, 0);
        const isHealthy = mailHost !== '' && mailUser !== '' && mailPort > 0;

        return {
            mail: {
                status: isHealthy ? 'up' : 'down',
                ...(isHealthy ? {} : { message: 'Mail configuration is invalid' }),
            },
        };
    }

    // #endregion
}
