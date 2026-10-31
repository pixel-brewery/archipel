import type { IIntelligenceToolCall, IntelligenceJsonValue } from '@pixel-brewery/archipel-platform-intelligence';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';
import type { IAgentRunOptions } from '../interfaces/IAgentRunOptions.js';
import type { IAgentRunResult } from '../interfaces/IAgentRunResult.js';
import type { AgentLoopState } from '../contracts/AgentLoopState.js';
import type { AgentTransition } from '../contracts/AgentTransition.js';
import type { Agent } from '../participants/Agent.js';
import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';
import type { ModelContext } from '../memory/ModelContext.js';
import { AgentEvent } from '../events/AgentEvent.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';

/**
 * Owns the isolated conversation and policies shared by the states of one loop.
 *
 * @remarks
 * Each loop receives a separate context. Only completed conversations are committed to the agent's memory, so
 * concurrent runs cannot overwrite each other.
 * @internal
 */
export class AgentLoopContext {
    // #region Fields
    /**
     * Correlation identifier shared by this loop, its events and resumed invocations.
     */
    public readonly id: string;
    /**
     * Participant whose instructions and tools are used by this isolated run.
     */
    public readonly agent: Agent;
    /**
     * Explicit execution policy and budgets supplied by the owner.
     */
    public readonly options: IAgentRunOptions;
    /**
     * Provider-neutral inference adapter shared by this loop's states.
     */
    public readonly inference: AgentInferenceBase;
    private readonly _publish: (event: AgentEvent) => void;
    private readonly _memory: ModelContext;
    private readonly _initialMessageCount: number;
    private _result?: IAgentInferenceResult;
    private _toolCallIds: ReadonlySet<string> = new Set();
    private _signal: AbortSignal = new AbortController().signal;
    // #endregion

    // #region Ctor
    /**
     * Creates the conversation and policy context shared by the states of one loop.
     *
     * @param id - Correlation identifier retained across this loop and its resumes.
     * @param agent - Participant whose memory is forked for this run.
     * @param options - Immutable execution policy and budgets supplied by the owner.
     * @param inference - Adapter used by the buffered and streaming inference states.
     * @param publish - Callback for semantic events correlated with this loop.
     */
    public constructor(id: string, agent: Agent, options: IAgentRunOptions, inference: AgentInferenceBase, publish: (event: AgentEvent) => void) {
        this.id = id;
        this.agent = agent;
        this.options = options;
        this.inference = inference;
        this._publish = publish;
        this._memory = agent.memory.fork();
        this._initialMessageCount = this._memory.getMessages().length;
    }
    // #endregion

    // #region Properties
    /**
     * Conversation fork owned only by this loop.
     *
     * @returns The isolated, bounded conversation used by state execution.
     */
    public get memory(): ModelContext {
        return this._memory;
    }
    /**
     * Cancellation signal for the current active invocation.
     *
     * @returns Cancellation signal for the current active invocation.
     */
    public get signal(): AbortSignal {
        return this._signal;
    }
    /**
     * Latest normalized provider result, if an inference step has completed.
     *
     * @returns The latest result or undefined before the first completed model step.
     */
    public get result(): IAgentInferenceResult | undefined {
        return this._result;
    }
    // #endregion

    // #region Methods
    /**
     * Replaces the active cancellation signal when a paused loop resumes.
     *
     * @param signal - Cancellation signal for the active invocation.
     */
    public setSignal(signal: AbortSignal): void {
        this._signal = signal;
    }
    /**
     * Rejects work after caller cancellation or runtime timeout.
     *
     * @throws {AgentRuntimeError} When the active invocation has been cancelled or timed out.
     */
    public assertActive(): void {
        if (this._signal.aborted) {
            throw new AgentRuntimeError('RUN_ABORTED', 'Agent run was cancelled or timed out.', this.id);
        }
    }
    /**
     * Appends only this completed run's conversation to the agent's current memory.
     */
    public commitMemory(): void {
        this.agent.memory.append(this._memory.getMessages().slice(this._initialMessageCount));
    }
    /**
     * Retains the latest normalized result and publishes its usage evidence.
     *
     * @param result - Normalized result returned by a provider step.
     */
    public recordInference(result: IAgentInferenceResult): void {
        this._result = result;
        this.emit('inference.completed', { result });
    }
    /**
     * Validates call identities and rejects reuse before another tool effect can execute.
     *
     * @param calls - Model-selected tool calls whose identities must be unique within the run.
     * @throws {AgentRuntimeError} When call identities are empty, duplicated, reused or exceed the response capacity.
     */
    public rememberToolCalls(calls: ReadonlyArray<IIntelligenceToolCall>): void {
        if (
            calls.length > 128 ||
            calls.some((call) => !call.toolCallId.trim() || !call.toolName.trim() || this._toolCallIds.has(call.toolCallId)) ||
            new Set(calls.map((call) => call.toolCallId)).size !== calls.length
        ) {
            throw new AgentRuntimeError('INVALID_TOOL_CALLS', 'Tool call identities or capacity are invalid.', this.id);
        }
        this._toolCallIds = new Set([...this._toolCallIds, ...calls.map((call) => call.toolCallId)]);
    }
    /**
     * Builds a single-step provider request from the isolated conversation.
     *
     * @param structuredFinal - Suppresses tool declarations for final schema-constrained formatting when true.
     * @returns The buffered or streaming inference transition selected by the run policy.
     */
    public createInferenceTransition(structuredFinal = false): AgentTransition {
        const tools = structuredFinal
            ? {}
            : Object.fromEntries(
                  Object.entries(this.agent.tools).map(([name, tool]) => [
                      name,
                      { description: tool.description, inputSchema: tool.inputSchema, providerOptions: tool.providerOptions },
                  ]),
              );
        return {
            nextStateId: this.options.streaming ? 'inference_streaming' : 'inference',
            input: {
                prompt: { instructions: this.agent.instruction, messages: this.memory.getMessages() },
                options: {
                    ...this.options.generation,
                    tools,
                    includeRegisteredTools: false,
                    maxSteps: 1,
                    abortSignal: this.signal,
                    requestId: this.options.generation?.requestId ?? this.id,
                },
                schema: structuredFinal || Object.keys(tools).length === 0 ? this.options.schema : undefined,
            },
        };
    }
    /**
     * Normalizes tool data to the existing intelligence JSON contract without exposing raw serialization errors.
     *
     * @param value - Tool data to normalize to serializable JSON.
     * @returns A serializable intelligence JSON value, with undefined normalized to null.
     * @throws {AgentRuntimeError} When the supplied tool data cannot be represented as JSON.
     */
    public normalizeJson(value: unknown): IntelligenceJsonValue {
        if (value === undefined) {
            return null;
        }
        try {
            return JSON.parse(JSON.stringify(value)) as IntelligenceJsonValue;
        } catch (_error: unknown) {
            throw new AgentRuntimeError('INVALID_TOOL_OUTPUT', 'Tool output must be serializable JSON.', this.id);
        }
    }
    /**
     * Captures a defensive snapshot of the current run outcome.
     *
     * @param status - Terminal or paused state to capture in the outcome.
     * @param history - Visited loop phases to include in the returned snapshot.
     * @param reason - Optional application explanation for stopping the run.
     * @returns A defensive snapshot containing identity, outcome, conversation and visited phases.
     */
    public outcome(status: IAgentRunResult['status'], history: ReadonlyArray<AgentLoopState>, reason?: string): IAgentRunResult {
        return { loopId: this.id, agentId: this.agent.id, status, reason, result: this._result, context: this._memory.record(), transitions: [...history] };
    }
    /**
     * Publishes a semantic event correlated with this loop and its agent.
     *
     * @param type - Semantic event type or state discriminator.
     * @param payload - Event data owned and authorized by the consuming application.
     */
    public emit(type: string, payload: unknown): void {
        this._publish(new AgentEvent(type, this.agent.id, payload, this.id));
    }
    // #endregion
}
