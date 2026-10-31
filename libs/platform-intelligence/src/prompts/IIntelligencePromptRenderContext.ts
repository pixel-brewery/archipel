/**
 * Input exposed to pure prompt rendering functions.
 *
 * @public
 */
export interface IIntelligencePromptRenderContext<TInput> {
    // #region Properties

    readonly input: Readonly<TInput>;

    // #endregion
}
