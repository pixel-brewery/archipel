/**
 * Normalized provider-managed skill upload result.
 *
 * @public
 */
export interface IIntelligenceSkillUploadResult {
    // #region Properties

    readonly providerReference: Readonly<Record<string, string>>;
    readonly provider: string;
    readonly displayTitle?: string;
    readonly name?: string;
    readonly description?: string;
    readonly latestVersion?: string;
    readonly warnings: ReadonlyArray<string>;

    // #endregion
}
