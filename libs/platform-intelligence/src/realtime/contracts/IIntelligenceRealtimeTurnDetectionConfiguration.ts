/**
 * Provider-neutral voice activity detection configuration.
 *
 * @public
 */
export interface IIntelligenceRealtimeTurnDetectionConfiguration {
    // #region Properties

    /** Voice activity detection strategy. */
    readonly type: 'server-vad' | 'semantic-vad' | 'disabled';

    /** Activation threshold between zero and one. */
    readonly threshold?: number;

    /** Silence duration that closes a turn. */
    readonly silenceDurationMs?: number;

    /** Audio retained before detected speech starts. */
    readonly prefixPaddingMs?: number;

    // #endregion
}
