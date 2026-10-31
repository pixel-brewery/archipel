/**
 * Provider-neutral audio format configuration.
 *
 * @public
 */
export interface IIntelligenceRealtimeAudioFormat {
    // #region Properties

    /** MIME-style audio format identifier such as `audio/pcm`. */
    readonly type: string;

    /** Sample rate in Hertz when the format requires one. */
    readonly rate?: number;

    // #endregion
}
