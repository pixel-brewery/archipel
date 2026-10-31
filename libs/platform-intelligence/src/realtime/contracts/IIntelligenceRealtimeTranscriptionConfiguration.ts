/**
 * Provider-neutral transcription configuration.
 *
 * @public
 */
export interface IIntelligenceRealtimeTranscriptionConfiguration {
    // #region Properties

    /** Provider-specific transcription model. */
    readonly model?: string;

    /** Optional BCP 47 language hint. */
    readonly language?: string;

    /** Optional prompt used to guide the transcription. */
    readonly prompt?: string;

    // #endregion
}
