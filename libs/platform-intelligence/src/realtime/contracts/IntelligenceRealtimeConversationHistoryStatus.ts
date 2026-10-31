/**
 * Outcome of handing earlier conversation turns to a new browser-owned WebRTC
 * session.
 *
 * - `handed-over`: the provider received the turns as quoted context with the
 *   session setup.
 * - `unsupported`: the provider or the model's API cannot receive earlier turns
 *   during WebRTC setup. The session started without them, so its model does
 *   not know the earlier conversation.
 *
 * @public
 */
export type IntelligenceRealtimeConversationHistoryStatus = 'handed-over' | 'unsupported';
