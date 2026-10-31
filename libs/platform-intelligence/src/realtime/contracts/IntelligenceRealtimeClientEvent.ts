// #region Imports

import type { IIntelligenceRealtimeSessionConfiguration } from './IIntelligenceRealtimeSessionConfiguration.js';

// #endregion

/**
 * Provider-neutral event sent from an application to a realtime model.
 *
 * @public
 */
export type IntelligenceRealtimeClientEvent =
    | {
          readonly type: 'session-update';
          readonly config: IIntelligenceRealtimeSessionConfiguration;
      }
    | {
          readonly type: 'session-start';
          readonly config: IIntelligenceRealtimeSessionConfiguration;
      }
    | { readonly type: 'session-close' }
    | { readonly type: 'input-audio-mute' }
    | { readonly type: 'input-audio-unmute' }
    | {
          readonly type: 'context-append';
          readonly content: string;
          readonly delegationId: string | null;
          readonly providerOptions?: Readonly<Record<string, unknown>>;
      }
    | {
          readonly type: 'input-audio-append';
          readonly audio: string;
      }
    | {
          readonly type: 'input-audio-commit';
      }
    | {
          readonly type: 'input-audio-clear';
      }
    | {
          readonly type: 'conversation-item-create';
          readonly item:
              | { readonly type: 'text-message'; readonly role: 'user'; readonly text: string }
              | { readonly type: 'audio-message'; readonly role: 'user'; readonly audio: string }
              | { readonly type: 'function-call-output'; readonly callId: string; readonly name?: string; readonly output: string };
      }
    | {
          readonly type: 'conversation-item-truncate';
          readonly itemId: string;
          readonly contentIndex: number;
          readonly audioEndMs: number;
      }
    | {
          readonly type: 'response-create';
          readonly options?: {
              readonly modalities?: ReadonlyArray<string>;
              readonly instructions?: string;
              readonly metadata?: Readonly<Record<string, unknown>>;
          };
      }
    | {
          readonly type: 'response-cancel';
      };
