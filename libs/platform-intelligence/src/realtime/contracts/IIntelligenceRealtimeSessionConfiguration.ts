// #region Imports

import type { IIntelligenceRealtimeAudioFormat } from './IIntelligenceRealtimeAudioFormat.js';
import type { IIntelligenceRealtimeToolDefinition } from './IIntelligenceRealtimeToolDefinition.js';
import type { IIntelligenceRealtimeTranscriptionConfiguration } from './IIntelligenceRealtimeTranscriptionConfiguration.js';
import type { IIntelligenceRealtimeTurnDetectionConfiguration } from './IIntelligenceRealtimeTurnDetectionConfiguration.js';

// #endregion

/**
 * Provider-neutral configuration for a realtime AI session.
 *
 * This contract intentionally mirrors the stable Archipel surface instead of
 * exposing the AI SDK's experimental realtime types to applications.
 *
 * @public
 */
export interface IIntelligenceRealtimeSessionConfiguration {
    // #region Properties

    /** System instructions for the model. */
    readonly instructions?: string;

    /** Provider voice identifier for spoken model output. */
    readonly voice?: string;

    /** Modalities the model may produce. */
    readonly outputModalities?: ReadonlyArray<'text' | 'audio'>;

    /** Input audio format. */
    readonly inputAudioFormat?: IIntelligenceRealtimeAudioFormat;

    /** Optional input transcription settings. */
    readonly inputAudioTranscription?: IIntelligenceRealtimeTranscriptionConfiguration;

    /** Optional spoken-output transcription settings. */
    readonly outputAudioTranscription?: IIntelligenceRealtimeTranscriptionConfiguration;

    /** Output audio format. */
    readonly outputAudioFormat?: IIntelligenceRealtimeAudioFormat;

    /** Voice activity detection settings, or `null` for push-to-talk. */
    readonly turnDetection?: IIntelligenceRealtimeTurnDetectionConfiguration | null;

    /** Explicit tool definitions. Registered Archipel tools are used when omitted. */
    readonly tools?: ReadonlyArray<IIntelligenceRealtimeToolDefinition>;

    /** Provider-specific escape hatch retained inside the Archipel boundary. */
    readonly providerOptions?: Readonly<Record<string, unknown>>;

    // #endregion
}
