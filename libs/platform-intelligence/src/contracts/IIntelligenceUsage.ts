/**
 * Provider-neutral usage counters.
 *
 * Null values mean that a provider did not report the dimension. Consumers
 * must not interpret missing counters as zero usage.
 *
 * @public
 */
export interface IIntelligenceUsage {
    // #region Properties

    /** All uncached and cached input tokens reported for the operation. */
    readonly inputTokens: number | null;
    /** All output tokens, including any reasoning tokens, reported for the operation. */
    readonly outputTokens: number | null;
    /** Provider-reported total input and output tokens. */
    readonly totalTokens: number | null;
    /** Input tokens read from a provider cache. */
    readonly cachedInputTokens: number | null;
    /** Input tokens written to a provider cache. */
    readonly cacheWriteInputTokens: number | null;
    /** Cached input tokens attributed to text. */
    readonly cachedInputTextTokens: number | null;
    /** Cached input tokens attributed to images. */
    readonly cachedInputImageTokens: number | null;
    /** Cached input tokens attributed to audio. */
    readonly cachedInputAudioTokens: number | null;
    /** Input tokens attributed to text. */
    readonly inputTextTokens: number | null;
    /** Input tokens attributed to images. */
    readonly inputImageTokens: number | null;
    /** Input tokens attributed to audio. */
    readonly inputAudioTokens: number | null;
    /** Output tokens attributed to text, including reasoning when the provider does so. */
    readonly outputTextTokens: number | null;
    /** Output tokens attributed to generated images. */
    readonly outputImageTokens: number | null;
    /** Output tokens attributed to generated audio. */
    readonly outputAudioTokens: number | null;
    /** Reasoning tokens included in the provider's output total. */
    readonly reasoningTokens: number | null;

    // #endregion
}
