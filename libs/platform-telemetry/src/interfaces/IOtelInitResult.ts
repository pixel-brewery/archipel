import type { IOtelSdk } from './IOtelSdk.js';

/** The initialized SDK, or an empty result when optional telemetry is unavailable. */
export interface IOtelInitResult {
    sdk?: IOtelSdk;
}
