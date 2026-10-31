// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult, HttpHealthIndicator } from '@nestjs/terminus';
import { VERCEL_BLOB_URL } from '../env.js';

// #endregion

/**
 * Health indicator for blob storage service.
 *
 * @public
 */
@Injectable()
export class BlobHealthIndicator implements IHealthIndicator {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _httpHealthIndicator: HttpHealthIndicator;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `{@link BlobHealthIndicator}` class.
     *
     * @public
     */
    public constructor(configService: ConfigService, httpHealthIndicator: HttpHealthIndicator) {
        this._configService = configService;
        this._httpHealthIndicator = httpHealthIndicator;
    }

    // #endregion

    //#region Properties

    public readonly key: string = 'blob';

    //#endregion

    // #region Methods

    /**
     * Checks if the blob storage endpoint is reachable.
     *
     * @public
     * @returns The health indicator result.
     */
    public check(): Promise<HealthIndicatorResult<'blob'>> {
        const blobUrl = this._configService.tryGet<string>(VERCEL_BLOB_URL.key, '');

        return blobUrl
            ? this._httpHealthIndicator.pingCheck(this.key, blobUrl, { timeout: 2000 })
            : Promise.resolve({
                  blob: {
                      status: 'up',
                      disabled: true,
                  },
              });
    }

    // #endregion
}
