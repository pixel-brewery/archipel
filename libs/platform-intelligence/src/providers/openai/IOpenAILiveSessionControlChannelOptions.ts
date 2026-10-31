/**
 * Connection data for the sideband WebSocket of one GPT-Live session.
 *
 * @internal
 */
export interface IOpenAILiveSessionControlChannelOptions {
    // #region Properties

    /** `wss://…/live/sessions/{session_id}/attach` of the session to close. */
    readonly url: string;
    /** Server API key of the project that created the session. */
    readonly apiKey: string;
    readonly provider: string;
    readonly model: string;
    /** Ends the attempt; the channel is terminated and the pending close rejects. */
    readonly abortSignal: AbortSignal;

    // #endregion
}
