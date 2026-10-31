// #region Imports

import { Injectable } from '@nestjs/common';
import type { IntelligenceRealtimeMeteringEvent } from '../contracts/IntelligenceRealtimeMeteringEvent.js';
import { IntelligenceRealtimeMeteringBase } from '../abstracts/IntelligenceRealtimeMeteringBase.js';

// #endregion

/**
 * Default metering adapter used when an application has not registered billing persistence.
 *
 * @internal
 */
@Injectable()
export class NoopIntelligenceRealtimeMeteringAdapter extends IntelligenceRealtimeMeteringBase {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public override async report(_event: IntelligenceRealtimeMeteringEvent): Promise<void> {
        await Promise.resolve();
    }

    // #endregion
}
