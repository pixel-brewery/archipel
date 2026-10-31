/**
 * Provider-neutral event emitted by a realtime model.
 *
 * The original provider event remains available through `raw` for audited
 * provider-specific diagnostics without leaking provider contracts into the
 * normal application flow.
 *
 * @public
 */
export type IntelligenceRealtimeServerEvent =
    | { readonly type: 'session-started'; readonly sessionId: string; readonly delegationMode?: 'client' | 'provider'; readonly raw: unknown }
    | {
          readonly type: 'session-closed';
          readonly sessionId?: string;
          readonly usage: { readonly seconds: number };
          readonly reason: string;
          readonly raw: unknown;
      }
    | { readonly type: 'session-usage'; readonly usage: { readonly seconds: number }; readonly contextWindowUsageRatio?: number; readonly raw: unknown }
    | { readonly type: 'audio-chunk'; readonly delta: string; readonly raw: unknown }
    | {
          readonly type: 'transcript-fragment';
          readonly speaker: 'user' | 'assistant';
          readonly delta: string;
          readonly startMs: number;
          readonly endMs: number;
          readonly raw: unknown;
      }
    | {
          readonly type: 'delegation-created';
          readonly delegationId: string;
          readonly target?: 'client' | 'provider';
          readonly offsetMs?: number;
          readonly responseId?: string;
          readonly raw: unknown;
      }
    | { readonly type: 'command-acknowledged'; readonly command: string; readonly clientEventId?: string; readonly raw: unknown }
    | { readonly type: 'session-created'; readonly sessionId?: string; readonly raw: unknown }
    | { readonly type: 'session-updated'; readonly raw: unknown }
    | { readonly type: 'speech-started'; readonly itemId?: string; readonly raw: unknown }
    | { readonly type: 'speech-stopped'; readonly itemId?: string; readonly raw: unknown }
    | { readonly type: 'audio-committed'; readonly itemId?: string; readonly previousItemId?: string; readonly raw: unknown }
    | { readonly type: 'conversation-item-added'; readonly itemId: string; readonly item: unknown; readonly raw: unknown }
    | { readonly type: 'input-transcription-completed'; readonly itemId: string; readonly transcript: string; readonly raw: unknown }
    | { readonly type: 'response-created'; readonly responseId: string; readonly raw: unknown }
    | { readonly type: 'response-done'; readonly responseId: string; readonly status: string; readonly raw: unknown }
    | { readonly type: 'output-item-added'; readonly responseId: string; readonly itemId: string; readonly raw: unknown }
    | { readonly type: 'output-item-done'; readonly responseId: string; readonly itemId: string; readonly raw: unknown }
    | { readonly type: 'content-part-added'; readonly responseId: string; readonly itemId: string; readonly raw: unknown }
    | { readonly type: 'content-part-done'; readonly responseId: string; readonly itemId: string; readonly raw: unknown }
    | { readonly type: 'audio-delta'; readonly responseId: string; readonly itemId: string; readonly delta: string; readonly raw: unknown }
    | { readonly type: 'audio-done'; readonly responseId: string; readonly itemId: string; readonly raw: unknown }
    | { readonly type: 'audio-transcript-delta'; readonly responseId: string; readonly itemId: string; readonly delta: string; readonly raw: unknown }
    | {
          readonly type: 'audio-transcript-done';
          readonly responseId: string;
          readonly itemId: string;
          readonly transcript?: string;
          readonly raw: unknown;
      }
    | { readonly type: 'text-delta'; readonly responseId: string; readonly itemId: string; readonly delta: string; readonly raw: unknown }
    | { readonly type: 'text-done'; readonly responseId: string; readonly itemId: string; readonly text?: string; readonly raw: unknown }
    | {
          readonly type: 'function-call-arguments-delta';
          readonly responseId: string;
          readonly itemId: string;
          readonly callId: string;
          readonly delta: string;
          readonly raw: unknown;
      }
    | {
          readonly type: 'function-call-arguments-done';
          readonly responseId: string;
          readonly itemId: string;
          readonly callId: string;
          readonly name: string;
          readonly arguments: string;
          readonly raw: unknown;
      }
    | { readonly type: 'error'; readonly message: string; readonly code?: string; readonly raw: unknown }
    | { readonly type: 'custom'; readonly rawType: string; readonly raw: unknown };
