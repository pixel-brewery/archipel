import { Logger } from '@nestjs/common';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import type { AgentEventSinkBase } from '../abstracts/AgentEventSinkBase.js';
import type { RuntimeState } from '../runtime/RuntimeState.js';
import { withAgentAbort } from '../runtime/withAgentAbort.js';
import type { AgentEvent } from './AgentEvent.js';

/**
 * Implements bounded Observer dispatch for participant reactions and the event sink.
 *
 * @remarks
 * Each publication uses a membership snapshot. Rejected handlers are isolated and reported by drain, while pending work
 * remains bounded by the owner budget.
 * @internal
 */
export class AgentEventDispatcher {
    // #region Fields
    private readonly _state: RuntimeState;
    private readonly _maxHandlers: number;
    private readonly _defaultTimeoutMs: number;
    private readonly _sink?: AgentEventSinkBase;
    private readonly _logger: Logger = new Logger(AgentEventDispatcher.name);
    private _pending: ReadonlySet<Promise<void>> = new Set();
    private _dispatchFailures = 0;
    private _closed = false;
    // #endregion

    // #region Ctor
    /**
     * Creates bounded event delivery for one runtime owner.
     *
     * @param state - Membership registry used to capture participants for each publication.
     * @param maxHandlers - Maximum combined number of pending participant and sink jobs.
     * @param defaultTimeoutMs - Default drain budget in milliseconds.
     * @param sink - Optional application adapter for audit, telemetry or distributed delivery.
     */
    public constructor(state: RuntimeState, maxHandlers: number, defaultTimeoutMs: number, sink?: AgentEventSinkBase) {
        this._state = state;
        this._maxHandlers = maxHandlers;
        this._defaultTimeoutMs = defaultTimeoutMs;
        this._sink = sink;
    }
    // #endregion

    // #region Properties

    /**
     * Number of participant or sink jobs still awaiting settlement.
     *
     * @returns Number of participant or sink jobs still awaiting settlement.
     */
    public get pendingHandlers(): number {
        return this._pending.size;
    }
    /**
     * Bounded count of dispatch failures awaiting acknowledgment through drain.
     *
     * @returns Bounded count of dispatch failures awaiting acknowledgment through drain.
     */
    public get dispatchFailures(): number {
        return this._dispatchFailures;
    }
    // #endregion

    // #region Methods

    /**
     * Schedules independent reactions and sink delivery from a membership snapshot.
     *
     * @param event - Semantic event to publish or evaluate.
     * @throws {AgentRuntimeError} When scheduling the complete publication would exceed pending-job capacity.
     */
    public publish(event: AgentEvent): void {
        const startedAt = Date.now();
        if (this._closed) {
            return;
        }
        const jobs: Array<() => void | Promise<void>> = [];
        if (this._sink) {
            jobs.push(() => this._sink?.publish(event));
        }
        for (const participant of this._state.getParticipants()) {
            for (const handler of participant.getHandlers()) {
                jobs.push(async () => {
                    const context = { event, participant };
                    if (handler.specification.isSatisfiedBy(context)) {
                        await handler.processor.apply(context);
                    }
                });
            }
        }
        if (jobs.length + this._pending.size > this._maxHandlers) {
            this.reportDispatchFailure('EVENT_CAPACITY', event, startedAt);
            throw new AgentRuntimeError('EVENT_CAPACITY', 'Pending event capacity was exceeded.', event.loopId);
        }
        for (const job of jobs) {
            const pending = Promise.resolve()
                .then(job)
                .catch((_error: unknown) => this.reportDispatchFailure('EVENT_HANDLER_FAILED', event, startedAt))
                .finally(() => {
                    this._pending = new Set([...this._pending].filter((item) => item !== pending));
                });
            this._pending = new Set([...this._pending, pending]);
        }
    }

    /**
     * Waits for queued event jobs and acknowledges any observed dispatch failures.
     *
     * @param timeoutMs - Maximum wait in milliseconds; defaults to the owner's drain budget.
     * @returns Resolves after queued jobs settle without an unacknowledged failure.
     * @throws {AgentRuntimeError} When the budget is invalid or expires, or a scheduled reaction fails.
     */
    public async drain(timeoutMs = this._defaultTimeoutMs): Promise<void> {
        if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 10000) {
            throw new AgentRuntimeError('INVALID_TIMEOUT', 'Drain timeout must be between one millisecond and ten seconds.');
        }
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            while (this._pending.size > 0) {
                await withAgentAbort(Promise.all([...this._pending]), controller.signal);
            }
            if (this._dispatchFailures > 0) {
                this._dispatchFailures = 0;
                throw new AgentRuntimeError('EVENT_DISPATCH_FAILED', 'One or more event handlers or sinks failed.');
            }
        } finally {
            clearTimeout(timer);
        }
    }

    /**
     * Prevents further publications while already scheduled reactions are being drained.
     */
    public close(): void {
        this._closed = true;
    }

    private reportDispatchFailure(code: string, event: AgentEvent, startedAt: number): void {
        this._dispatchFailures = Math.min(this._dispatchFailures + 1, this._maxHandlers);
        this._logger.warn({
            module: 'platform-intelligence-agents',
            operation: 'publish',
            requestId: event.loopId ?? event.producerId,
            duration: Date.now() - startedAt,
            code,
        });
    }
    // #endregion
}
