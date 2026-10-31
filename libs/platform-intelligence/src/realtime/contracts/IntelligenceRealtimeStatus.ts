/**
 * Describes the lifecycle state of an upstream realtime model connection.
 *
 * @public
 */
export type IntelligenceRealtimeStatus = 'idle' | 'connecting' | 'connected' | 'closing' | 'closed' | 'error';
