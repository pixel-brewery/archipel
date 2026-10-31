import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';
import type { IAgentRuntimeDiagnostics } from '../interfaces/IAgentRuntimeDiagnostics.js';
import type { IAgentRuntimeOptions } from '../interfaces/IAgentRuntimeOptions.js';
import type { IAgentRunOptions } from '../interfaces/IAgentRunOptions.js';
import type { IAgentRunResult } from '../interfaces/IAgentRunResult.js';
import type { ParticipantBase } from '../abstracts/ParticipantBase.js';
import { Agent } from '../participants/Agent.js';
import { AgentEvent } from '../events/AgentEvent.js';
import { AgentEventDispatcher } from '../events/AgentEventDispatcher.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import { RuntimeState } from './RuntimeState.js';
import { AgentLoop } from './AgentLoop.js';
import { withAgentAbort } from './withAgentAbort.js';

/**
 * Owns participant membership and coordinates isolated agent runs for one application scope.
 *
 * @public
 */
export class AgentRuntime {
    // #region Fields
    /**
     * Participant membership owned by this runtime.
     */
    public readonly state: RuntimeState;
    private readonly _inference: AgentInferenceBase;
    private readonly _onDispose?: () => void;
    private readonly _dispatcher: AgentEventDispatcher;
    private readonly _maxLoops: number;
    private readonly _shutdownTimeoutMs: number;
    private _loops: ReadonlyMap<string, AgentLoop> = new Map();
    private _executions: ReadonlySet<Promise<IAgentRunResult>> = new Set();
    private _running: ReadonlySet<string> = new Set();
    private _disposed = false;
    private _disposePromise?: Promise<void>;
    // #endregion

    // #region Ctor
    /**
     * Creates an application-owned runtime with bounded execution and event dispatch.
     *
     * @param inference - Provider-neutral adapter used for every model step.
     * @param options - Membership, event sink and resource budgets for this runtime.
     * @param onDispose - Lifecycle callback invoked once after runtime cleanup, including failed cleanup.
     * @throws {AgentRuntimeError} When capacities are not positive safe integers or shutdown exceeds ten seconds.
     */
    public constructor(inference: AgentInferenceBase, options: IAgentRuntimeOptions = {}, onDispose?: () => void) {
        this._inference = inference;
        this._onDispose = onDispose;
        this.state = options.state ?? new RuntimeState();
        this._maxLoops = options.maxConcurrentLoops ?? 32;
        const maxHandlers: number = options.maxPendingHandlers ?? 1024;
        this._shutdownTimeoutMs = options.shutdownTimeoutMs ?? 5000;
        if (
            ![this._maxLoops, maxHandlers, this._shutdownTimeoutMs].every((value) => Number.isSafeInteger(value) && value > 0) ||
            this._shutdownTimeoutMs > 10000
        ) {
            throw new AgentRuntimeError('INVALID_RUNTIME_OPTIONS', 'Runtime capacities must be positive integers and shutdown must not exceed ten seconds.');
        }
        this._dispatcher = new AgentEventDispatcher(this.state, maxHandlers, this._shutdownTimeoutMs, options.eventSink);
    }
    // #endregion

    // #region Properties
    /**
     * Captures collection sizes and lifecycle state for consumer metrics.
     *
     * @returns Current local gauges; no mutable runtime collections are exposed.
     */
    public get diagnostics(): IAgentRuntimeDiagnostics {
        return {
            participants: this.state.getParticipants().length,
            activeLoops: this._running.size,
            pausedLoops: this._loops.size - this._running.size,
            pendingHandlers: this._dispatcher.pendingHandlers,
            dispatchFailures: this._dispatcher.dispatchFailures,
            disposed: this._disposed,
        };
    }
    // #endregion

    // #region Methods
    /**
     * Registers a participant; duplicate joins are idempotent and emit no duplicate event.
     *
     * @param participant - Participant to register in this runtime.
     * @throws {AgentRuntimeError} When the runtime is disposed, participant capacity is exhausted or event publication
     * overflows.
     */
    public join(participant: ParticipantBase): void {
        this.assertOpen();
        if (this.state.addParticipant(participant)) {
            this._dispatcher.publish(new AgentEvent('participant.joined', participant.id, participant.getManifest()));
        }
    }
    /**
     * Removes membership and cancels that participant's active or paused runs.
     *
     * @param id - Stable identity to resolve or remove from the owning registry.
     * @throws {AgentRuntimeError} When the participant is absent or the runtime has been disposed.
     */
    public leave(id: string): void {
        this.assertOpen();
        const participant = this.state.getParticipant(id);
        if (!participant) {
            throw new AgentRuntimeError('PARTICIPANT_NOT_FOUND', 'Participant is not registered.');
        }
        this.state.removeParticipant(id);
        for (const [loopId, loop] of this._loops) {
            if (loop.agentId === id) {
                this.cancelLoop(loopId);
            }
        }
        this._dispatcher.publish(new AgentEvent('participant.left', id, participant.getManifest()));
    }
    /**
     * Resolves a currently registered participant.
     *
     * @param id - Stable identity to resolve or remove from the owning registry.
     * @returns The currently registered participant for the supplied identity.
     * @throws {AgentRuntimeError} When the identity is absent or the runtime has been disposed.
     */
    public getParticipant(id: string): ParticipantBase {
        this.assertOpen();
        const participant = this.state.getParticipant(id);
        if (!participant) {
            throw new AgentRuntimeError('PARTICIPANT_NOT_FOUND', 'Participant is not registered.');
        }
        return participant;
    }
    /**
     * Publishes a message from a registered participant. Handlers decide who reacts.
     *
     * @param message - Message that triggers this run or participant reaction.
     * @param senderId - Registered participant producing the message.
     * @throws {AgentRuntimeError} When the sender is unregistered, the runtime is disposed or the event queue is full.
     */
    public sendMessage(message: string, senderId: string): void {
        this.getParticipant(senderId);
        this._dispatcher.publish(new AgentEvent('message.sent', senderId, { message }));
    }
    /**
     * Publishes a custom event after verifying its sender identity.
     *
     * @param event - Semantic event to publish or evaluate.
     * @throws {AgentRuntimeError} When the producer is unregistered, the runtime is disposed or the event queue is
     * full.
     */
    public sendEvent(event: AgentEvent): void {
        this.getParticipant(event.producerId);
        this._dispatcher.publish(event);
    }
    /**
     * Runs one bounded loop; concurrent calls fork memory and carry independent loop identifiers.
     *
     * @param agentId - Registered AI participant that owns the run.
     * @param message - Message that triggers this run or participant reaction.
     * @param options - Explicit owner configuration and operation budgets.
     * @returns The completed, paused or stopped run and its isolated conversation snapshot.
     * @throws {AgentRuntimeError} When identity, policy, capacity, cancellation or a selected execution boundary
     * prevents completion.
     */
    public async runLoop(agentId: string, message: string, options: IAgentRunOptions = {}): Promise<IAgentRunResult> {
        const participant = this.getParticipant(agentId);
        if (!(participant instanceof Agent)) {
            throw new AgentRuntimeError('NOT_AN_AGENT', 'Only AI participants can run agent loops.');
        }
        if (this._loops.size >= this._maxLoops) {
            throw new AgentRuntimeError('LOOP_CAPACITY', 'Runtime loop capacity was exceeded.');
        }
        const loop = new AgentLoop(participant, message, options, this._inference, (event) => this._dispatcher.publish(event));
        this._loops = new Map([...this._loops, [loop.id, loop]]);
        return this.trackExecution(loop);
    }
    /**
     * Resumes a paused loop; interception and permission guards run again.
     *
     * @param loopId - Identifier of the active or paused loop.
     * @returns The resumed loop outcome with the same loop identity.
     * @throws {AgentRuntimeError} When the loop is unavailable or a resumed execution boundary rejects the work.
     */
    public async resumeLoop(loopId: string): Promise<IAgentRunResult> {
        this.assertOpen();
        const loop = this._loops.get(loopId);
        if (!loop || this._running.has(loopId)) {
            throw new AgentRuntimeError('LOOP_UNAVAILABLE', 'Loop is absent or already running.', loopId);
        }
        return this.trackExecution(loop);
    }
    /**
     * Cancels an active loop or discards a paused loop. Tools must honor abortSignal. No effect is retried.
     *
     * @param loopId - Identifier of the active or paused loop.
     * @throws {AgentRuntimeError} When the loop is not retained by this runtime.
     */
    public cancelLoop(loopId: string): void {
        const loop = this._loops.get(loopId);
        if (!loop) {
            throw new AgentRuntimeError('LOOP_UNAVAILABLE', 'Loop is absent.', loopId);
        }
        loop.cancel();
        if (!this._running.has(loopId)) {
            this.removeLoop(loopId);
        }
    }
    /**
     * Waits for participant reactions and sink publications, including nested events.
     *
     * @param timeoutMs - Maximum wait in milliseconds; defaults to the runtime shutdown budget.
     * @returns Resolves after queued jobs settle without an unacknowledged dispatch failure.
     * @throws {AgentRuntimeError} When the budget is invalid or expires, or a reaction or sink fails.
     */
    public async drain(timeoutMs: number = this._shutdownTimeoutMs): Promise<void> {
        await this._dispatcher.drain(timeoutMs);
    }
    /**
     * Cancels runs, drains outstanding events and releases membership once per owner lifetime.
     *
     * @returns The shared cleanup promise, resolving when all tracked work has settled.
     * @throws {AgentRuntimeError} When execution or queued reactions cannot drain within the shutdown budget.
     */
    public dispose(): Promise<void> {
        this._disposePromise ??= this.disposeRuntime();
        return this._disposePromise;
    }
    private trackExecution(loop: AgentLoop): Promise<IAgentRunResult> {
        const execution = this.executeLoop(loop);
        this._executions = new Set([...this._executions, execution]);
        void execution.then(
            () => this.removeExecution(execution),
            () => this.removeExecution(execution),
        );
        return execution;
    }
    private removeExecution(execution: Promise<IAgentRunResult>): void {
        this._executions = new Set([...this._executions].filter((item) => item !== execution));
    }
    private async executeLoop(loop: AgentLoop): Promise<IAgentRunResult> {
        this._running = new Set([...this._running, loop.id]);
        try {
            const result = await loop.run();
            if (result.status !== 'paused') {
                this.removeLoop(loop.id);
            }
            return result;
        } catch (error: unknown) {
            this.removeLoop(loop.id);
            throw error;
        } finally {
            this._running = new Set([...this._running].filter((id) => id !== loop.id));
        }
    }
    private removeLoop(loopId: string): void {
        this._loops = new Map([...this._loops].filter(([id]) => id !== loopId));
    }
    private assertOpen(): void {
        if (this._disposed) {
            throw new AgentRuntimeError('RUNTIME_DISPOSED', 'Runtime has been disposed.');
        }
    }
    private async disposeRuntime(): Promise<void> {
        this._disposed = true;
        this._dispatcher.close();
        for (const loop of this._loops.values()) {
            loop.cancel();
        }
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this._shutdownTimeoutMs);
        try {
            await withAgentAbort(Promise.allSettled([...this._executions]), controller.signal);
            await withAgentAbort(this.drain(this._shutdownTimeoutMs), controller.signal);
        } finally {
            clearTimeout(timeout);
            this._loops = new Map();
            for (const participant of this.state.getParticipants()) {
                this.state.removeParticipant(participant.id);
            }
            this._onDispose?.();
        }
    }
    // #endregion
}
