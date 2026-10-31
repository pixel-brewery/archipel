// #region Imports

import type { IntelligenceProviderOptions } from './IntelligenceProviderOptions.js';

// #endregion

/**
 * Provider-neutral live transcription event.
 *
 * @public
 */
export type IntelligenceTranscriptionStreamPart =
    | {
          readonly type: 'transcript-delta';
          readonly id?: string;
          readonly delta: string;
          readonly providerMetadata?: IntelligenceProviderOptions;
      }
    | {
          readonly type: 'transcript-partial';
          readonly id?: string;
          readonly text: string;
          readonly startSecond?: number;
          readonly durationInSeconds?: number;
          readonly channelIndex?: number;
          readonly providerMetadata?: IntelligenceProviderOptions;
      }
    | {
          readonly type: 'transcript-final';
          readonly id?: string;
          readonly text: string;
          readonly startSecond?: number;
          readonly endSecond?: number;
          readonly channelIndex?: number;
          readonly providerMetadata?: IntelligenceProviderOptions;
      }
    | {
          readonly type: 'raw';
          readonly rawValue: unknown;
      }
    | {
          readonly type: 'error';
          readonly error: unknown;
      };
