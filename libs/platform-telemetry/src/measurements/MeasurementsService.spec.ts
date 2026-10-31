import { describe, expect, it, vi } from 'vitest';
import type { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';
import { MeasurementsService } from './MeasurementsService.js';

describe('MeasurementsService', () => {
    it('forwards a finite observation unchanged to the selected sink', () => {
        const record = vi.fn();
        const service = new MeasurementsService({ record } as unknown as MeasurementSinkBase);

        service.record('query.duration_ms', 37, { table: 'orders' });

        expect(record).toHaveBeenCalledWith('query.duration_ms', 37, { table: 'orders' });
    });

    it('keeps invalid values and sink failures out of the application operation', () => {
        const record = vi.fn(() => {
            throw new Error('sink unavailable');
        });
        const service = new MeasurementsService({ record } as unknown as MeasurementSinkBase);

        expect(() => service.record('query.duration_ms', Number.NaN)).not.toThrow();
        expect(() => service.record('query.duration_ms', 37)).not.toThrow();
        expect(record).toHaveBeenCalledTimes(1);
    });
});
