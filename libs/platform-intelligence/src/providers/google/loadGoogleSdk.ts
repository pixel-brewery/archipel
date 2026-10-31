// #region Types

type GoogleSdkModule = typeof import('@ai-sdk/google');

// #endregion

// #region Fields

let googleSdkModulePromise: Promise<GoogleSdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only Google AI SDK provider.
 *
 * @internal
 */
export function loadGoogleSdk(): Promise<GoogleSdkModule> {
    googleSdkModulePromise ??= import('@ai-sdk/google');

    return googleSdkModulePromise;
}
