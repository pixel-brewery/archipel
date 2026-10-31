/**
 * Bounded local runtime gauges for consumer observability.
 *
 * @public
 */
export interface IAgentRuntimeDiagnostics {
    /**
     * Number of participants currently registered in the runtime.
     */
    readonly participants: number;
    /**
     * Number of agent loops currently executing.
     */
    readonly activeLoops: number;
    /**
     * Number of paused loops retaining runtime capacity.
     */
    readonly pausedLoops: number;
    /**
     * Number of participant or sink jobs still awaiting settlement.
     */
    readonly pendingHandlers: number;
    /**
     * Bounded count of dispatch failures awaiting acknowledgment through drain.
     */
    readonly dispatchFailures: number;
    /**
     * Whether the runtime has begun disposing and rejects new application work.
     */
    readonly disposed: boolean;
}
