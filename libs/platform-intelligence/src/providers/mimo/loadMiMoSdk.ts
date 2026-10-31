// #region Types

type MiMoSdkModule = typeof import('@ai-sdk/openai-compatible');

// #endregion

// #region Fields

let miMoSdkModulePromise: Promise<MiMoSdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only OpenAI-compatible AI SDK provider used by MiMo.
 *
 * @internal
 */
export function loadMiMoSdk(): Promise<MiMoSdkModule> {
    miMoSdkModulePromise ??= import('@ai-sdk/openai-compatible');

    return miMoSdkModulePromise;
}
