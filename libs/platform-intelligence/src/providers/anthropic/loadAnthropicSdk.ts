// #region Types

type AnthropicSdkModule = typeof import('@ai-sdk/anthropic');

// #endregion

// #region Fields

let anthropicSdkModulePromise: Promise<AnthropicSdkModule> | null = null;

// #endregion

/**
 * Lazily loads the ESM-only Anthropic AI SDK provider.
 *
 * @internal
 */
export function loadAnthropicSdk(): Promise<AnthropicSdkModule> {
    anthropicSdkModulePromise ??= import('@ai-sdk/anthropic');

    return anthropicSdkModulePromise;
}
