import { describe, expect, it } from 'vitest';
import { type ITelemetryOptions, validateTelemetryOptions } from './TelemetryOptions.js';

describe('validateTelemetryOptions', () => {
    // #region Methods

    it('should not throw for valid options', () => {
        // arrange
        const options: ITelemetryOptions = { enabled: true, serviceName: 'my-app' };

        // act & assert
        expect(() => validateTelemetryOptions(options)).not.toThrow();
    });

    it('should not throw when telemetry is disabled even with empty serviceName', () => {
        // arrange
        const options: ITelemetryOptions = { enabled: false, serviceName: '' };

        // act & assert
        expect(() => validateTelemetryOptions(options)).not.toThrow();
    });

    it('should throw when enabled and serviceName is empty', () => {
        // arrange
        const options: ITelemetryOptions = { enabled: true, serviceName: '' };

        // act & assert
        expect(() => validateTelemetryOptions(options)).toThrow('serviceName must be a non-empty string');
    });

    it('should throw when samplingRatio is negative', () => {
        // arrange
        const options: ITelemetryOptions = {
            enabled: true,
            serviceName: 'app',
            traces: { enabled: true, samplingRatio: -0.1 },
        };

        // act & assert
        expect(() => validateTelemetryOptions(options)).toThrow('samplingRatio must be between 0 and 1');
    });

    it('should throw when samplingRatio exceeds 1', () => {
        // arrange
        const options: ITelemetryOptions = {
            enabled: true,
            serviceName: 'app',
            traces: { enabled: true, samplingRatio: 1.5 },
        };

        // act & assert
        expect(() => validateTelemetryOptions(options)).toThrow('samplingRatio must be between 0 and 1');
    });

    // #endregion
});
