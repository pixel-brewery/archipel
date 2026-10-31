import { Injectable } from '@nestjs/common';
import { MeasurementSinkBase } from '../../abstracts/MeasurementSinkBase.js';

/** Explicit no-op sink for individual numeric measurements. */
@Injectable()
export class NoopMeasurementSink extends MeasurementSinkBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public record(_name: string, _value: number, _attributes: Readonly<Record<string, string>>): void {
        // Disabled by configuration.
    }

    // #endregion
}
