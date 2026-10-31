// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TelemetryHealthIndicator } from './TelemetryHealthIndicator.js';

// #endregion

// #region Tests

describe('TelemetryHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have key "telemetry"', () => {
        // arrange
        const indicator = new TelemetryHealthIndicator();

        // act / assert
        expect(indicator.key).toBe('telemetry');
    });

    it('should return up with disabled when no sdkHolder is provided', () => {
        // arrange
        const indicator = new TelemetryHealthIndicator();

        // act
        const result = indicator.check();

        // assert
        expect(result['telemetry'].status).toBe('up');
        expect((result['telemetry'] as Record<string, unknown>).disabled).toBe(true);
    });

    it('should return up when sdkHolder is initialized', () => {
        // arrange
        const sdkHolder = { isInitialized: true } as never;
        const indicator = new TelemetryHealthIndicator(sdkHolder);

        // act
        const result = indicator.check();

        // assert
        expect(result['telemetry'].status).toBe('up');
        expect((result['telemetry'] as Record<string, unknown>).sdkInitialized).toBe(true);
    });

    it('should return down when sdkHolder is not initialized', () => {
        // arrange
        const sdkHolder = { isInitialized: false } as never;
        const indicator = new TelemetryHealthIndicator(sdkHolder);

        // act
        const result = indicator.check();

        // assert
        expect(result['telemetry'].status).toBe('down');
        expect((result['telemetry'] as Record<string, unknown>).sdkInitialized).toBe(false);
    });
});

// #endregion
