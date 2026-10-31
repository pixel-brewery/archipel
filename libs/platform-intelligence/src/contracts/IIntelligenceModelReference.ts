/**
 * Selects a provider-owned model without exposing a provider SDK model object.
 *
 * @public
 */
export interface IIntelligenceModelReference {
    // #region Properties

    /** Provider registered with {@link IntelligenceModule}. */
    readonly provider?: string;

    /** Provider model identifier. */
    readonly model?: string;

    // #endregion
}
