/**
 * Describes the resolved configuration for the intelligence provider.
 *
 * @public
 */
export interface IIntelligenceProviderConfiguration {
    // #region Properties

    /**
     * The resolved provider identifier.
     *
     * @public
     */
    readonly provider: string;

    /**
     * The model identifier to use for text generation.
     *
     * @public
     */
    readonly model: string;

    /**
     * The API key used to authenticate with the provider.
     *
     * @public
     */
    readonly apiKey: string | null;

    /**
     * An optional base URL override for the provider API.
     *
     * @public
     */
    readonly baseUrl: string | null;

    /**
     * The sampling temperature used for text generation.
     *
     * @public
     */
    readonly temperature: number;

    /**
     * The top-p (nucleus) sampling parameter.
     *
     * @public
     */
    readonly topP: number;

    /**
     * The maximum number of output tokens per completion.
     *
     * @public
     */
    readonly maxOutputTokens: number;

    // #endregion
}
