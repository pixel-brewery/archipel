import { randomUUID } from 'node:crypto';
import type { Agent } from '../participants/Agent.js';
import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';
import type { AgentTransition } from '../contracts/AgentTransition.js';
import type { AgentLoopState } from '../contracts/AgentLoopState.js';
import type { IAgentRunOptions } from '../interfaces/IAgentRunOptions.js';
import type { IAgentRunResult } from '../interfaces/IAgentRunResult.js';
import type { AgentEvent } from '../events/AgentEvent.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import { AgentLoopContext } from './AgentLoopContext.js';
import { LoopStateExecutor } from './states/LoopStateExecutor.js';
import { withAgentAbort } from './withAgentAbort.js';

/**
 * Coordinates interception, state execution and lifecycle budgets for one isolated agent run.
 *
 * @internal
 */
export class AgentLoop {
    // #region Fields
    private readonly _context: AgentLoopContext;
    private readonly _controller: AbortController = new AbortController();
    private readonly _executor: LoopStateExecutor = new LoopStateExecutor();
    private readonly _history: AgentLoopState[] = [];
    private readonly _maxTransitions: number;
    private readonly _timeoutMs: number;
    private _transition: AgentTransition;
    private _running = false;
    private _settled = false;
    // #endregion

    // #region Ctor
    /**
     * Creates one cancellable run with isolated conversation memory.
     *
     * @param agent - Participant whose instructions, tools and memory this run uses.
     * @param message - User message that starts the run.
     * @param options - Provider controls, interception policy, effect guards and execution budgets.
     * @param inference - Adapter responsible for one provider step at a time.
     * @param publish - Synchronous callback that schedules semantic events in the owning runtime.
     * @throws {AgentRuntimeError} When transition or active-operation budgets are outside their supported ranges.
     */
    public constructor(agent: Agent, message: string, options: IAgentRunOptions, inference: AgentInferenceBase, publish: (event: AgentEvent) => void) {
        this._context = new AgentLoopContext(randomUUID(), agent, options, inference, publish);
        this._transition = { nextStateId: 'message_received', input: { content: message } };
        this._maxTransitions = options.maxTransitions ?? 64;
        this._timeoutMs = options.timeoutMs ?? 30000;
        if (
            !Number.isSafeInteger(this._maxTransitions) ||
            this._maxTransitions < 1 ||
            this._maxTransitions > 4096 ||
            !Number.isSafeInteger(this._timeoutMs) ||
            this._timeoutMs < 1 ||
            this._timeoutMs > 3600000
        ) {
            throw new AgentRuntimeError('INVALID_RUN_OPTIONS', 'Run budgets are outside the supported range.', this.id);
        }
    }
    // #endregion

    // #region Properties
    /**
     * Stable correlation identity retained when a paused loop resumes.
     *
     * @returns This loop's generated identifier.
     */
    public get id(): string {
        return this._context.id;
    }
    /**
     * Identifier of the AI participant responsible for the run.
     *
     * @returns The owning participant's identifier.
     */
    public get agentId(): string {
        return this._context.agent.id;
    }
    // #endregion

    // #region Methods
    /**
     * Signals cancellation to the active invocation and all cooperating adapters.
     */
    public cancel(): void {
        this._controller.abort();
    }
    /**
     * Executes or resumes the state machine until completion, pause, stop or a bounded failure.
     *
     * @returns The completed, paused or stopped outcome with an isolated conversation snapshot.
     * @throws {AgentRuntimeError} When cancellation, transition limits, policies or a state failure prevent completion.
     */
    public async run(): Promise<IAgentRunResult> {
        if (this._running || this._settled) {
            throw new AgentRuntimeError('LOOP_UNAVAILABLE', 'Loop is already running or settled.', this.id);
        }
        this._running = true;
        const timeout = setTimeout(() => this._controller.abort(), this._timeoutMs);
        this._context.setSignal(
            this._context.options.generation?.abortSignal
                ? AbortSignal.any([this._controller.signal, this._context.options.generation.abortSignal])
                : this._controller.signal,
        );
        try {
            while (this._transition.nextStateId !== 'idle') {
                this.checkBudget();
                const interception = this._context.options.interception;
                if (interception?.isSatisfiedBy(this._transition)) {
                    this._context.emit('interception.started', { transition: this._transition });
                    const intercepted = await withAgentAbort(
                        interception.handle(this._transition, { loopId: this.id, agentId: this.agentId, abortSignal: this._context.signal }),
                        this._context.signal,
                        this.id,
                    );
                    this._context.emit('interception.finished', { action: intercepted.action });
                    if (intercepted.action === 'pause') {
                        this._context.emit('loop.paused', {});
                        return this._context.outcome('paused', this._history);
                    }
                    if (intercepted.action === 'stop') {
                        this._settled = true;
                        this._context.emit('loop.stopped', { reason: intercepted.reason });
                        return this._context.outcome('stopped', this._history, intercepted.reason);
                    }
                    this._transition = intercepted.transition;
                    if (this._transition.nextStateId === 'idle') {
                        break;
                    }
                }
                this.checkBudget();
                this._history.push(this._transition.nextStateId);
                this._transition = await this._executor.execute(this._transition, this._context);
            }
            // Commit only this run's appended conversation. Concurrent runs never share a mutable context.
            this._context.commitMemory();
            this._settled = true;
            this._context.emit('loop.completed', { result: this._context.result });
            return this._context.outcome('completed', this._history);
        } catch (error: unknown) {
            this._settled = true;
            const failure = error instanceof AgentRuntimeError ? error : new AgentRuntimeError('LOOP_FAILED', 'Agent loop failed.', this.id);
            this._context.emit('loop.failed', { code: failure.code });
            throw failure;
        } finally {
            clearTimeout(timeout);
            this._running = false;
        }
    }
    private checkBudget(): void {
        this._context.assertActive();
        if (this._history.length >= this._maxTransitions) {
            throw new AgentRuntimeError('TRANSITION_LIMIT', 'Agent run transition budget was exhausted.', this.id);
        }
    }
    // #endregion
}
