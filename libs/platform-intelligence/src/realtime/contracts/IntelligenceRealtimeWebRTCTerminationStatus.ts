/**
 * Outcome of ending a browser-owned WebRTC realtime session from the server.
 *
 * - `terminated`: the provider accepted the request and ends the session.
 * - `already-ended`: the provider no longer knows the session because it has
 *   already ended, expired, or never existed. No provider session remains.
 * - `unsupported`: the provider cannot end sessions from the server. The
 *   provider session can keep running until the browser closes its peer
 *   connection or the provider expires the session, so fail-closed
 *   applications must not treat this outcome as a completed termination.
 *
 * @public
 */
export type IntelligenceRealtimeWebRTCTerminationStatus = 'terminated' | 'already-ended' | 'unsupported';
