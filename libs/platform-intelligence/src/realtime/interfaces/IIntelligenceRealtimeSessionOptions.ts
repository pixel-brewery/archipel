// #region Imports

import type { IIntelligenceRealtimeCloseEvent } from '../contracts/IIntelligenceRealtimeCloseEvent.js';
import type { IIntelligenceRealtimeSessionConfiguration } from '../contracts/IIntelligenceRealtimeSessionConfiguration.js';
import type { IntelligenceRealtimeConnectionMode } from '../contracts/IntelligenceRealtimeConnectionMode.js';
import type { IntelligenceRealtimeMetadataValue } from '../contracts/IntelligenceRealtimeMetadataValue.js';
import type { IntelligenceRealtimeServerEvent } from '../contracts/IntelligenceRealtimeServerEvent.js';

// #endregion

/**
 * Options used to create one server-owned WebSocket realtime connection.
 *
 * @public
 */
export interface IIntelligenceRealtimeSessionOptions {
    // #region Properties

    /** Correlation identifier included in structured Archipel logs. */
    readonly requestId?: string;

    /** Application-owned identifier used for persistence, billing, and audit correlation. */
    readonly sessionId: string;

    /** Realtime model identifier such as `gpt-realtime`. */
    readonly model: string;

    /** Optional provider override. Defaults to the configured intelligence provider. */
    readonly provider?: string;

    /** Connection mode. `auto` selects a supported server WebSocket first, then the legacy client-secret WebSocket. */
    readonly connectionMode?: Exclude<IntelligenceRealtimeConnectionMode, 'webrtc'> | 'auto';

    /** Provider-neutral realtime session configuration. */
    readonly sessionConfiguration?: IIntelligenceRealtimeSessionConfiguration;

    /** Optional allow-list of registered Archipel tools exposed to this session. */
    readonly activeToolNames?: ReadonlyArray<string>;

    /** Bounded, non-sensitive correlation metadata copied to metering events. */
    readonly metadata?: Readonly<Record<string, IntelligenceRealtimeMetadataValue>>;

    /** Receives normalized provider events in wire order. */
    readonly onEvent?: (event: IntelligenceRealtimeServerEvent) => void | Promise<void>;

    /** Receives transport, provider, parsing, and metering adapter failures. */
    readonly onError?: (error: Error) => void | Promise<void>;

    /** Receives the terminal upstream connection state. */
    readonly onClose?: (event: IIntelligenceRealtimeCloseEvent) => void | Promise<void>;

    // #endregion
}
