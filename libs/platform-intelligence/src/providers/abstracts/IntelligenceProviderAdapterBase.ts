import type { IntelligenceCapability } from '../../contracts/IntelligenceCapability.js';
import type { IIntelligenceProviderProbeResult } from '../../contracts/IIntelligenceProviderProbeResult.js';
import type { IIntelligenceRealtimeSessionConfiguration } from '../../realtime/contracts/IIntelligenceRealtimeSessionConfiguration.js';
import type { IntelligenceRealtimeWebRTCTerminationStatus } from '../../realtime/contracts/IntelligenceRealtimeWebRTCTerminationStatus.js';
import type { IIntelligenceProviderLoadRequest } from '../IIntelligenceProviderLoadRequest.js';
import type { IIntelligenceProviderWebRTCClosure } from '../IIntelligenceProviderWebRTCClosure.js';
import type { IIntelligenceProviderWebRTCConversationHistoryRequest } from '../IIntelligenceProviderWebRTCConversationHistoryRequest.js';
import type { IIntelligenceProviderWebRTCTerminationRequest } from '../IIntelligenceProviderWebRTCTerminationRequest.js';

/**
 * Abstract Base implemented by every intelligence provider adapter.
 *
 * Provider implementations are registered as NestJS classes through
 * `IntelligenceModule.register()`. This keeps construction, dependency
 * injection, and lifecycle ownership inside the module instead of consumer
 * composition code.
 *
 * @public
 */
export abstract class IntelligenceProviderAdapterBase {
    // #region Fields

    public abstract readonly provider: string;

    public abstract readonly capabilities: ReadonlyArray<IntelligenceCapability>;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public abstract load(request: IIntelligenceProviderLoadRequest): Promise<unknown>;

    /**
     * Performs an optional, lightweight remote readiness probe.
     *
     * Adapters without a provider-supported probe can omit this method. The
     * diagnostics facade then reports degraded local readiness after model
     * materialization. Operational calls remain isolated behind Archipel's
     * timeout, retry, and domain-error boundary, so a circuit-breaker
     * decorator can be introduced without changing capability facades.
     *
     * @public
     */
    public probe?(request: IIntelligenceProviderLoadRequest): Promise<IIntelligenceProviderProbeResult>;

    /**
     * Adds earlier conversation turns to the setup of a browser-owned WebRTC
     * realtime session and returns the session configuration to send.
     *
     * Implementing this method declares that the provider can receive earlier
     * turns during WebRTC setup. Implementations quote all turns in one
     * untrusted context block, never as instructions, system content, or the
     * model's own statements, through a provider mechanism that does not make
     * the model respond. The rendered history of any validated request must
     * fit the provider's own limits. Implementations resolve `null` without a
     * provider request when the request's model API cannot receive earlier
     * turns; the realtime session factory then reports `unsupported`.
     * Adapters without this capability omit the method.
     *
     * @public
     */
    public applyWebRTCConversationHistory?(
        request: IIntelligenceProviderWebRTCConversationHistoryRequest,
    ): Promise<IIntelligenceRealtimeSessionConfiguration | null>;

    /**
     * Ends a browser-owned WebRTC realtime session at the provider with the
     * server credentials of the request configuration.
     *
     * Implementing this method declares that the provider exposes a
     * server-side termination API. Adapters without one omit it, and the
     * realtime session factory then reports `unsupported` without a provider
     * request instead of silently succeeding. Implementations make exactly
     * one provider request, honour `abortSignal`, resolve `already-ended` when
     * the provider reports the session as unknown or ended, resolve
     * `unsupported` for models whose API cannot end sessions, and throw
     * `IntelligenceProviderError` with `isRetryable` for any other failure.
     * The factory owns retries and the total time budget.
     *
     * @public
     */
    public terminateWebRTCSession?(request: IIntelligenceProviderWebRTCTerminationRequest): Promise<IntelligenceRealtimeWebRTCTerminationStatus>;

    /**
     * Ends a browser-owned WebRTC realtime session through the provider's
     * server control channel and returns the final usage the provider
     * reports while closing it.
     *
     * Implement this method only for providers that report a session's final
     * billable usage exclusively on such a channel, and only together with
     * `terminateWebRTCSession`. The realtime session factory calls it first,
     * within a share of its termination budget, and falls back to
     * `terminateWebRTCSession` when it resolves `null` for a model whose API
     * has no control channel, throws, or runs out of time. Implementations
     * honour `abortSignal`, resolve `already-ended` when the provider no
     * longer knows the session, and never propagate provider error text.
     *
     * @public
     */
    public closeWebRTCSession?(request: IIntelligenceProviderWebRTCTerminationRequest): Promise<IIntelligenceProviderWebRTCClosure | null>;

    // #endregion
}
