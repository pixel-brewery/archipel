// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { TELEMETRY_ENABLED, TELEMETRY_FACADE, TELEMETRY_OPTIONS } from './TelemetryTokens.js';

// #endregion

// #region Tests

describe('TelemetryTokens', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should export TELEMETRY_OPTIONS as a Symbol', () => {
        // arrange / act / assert
        expect(typeof TELEMETRY_OPTIONS).toBe('symbol');
    });

    it('should export TELEMETRY_FACADE as a Symbol', () => {
        // arrange / act / assert
        expect(typeof TELEMETRY_FACADE).toBe('symbol');
    });

    it('should export TELEMETRY_ENABLED as a Symbol', () => {
        // arrange / act / assert
        expect(typeof TELEMETRY_ENABLED).toBe('symbol');
    });

    it('should have distinct token values', () => {
        // arrange / act / assert
        expect(TELEMETRY_OPTIONS).not.toBe(TELEMETRY_FACADE);
        expect(TELEMETRY_OPTIONS).not.toBe(TELEMETRY_ENABLED);
        expect(TELEMETRY_FACADE).not.toBe(TELEMETRY_ENABLED);
    });
});

// #endregion
