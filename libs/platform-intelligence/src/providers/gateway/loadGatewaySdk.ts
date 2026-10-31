// #region Types

type GatewaySdkModule = typeof import('@ai-sdk/gateway');

// #endregion

// #region Fields

let gatewaySdkModulePromise: Promise<GatewaySdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only Vercel AI Gateway provider.
 *
 * @internal
 */
export function loadGatewaySdk(): Promise<GatewaySdkModule> {
    gatewaySdkModulePromise ??= import('@ai-sdk/gateway');

    return gatewaySdkModulePromise;
}
