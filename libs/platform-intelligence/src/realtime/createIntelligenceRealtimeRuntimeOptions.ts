// #region Imports

import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import type { IIntelligenceRealtimeModuleOptions } from './interfaces/IIntelligenceRealtimeModuleOptions.js';
import type { IIntelligenceRealtimeRuntimeOptions } from './contracts/IIntelligenceRealtimeRuntimeOptions.js';

// #endregion

// #region Constants

const MAX_EXTERNAL_TIMEOUT_MS = 5_000;

// #endregion

/**
 * Normalizes and bounds realtime resource limits.
 *
 * @internal
 */
export function createIntelligenceRealtimeRuntimeOptions(options: IIntelligenceRealtimeModuleOptions | undefined): IIntelligenceRealtimeRuntimeOptions {
    const runtimeOptions = {
        maxActiveSessions: options?.maxActiveSessions ?? 1_000,
        maxPendingEvents: options?.maxPendingEvents ?? 512,
        maxBufferedBytes: options?.maxBufferedBytes ?? 4 * 1024 * 1024,
        connectionTimeoutMs: Math.min(options?.connectionTimeoutMs ?? MAX_EXTERNAL_TIMEOUT_MS, MAX_EXTERNAL_TIMEOUT_MS),
        closeTimeoutMs: Math.min(options?.closeTimeoutMs ?? MAX_EXTERNAL_TIMEOUT_MS, MAX_EXTERNAL_TIMEOUT_MS),
        meteringIntervalMs: options?.meteringIntervalMs ?? 30_000,
        tokenRequestMaxRetries: Math.min(options?.tokenRequestMaxRetries ?? 2, 2),
        terminationMaxRetries: Math.min(options?.terminationMaxRetries ?? 2, 2),
    } satisfies IIntelligenceRealtimeRuntimeOptions;

    validatePositiveInteger('maxActiveSessions', runtimeOptions.maxActiveSessions);
    validatePositiveInteger('maxPendingEvents', runtimeOptions.maxPendingEvents);
    validatePositiveInteger('maxBufferedBytes', runtimeOptions.maxBufferedBytes);
    validatePositiveInteger('connectionTimeoutMs', runtimeOptions.connectionTimeoutMs);
    validatePositiveInteger('closeTimeoutMs', runtimeOptions.closeTimeoutMs);
    validatePositiveInteger('meteringIntervalMs', runtimeOptions.meteringIntervalMs);
    validateNonNegativeInteger('tokenRequestMaxRetries', runtimeOptions.tokenRequestMaxRetries);
    validateNonNegativeInteger('terminationMaxRetries', runtimeOptions.terminationMaxRetries);

    return runtimeOptions;
}

function validatePositiveInteger(name: string, value: number): void {
    if (!Number.isInteger(value) || value < 1) {
        throw new IntelligenceValidationError(`${name} must be a positive integer.`);
    }
}

function validateNonNegativeInteger(name: string, value: number): void {
    if (!Number.isInteger(value) || value < 0) {
        throw new IntelligenceValidationError(`${name} must be a non-negative integer.`);
    }
}
