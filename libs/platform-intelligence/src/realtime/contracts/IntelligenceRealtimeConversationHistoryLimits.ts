/**
 * Provider-neutral bounds of the conversation history that a new
 * browser-owned WebRTC session can receive.
 *
 * A history within these bounds fits the limits of every provider that
 * supports the handover, including the quoting that Archipel adds. Select the
 * most recent turns that fit: Archipel rejects a larger history with an
 * `IntelligenceValidationError` instead of shortening it.
 *
 * - `maxTurns`: most turns in one handover.
 * - `maxTextBytes`: most UTF-8 bytes of all turn texts combined.
 *
 * @public
 */
export const IntelligenceRealtimeConversationHistoryLimits = {
    maxTurns: 32,
    maxTextBytes: 6_144,
} as const;
