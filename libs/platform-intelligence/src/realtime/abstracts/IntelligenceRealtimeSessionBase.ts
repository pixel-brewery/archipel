import type { IntelligenceRealtimeClientEvent } from '../contracts/IntelligenceRealtimeClientEvent.js';
import type { IntelligenceRealtimeConnectionMode } from '../contracts/IntelligenceRealtimeConnectionMode.js';
import type { IntelligenceRealtimeStatus } from '../contracts/IntelligenceRealtimeStatus.js';

/**
 * Provider-neutral control surface for one realtime model connection.
 *
 * @public
 */
export abstract class IntelligenceRealtimeSessionBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties

    public abstract get sessionId(): string;

    public abstract get connectionId(): string;

    public abstract get provider(): string;

    public abstract get model(): string;

    public abstract get connectionMode(): Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'>;

    public abstract get status(): IntelligenceRealtimeStatus;

    // #endregion

    // #region Methods

    /** Opens the upstream provider WebSocket and applies the session configuration. */
    public abstract connect(): Promise<void>;

    /** Sends any provider-neutral client event. */
    public abstract send(event: IntelligenceRealtimeClientEvent): Promise<void>;

    /** Appends a base64-encoded audio fragment to the upstream input buffer. */
    public abstract appendAudio(audio: string): Promise<void>;

    /** Commits the provider input audio buffer. */
    public abstract commitAudio(): Promise<void>;

    /** Clears the provider input audio buffer. */
    public abstract clearAudio(): Promise<void>;

    /** Sends a text turn and optionally asks the model to respond. */
    public abstract sendText(text: string, requestResponse?: boolean): Promise<void>;

    /** Requests a new model response. */
    public abstract requestResponse(options?: {
        readonly modalities?: ReadonlyArray<string>;
        readonly instructions?: string;
        readonly metadata?: Readonly<Record<string, unknown>>;
    }): Promise<void>;

    /** Cancels the active model response. */
    public abstract cancelResponse(): Promise<void>;

    /** Returns a completed function result to the model. */
    public abstract addToolOutput(callId: string, output: unknown, name?: string): Promise<void>;

    /** Gracefully closes the upstream connection and flushes metering events. */
    public abstract close(code?: number, reason?: string): Promise<void>;

    // #endregion
}
