/**
 * Application context made available to prompt policy adapters.
 *
 * @public
 */
export interface IIntelligencePromptExecutionContext {
    // #region Properties

    readonly metadata?: Readonly<Record<string, unknown>>;

    // #endregion
}
