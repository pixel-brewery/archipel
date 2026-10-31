// #region Imports

import type { IntelligenceJsonValue } from './IntelligenceJsonValue.js';

// #endregion

/**
 * Provider-neutral conversation message.
 *
 * @public
 */
export type IIntelligenceModelMessage =
    | {
          readonly role: 'system' | 'developer' | 'user' | 'assistant';
          readonly content:
              | string
              | ReadonlyArray<
                    | { readonly type: 'tool-call'; readonly toolCallId: string; readonly toolName: string; readonly input: IntelligenceJsonValue }
                    | { readonly type: 'text'; readonly text: string }
                    | {
                          readonly type: 'image';
                          readonly image: string | URL | Uint8Array | ArrayBuffer;
                          readonly mediaType?: string;
                      }
                    | {
                          readonly type: 'file';
                          readonly data: string | URL | Uint8Array | ArrayBuffer;
                          readonly mediaType: string;
                          readonly filename?: string;
                      }
                >;
      }
    | {
          readonly role: 'tool';
          readonly content: ReadonlyArray<{
              readonly type: 'tool-result';
              readonly toolCallId: string;
              readonly toolName: string;
              readonly output: IntelligenceJsonValue;
          }>;
      };
