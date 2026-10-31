/**
 * One earlier turn of a conversation that a new browser-owned WebRTC session
 * receives as quoted, untrusted context.
 *
 * @public
 */
export interface IIntelligenceRealtimeConversationTurn {
    // #region Properties

    /** Who spoke the turn in the earlier session. */
    readonly speaker: 'user' | 'assistant';

    /**
     * Plain text of the turn, such as a final transcript sentence. It must
     * contain visible characters; line breaks inside it do not start a new turn.
     */
    readonly text: string;

    // #endregion
}
