/**
 * Safe resolved model status that never includes credentials.
 *
 * @public
 */
export interface IIntelligenceModelStatus {
    // #region Properties

    readonly provider: string;
    readonly model: string;

    // #endregion
}
