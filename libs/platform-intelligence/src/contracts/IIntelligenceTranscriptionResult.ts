/**
 * Provider-neutral transcription result.
 *
 * @public
 */
export interface IIntelligenceTranscriptionResult {
    // #region Properties

    readonly text: string;
    readonly segments: ReadonlyArray<{
        readonly text: string;
        readonly startSecond: number;
        readonly endSecond: number;
    }>;
    readonly language?: string;
    readonly durationInSeconds?: number;
    readonly provider: string;
    readonly model: string;
    readonly warnings: ReadonlyArray<string>;

    // #endregion
}
