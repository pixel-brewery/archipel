// #region Types

type GrokSdkModule = typeof import('@ai-sdk/xai');

// #endregion

// #region Fields

let grokSdkModulePromise: Promise<GrokSdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only xAI/Grok AI SDK provider.
 *
 * @internal
 */
export function loadGrokSdk(): Promise<GrokSdkModule> {
    grokSdkModulePromise ??= import('@ai-sdk/xai');

    return grokSdkModulePromise;
}
