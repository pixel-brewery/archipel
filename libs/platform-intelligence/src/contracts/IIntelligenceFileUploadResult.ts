/**
 * Normalized provider-managed file upload result.
 *
 * @public
 */
export interface IIntelligenceFileUploadResult {
    // #region Properties

    readonly providerReference: Readonly<Record<string, string>>;
    readonly provider: string;
    readonly mediaType?: string;
    readonly filename?: string;
    readonly warnings: ReadonlyArray<string>;

    // #endregion
}
