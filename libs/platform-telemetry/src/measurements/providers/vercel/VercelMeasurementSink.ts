import { Injectable } from '@nestjs/common';
import { metric } from '@vercel/functions';
import { createHash } from 'node:crypto';
import { MeasurementSinkBase } from '../../abstracts/MeasurementSinkBase.js';

/** Sends each observation to Vercel Custom Metrics for the current Function invocation. */
@Injectable()
export class VercelMeasurementSink extends MeasurementSinkBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public record(name: string, value: number, attributes: Readonly<Record<string, string>>): void {
        if (!Number.isFinite(value) || !name || Buffer.byteLength(name) >= 64 || Object.keys(attributes).length > 50) {
            throw new Error(`Invalid Vercel custom metric: ${name}`);
        }
        if (Object.entries(attributes).some(([key, entry]) => !key || !entry || Buffer.byteLength(key) >= 64)) {
            throw new Error(`Invalid Vercel custom metric attribute: ${name}`);
        }

        const tags = Object.fromEntries(Object.entries(attributes).map(([key, entry]) => [key, this.normalizeValue(entry)]));
        metric(name, value, tags);
    }

    private normalizeValue(value: string): string {
        const safe = value.replace(/[^a-zA-Z0-9_./-]/g, '_');
        if (safe.length < 64) return safe;
        const suffix = createHash('sha256').update(value).digest('hex').slice(0, 12);
        return `${safe.slice(0, 48)}_${suffix}`;
    }

    // #endregion
}
