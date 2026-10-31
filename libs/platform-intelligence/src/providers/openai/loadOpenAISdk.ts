// #region Types

type OpenAISdkModule = typeof import('@ai-sdk/openai');

// #endregion

// #region Fields

let openAISdkModulePromise: Promise<OpenAISdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only OpenAI AI SDK provider.
 *
 * @internal
 */
export function loadOpenAISdk(): Promise<OpenAISdkModule> {
    openAISdkModulePromise ??= import('@ai-sdk/openai');

    return openAISdkModulePromise;
}
