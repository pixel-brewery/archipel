import type { AgentEventSinkBase } from '../abstracts/AgentEventSinkBase.js';
import type { RuntimeState } from '../runtime/RuntimeState.js';

/**
 * Explicit ownership and resource budgets for a runtime.
 *
 * @public
 */
export interface IAgentRuntimeOptions {
    /**
     * Explicit membership state; a new RuntimeState is created when omitted.
     */
    readonly state?: RuntimeState;
    /**
     * Optional consumer adapter for audit, telemetry or distributed delivery.
     */
    readonly eventSink?: AgentEventSinkBase;
    /**
     * Maximum active and paused loops retained by a runtime; defaults to 32.
     */
    readonly maxConcurrentLoops?: number;
    /**
     * Maximum pending reaction and sink jobs; defaults to 1024.
     */
    readonly maxPendingHandlers?: number;
    /**
     * Maximum wait for runtime cleanup, in milliseconds; defaults to 5000 and must not exceed 10000.
     */
    readonly shutdownTimeoutMs?: number;
}
