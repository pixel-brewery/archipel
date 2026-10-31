import { Logger } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IIntelligenceToolDefinition } from '@pixel-brewery/archipel-platform-intelligence';
import { Agent } from '../participants/Agent.js';
import { Human } from '../participants/Human.js';
import { ModelContext } from '../memory/ModelContext.js';
import { AgentEvent } from '../events/AgentEvent.js';
import { SituationSpecificationBase } from '../abstracts/SituationSpecificationBase.js';
import type { ISituationContext } from '../interfaces/ISituationContext.js';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';
import type { AgentInferenceEvent } from '../contracts/AgentInferenceEvent.js';
import { AgentEventDispatcher } from '../events/AgentEventDispatcher.js';
import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';
import type { AgentInterceptionBase } from '../abstracts/AgentInterceptionBase.js';
import { AgentRuntime } from './AgentRuntime.js';
import { RuntimeState } from './RuntimeState.js';

/**
 * Selects reactions by exact semantic event type in runtime tests.
 *
 * @internal
 */
class EventType extends SituationSpecificationBase {
    // #region Fields
    private readonly _type: string;
    // #endregion

    // #region Ctor
    /**
     * Selects the semantic event type used by a reaction test.
     *
     * @param type - Exact event discriminator to match.
     */
    public constructor(type: string) {
        super();
        this._type = type;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Matches the fixture's configured event type.
     *
     * @param context - Semantic event and participant supplied by the runtime.
     * @returns True only for the configured event discriminator.
     */
    public override isSatisfiedBy(context: ISituationContext): boolean {
        return context.event.type === this._type;
    }
    // #endregion
}
const answer = (text = 'done'): IAgentInferenceResult => ({ text, output: text, toolCalls: [], usage: null, finishReason: 'stop' });
const call = (id = 'call-1', name = 'echo', input: unknown = { value: 'input' }) => ({ toolCallId: id, toolName: name, input });
const schema = {
    kind: 'json-schema' as const,
    jsonSchema: { type: 'object', properties: { value: { type: 'string' } }, required: ['value'], additionalProperties: false },
};
const fixture = (tools: Readonly<Record<string, IIntelligenceToolDefinition>> = {}) => {
    const inference = { run: vi.fn<AgentInferenceBase['run']>().mockResolvedValue(answer()), stream: vi.fn<AgentInferenceBase['stream']>() };
    const events: AgentEvent[] = [];
    const runtime = new AgentRuntime(inference, {
        eventSink: {
            publish: (event) => {
                events.push(event);
            },
        },
    });
    const agent = new Agent({ id: 'agent', name: 'Inspector', instruction: 'Check carefully.', tools });
    runtime.join(agent);
    return { runtime, agent, inference, events };
};
const cleanupStream = (close: () => Promise<IteratorResult<AgentInferenceEvent>>): AsyncIterable<AgentInferenceEvent> => ({
    [Symbol.asyncIterator]: () => ({
        next: vi
            .fn<AsyncIterator<AgentInferenceEvent>['next']>()
            .mockResolvedValueOnce({ done: false, value: { type: 'output', result: answer() } })
            .mockResolvedValue({ done: true, value: undefined }),
        return: close,
    }),
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});
describe('Participant registration and semantic events', () => {
    it('keeps identity stable and publishes a duplicate join only once', async () => {
        // arrange
        const { runtime, agent, events } = fixture();
        // act
        runtime.join(new Agent({ id: agent.id, name: 'Replacement', instruction: 'Different' }));
        await runtime.drain();
        // assert
        expect(runtime.getParticipant(agent.id)).toBe(agent);
        expect(events.filter((event) => event.type === 'participant.joined')).toHaveLength(1);
        expect(agent.getManifest().role).toBe('agent');
    });
    it('removes membership and publishes the original manifest', async () => {
        // arrange
        const { runtime, agent, events } = fixture();
        // act
        runtime.leave(agent.id);
        await runtime.drain();
        // assert
        expect(runtime.state.getParticipants()).toHaveLength(0);
        expect(events.at(-1)?.payload).toEqual(agent.getManifest());
        expect(() => runtime.getParticipant(agent.id)).toThrowError();
        expect(() => runtime.leave(agent.id)).toThrowError();
    });
    it('requires a registered producer for messages and custom events', () => {
        // arrange
        const { runtime } = fixture();
        // act
        const invalidMessage = () => runtime.sendMessage('message', 'unknown');
        const invalidEvent = () => runtime.sendEvent(new AgentEvent('custom', 'unknown', {}));
        // assert
        expect(invalidMessage).toThrowError(expect.objectContaining({ code: 'PARTICIPANT_NOT_FOUND' }));
        expect(invalidEvent).toThrowError();
    });
    it('routes messages from a human through composable situations', async () => {
        // arrange
        const { runtime } = fixture();
        const apply = vi.fn();
        const condition = new EventType('message.sent').and(new EventType('custom').not()).or(new EventType('fallback'));
        const human = new Human({ id: 'human', name: 'Operator', handlers: [{ specification: condition, processor: { apply } }] });
        runtime.join(human);
        // act
        runtime.sendMessage('Inspect', human.id);
        await runtime.drain();
        // assert
        expect(apply).toHaveBeenCalledOnce();
        expect(apply).toHaveBeenCalledWith(
            expect.objectContaining({ event: expect.objectContaining({ type: 'message.sent', payload: { message: 'Inspect' } }), participant: human }),
        );
    });
    it('does not wait for a slow reaction before dispatching to another participant', async () => {
        // arrange
        const { runtime } = fixture();
        let release: () => void = () => undefined;
        const blocked = new Promise<void>((resolve) => {
            release = resolve;
        });
        const fast = vi.fn();
        runtime.join(new Human({ name: 'Slow', handlers: [{ specification: new EventType('custom'), processor: { apply: () => blocked } }] }));
        runtime.join(new Human({ name: 'Fast', handlers: [{ specification: new EventType('custom'), processor: { apply: fast } }] }));
        // act
        runtime.sendEvent(new AgentEvent('custom', 'agent', {}));
        await Promise.resolve();
        // assert
        expect(fast).toHaveBeenCalledOnce();
        release();
        await runtime.drain();
    });
    it('isolates failed predicates and processors and reports them through drain', async () => {
        // arrange
        vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const { runtime } = fixture();
        const fast = vi.fn();
        runtime.join(
            new Human({
                name: 'Faulty',
                handlers: [
                    {
                        specification: Object.assign(new EventType('custom'), {
                            isSatisfiedBy: () => {
                                throw new Error('private payload');
                            },
                        }),
                        processor: { apply: vi.fn() },
                    },
                    {
                        specification: new EventType('custom'),
                        processor: {
                            apply: async () => {
                                throw new Error('private payload');
                            },
                        },
                    },
                    { specification: new EventType('custom'), processor: { apply: fast } },
                ],
            }),
        );
        // act
        runtime.sendEvent(new AgentEvent('custom', 'agent', {}));
        const drained = runtime.drain();
        // assert
        await expect(drained).rejects.toMatchObject({ code: 'EVENT_DISPATCH_FAILED' });
        expect(fast).toHaveBeenCalledOnce();
        expect(Logger.prototype.warn).not.toHaveBeenCalledWith(expect.stringContaining('private payload'));
    });
    it('drains nested publications and allows handler replacement', async () => {
        // arrange
        const { runtime, agent, events } = fixture();
        agent.setHandlers([{ specification: new EventType('custom'), processor: { apply: () => runtime.sendEvent(new AgentEvent('nested', agent.id, {})) } }]);
        // act
        runtime.sendEvent(new AgentEvent('custom', agent.id, {}));
        await runtime.drain();
        // assert
        expect(events.map((event) => event.type)).toContain('nested');
        const snapshot = agent.getHandlers();
        agent.setHandlers([]);
        expect(snapshot).toHaveLength(1);
        expect(agent.getHandlers()).toHaveLength(0);
    });
    it('rejects event overload without growing an unbounded queue', async () => {
        // arrange
        vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const runtime = new AgentRuntime(fixture().inference, { maxPendingHandlers: 1, eventSink: { publish: () => undefined } });
        runtime.join(new Human({ id: 'human', name: 'Operator' }));
        // act
        const overload = () => runtime.sendMessage('too soon', 'human');
        // assert
        expect(overload).toThrowError(expect.objectContaining({ code: 'EVENT_CAPACITY' }));
        await expect(runtime.drain()).rejects.toMatchObject({ code: 'EVENT_DISPATCH_FAILED' });
    });
});
describe('Bounded agent execution', () => {
    it('carries identity, instructions, caller policy and model selection into a plain run', async () => {
        // arrange
        const { runtime, agent, inference, events } = fixture();
        // act
        const result = await runtime.runLoop(agent.id, 'Inspect', { generation: { model: { provider: 'test', model: 'model' }, requestId: 'request' } });
        await runtime.drain();
        // assert
        expect(result.status).toBe('completed');
        expect(result.transitions).toEqual(['message_received', 'inference', 'model_message']);
        expect(inference.run).toHaveBeenCalledWith(
            expect.objectContaining({
                prompt: { instructions: agent.instruction, messages: [{ role: 'user', content: 'Inspect' }] },
                options: expect.objectContaining({ includeRegisteredTools: false, maxSteps: 1, requestId: 'request' }),
            }),
        );
        expect(agent.memory.getMessages()).toEqual(result.context.messages);
        expect(events.filter((event) => event.type === 'model.answer')[0]?.loopId).toBe(result.loopId);
    });
    it('executes every tool call once and correlates every result before the next inference', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue({ accepted: true });
        const { runtime, inference, agent } = fixture({ echo: { inputSchema: schema, execute } });
        inference.run.mockResolvedValueOnce({ ...answer('working'), toolCalls: [call('one'), call('two')] }).mockResolvedValueOnce(answer('finished'));
        // act
        const result = await runtime.runLoop(agent.id, 'Inspect');
        // assert
        expect(execute).toHaveBeenCalledTimes(2);
        expect(execute.mock.calls.map((arguments_) => arguments_[1].toolCallId)).toEqual(['one', 'two']);
        expect(result.context.messages.filter((message) => message.role === 'tool')).toHaveLength(2);
        expect(inference.run.mock.calls[1][0].prompt.messages).toEqual(result.context.messages.slice(0, -1));
        expect(result.result?.text).toBe('finished');
    });
    it.each([
        ['unknown', 'missing', { value: 'input' }, 'UNKNOWN_TOOL'],
        ['invalid', 'echo', { value: 5 }, 'INVALID_TOOL_INPUT'],
        ['failed', 'echo', { value: 'input' }, 'TOOL_FAILED'],
    ])('returns a sanitized %s tool outcome for model correction', async (_label, name, input, code) => {
        // arrange
        const execute = vi.fn().mockRejectedValue(new Error('secret=should-not-leak'));
        const { runtime, inference, agent, events } = fixture({ echo: { inputSchema: schema, execute } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call('one', name, input)] });
        // act
        const result = await runtime.runLoop(agent.id, 'Inspect');
        await runtime.drain();
        // assert
        expect(JSON.stringify(result.context)).toContain(code);
        expect(JSON.stringify(result.context)).not.toContain('should-not-leak');
        expect(JSON.stringify(events)).not.toContain('should-not-leak');
        expect(execute).toHaveBeenCalledTimes(code === 'TOOL_FAILED' ? 1 : 0);
    });
    it('validates tool outputs before returning them to the model', async () => {
        // arrange
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, outputSchema: schema, execute: () => ({ value: 7 }) } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call()] });
        // act
        const result = await runtime.runLoop('agent', 'Inspect');
        // assert
        expect(JSON.stringify(result.context)).toContain('TOOL_FAILED');
        expect(JSON.stringify(result.context)).not.toContain('"value":7');
    });
    it('requires a fresh application approval before a protected effect', async () => {
        // arrange
        const execute = vi.fn();
        const { runtime, inference, agent } = fixture({ echo: { inputSchema: schema, needsApproval: true, execute } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call()] });
        // act
        const result = runtime.runLoop(agent.id, 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'TOOL_APPROVAL_REQUIRED' });
        expect(execute).not.toHaveBeenCalled();
        expect(agent.memory.getMessages()).toHaveLength(0);
    });
    it('runs the authoritative tool guard after approval and before the effect', async () => {
        // arrange
        const execute = vi.fn();
        const approve = vi.fn().mockResolvedValue(true);
        const guard = vi.fn().mockRejectedValue(new Error('permission revoked'));
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, needsApproval: true, execute } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call()] });
        // act
        const result = runtime.runLoop('agent', 'Inspect', { approveToolCall: approve, beforeToolCall: guard });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'LOOP_FAILED' });
        expect(approve).toHaveBeenCalledOnce();
        expect(guard).toHaveBeenCalledOnce();
        expect(execute).not.toHaveBeenCalled();
    });
    it('allows an approved guarded effect', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue('ok');
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, needsApproval: true, execute } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call()] });
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { approveToolCall: async () => true, beforeToolCall: async () => undefined });
        // assert
        expect(result.status).toBe('completed');
        expect(execute).toHaveBeenCalledOnce();
    });
    it('isolates parallel contexts and merges complete conversations without losing either run', async () => {
        // arrange
        const { runtime, agent, inference } = fixture();
        inference.run.mockImplementation(async (request) => answer(String(request.prompt.messages?.[0].content)));
        // act
        const results = await Promise.all([runtime.runLoop('agent', 'first'), runtime.runLoop('agent', 'second')]);
        // assert
        expect(new Set(results.map((result) => result.loopId)).size).toBe(2);
        expect(inference.run.mock.calls.map((arguments_) => arguments_[0].prompt.messages?.length)).toEqual([1, 1]);
        expect(agent.memory.getMessages()).toHaveLength(4);
        expect(results[0].context.messages).not.toContainEqual({ role: 'user', content: 'second' });
    });
    it('keeps structured formatting in a final tool-free provider step', async () => {
        // arrange
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, execute: () => 'ok' } });
        inference.run
            .mockResolvedValueOnce({ ...answer(), toolCalls: [call()] })
            .mockResolvedValueOnce(answer('analysis'))
            .mockResolvedValueOnce({ ...answer('{"value":"final"}'), output: { value: 'final' } });
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { schema });
        // assert
        expect(inference.run.mock.calls[0][0].schema).toBeUndefined();
        expect(inference.run.mock.calls[2][0]).toMatchObject({ schema, options: { tools: {} } });
        expect(result.result?.output).toEqual({ value: 'final' });
    });
    it('streams tool events, executes the tool and then streams the answer', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue('ok');
        const { runtime, inference, events } = fixture({ echo: { inputSchema: schema, execute } });
        inference.stream.mockImplementation(async function* () {
            yield { type: 'text-delta', text: 'chunk' };
            yield { type: 'output', result: execute.mock.calls.length === 0 ? { ...answer(), toolCalls: [call()] } : answer('final') };
        });
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { streaming: true });
        await runtime.drain();
        // assert
        expect(result.result?.text).toBe('final');
        expect(execute).toHaveBeenCalledOnce();
        expect(inference.run).not.toHaveBeenCalled();
        expect(events.filter((event) => event.type === 'inference.stream')).toHaveLength(2);
    });
    it('rejects streams without a final output', async () => {
        // arrange
        const { runtime, inference } = fixture();
        inference.stream.mockImplementation(async function* () {
            yield { type: 'text-delta', text: 'incomplete' };
        });
        // act
        const result = runtime.runLoop('agent', 'Inspect', { streaming: true });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INVALID_STREAM' });
    });
    it('rejects multiple final stream responses without committing an ambiguous conversation', async () => {
        // arrange
        const { runtime, inference, agent } = fixture();
        inference.stream.mockImplementation(async function* () {
            yield { type: 'output', result: answer('first') };
            yield { type: 'output', result: answer('second') };
        });
        // act
        const result = runtime.runLoop('agent', 'Inspect', { streaming: true });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INVALID_STREAM' });
        expect(agent.memory.getMessages()).toEqual([]);
    });
    it('rejects a provider error event without committing incomplete streamed content', async () => {
        // arrange
        const { runtime, inference, agent } = fixture();
        inference.stream.mockImplementation(async function* () {
            yield { type: 'text-delta', text: 'incomplete' };
            yield { type: 'error', error: new Error('test-only-private-provider-error') };
        });
        // act
        const result = runtime.runLoop('agent', 'Inspect', { streaming: true });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INFERENCE_FAILED' });
        expect(agent.memory.getMessages()).toEqual([]);
    });
    it.each(['synchronous', 'asynchronous'])('isolates %s stream cleanup failure without exposing provider details', async (failureMode) => {
        // arrange
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const { runtime, inference, events } = fixture();
        const close = vi.fn<() => Promise<IteratorResult<AgentInferenceEvent>>>().mockImplementation(() => {
            if (failureMode === 'synchronous') {
                throw new Error('test-only-private-provider-error');
            }
            return Promise.reject(new Error('test-only-private-provider-error'));
        });
        inference.stream.mockReturnValue(cleanupStream(close));
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { streaming: true });
        await runtime.drain();
        // assert
        expect(result.status).toBe('completed');
        expect(close).toHaveBeenCalledOnce();
        expect(events.some((event) => event.type === 'stream.cleanup_failed')).toBe(true);
        expect(warn).toHaveBeenCalledWith(expect.objectContaining({ requestId: result.loopId, code: 'STREAM_CLEANUP_FAILED', duration: expect.any(Number) }));
        expect(JSON.stringify(warn.mock.calls)).not.toContain('test-only-private-provider-error');
    });
    it('isolates a failed cleanup notification from the completed run', async () => {
        // arrange
        const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
        const publish = AgentEventDispatcher.prototype.publish;
        vi.spyOn(AgentEventDispatcher.prototype, 'publish').mockImplementation(function (this: AgentEventDispatcher, event: AgentEvent): void {
            if (event.type === 'stream.cleanup_failed') {
                throw new Error('test-only-private-sink-error');
            }
            publish.call(this, event);
        });
        const { runtime, inference } = fixture();
        const close = vi.fn<() => Promise<IteratorResult<AgentInferenceEvent>>>().mockRejectedValue(new Error('test-only-private-provider-error'));
        inference.stream.mockReturnValue(cleanupStream(close));
        // act
        const result = await runtime.runLoop('agent', 'Inspect', { streaming: true });
        await runtime.drain();
        // assert
        expect(result.status).toBe('completed');
        expect(warn).toHaveBeenCalledWith(expect.objectContaining({ requestId: result.loopId, code: 'EVENT_DISPATCH_FAILED' }));
        expect(JSON.stringify(warn.mock.calls)).not.toContain('test-only-private-sink-error');
    });
    it('rejects a reused tool identity across inference steps before repeating its effect', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue('ok');
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, execute } });
        inference.run.mockResolvedValue({ ...answer(), toolCalls: [call('same-id')] });
        // act
        const result = runtime.runLoop('agent', 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INVALID_TOOL_CALLS' });
        expect(execute).toHaveBeenCalledOnce();
    });
    it('exposes gauges and retains paused capacity until cancellation', async () => {
        // arrange
        const { runtime } = fixture();
        const paused = await runtime.runLoop('agent', 'Inspect', { interception: { isSatisfiedBy: () => true, handle: async () => ({ action: 'pause' }) } });
        // act
        const pausedDiagnostics = runtime.diagnostics;
        runtime.cancelLoop(paused.loopId);
        // assert
        expect(pausedDiagnostics).toMatchObject({ participants: 1, activeLoops: 0, pausedLoops: 1, disposed: false });
        expect(runtime.diagnostics.pausedLoops).toBe(0);
    });
    it('rejects duplicate tool call identities before any effect', async () => {
        // arrange
        const execute = vi.fn();
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, execute } });
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call(), call()] });
        // act
        const result = runtime.runLoop('agent', 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INVALID_TOOL_CALLS' });
        expect(execute).not.toHaveBeenCalled();
    });
    it('does not commit truncated model output to agent memory', async () => {
        // arrange
        const { runtime, inference, agent } = fixture();
        inference.run.mockResolvedValueOnce({ ...answer(), finishReason: 'length' });
        // act
        const result = runtime.runLoop('agent', 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INCOMPLETE_OUTPUT' });
        expect(agent.memory.getMessages()).toHaveLength(0);
    });
    it('rejects inference failures without exposing adapter details', async () => {
        // arrange
        const { runtime, inference } = fixture();
        inference.run.mockRejectedValue(new Error('private provider token'));
        // act
        const result = runtime.runLoop('agent', 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'LOOP_FAILED', message: 'Agent loop failed.' });
    });
    it('enforces a transition budget before a repeated effect', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue('ok');
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, execute } });
        inference.run.mockResolvedValue({ ...answer(), toolCalls: [call()] });
        // act
        const result = runtime.runLoop('agent', 'Inspect', { maxTransitions: 3 });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'TRANSITION_LIMIT' });
        expect(execute).toHaveBeenCalledOnce();
    });
    it('rejects a human as an inference participant', async () => {
        // arrange
        const { runtime } = fixture();
        runtime.join(new Human({ id: 'human', name: 'Operator' }));
        // act
        const result = runtime.runLoop('human', 'Inspect');
        // assert
        await expect(result).rejects.toMatchObject({ code: 'NOT_AN_AGENT' });
    });
});
describe('Interception, cancellation and shutdown', () => {
    it('rewrites a selected transition before the state executes', async () => {
        // arrange
        const { runtime, inference } = fixture();
        const interception: AgentInterceptionBase = {
            isSatisfiedBy: (transition) => transition.nextStateId === 'message_received',
            handle: async () => ({ action: 'continue', transition: { nextStateId: 'message_received', input: { content: 'rewritten' } } }),
        };
        // act
        await runtime.runLoop('agent', 'original', { interception });
        // assert
        expect(inference.run.mock.calls[0][0].prompt.messages).toEqual([{ role: 'user', content: 'rewritten' }]);
    });
    it('pauses before a tool effect and rechecks interception when resuming', async () => {
        // arrange
        const execute = vi.fn().mockResolvedValue('ok');
        const { runtime, inference } = fixture({ echo: { inputSchema: schema, execute } });
        let approved = false;
        const handle = vi
            .fn<AgentInterceptionBase['handle']>()
            .mockImplementation(async (transition) => (approved ? { action: 'continue', transition } : { action: 'pause' }));
        inference.run.mockResolvedValueOnce({ ...answer(), toolCalls: [call()] });
        const paused = await runtime.runLoop('agent', 'Inspect', {
            interception: { isSatisfiedBy: (transition) => transition.nextStateId === 'function_call', handle },
        });
        expect(paused.status).toBe('paused');
        expect(execute).not.toHaveBeenCalled();
        approved = true;
        // act
        const result = await runtime.resumeLoop(paused.loopId);
        // assert
        expect(result.status).toBe('completed');
        expect(handle).toHaveBeenCalledTimes(2);
        expect(execute).toHaveBeenCalledOnce();
        await expect(runtime.resumeLoop(paused.loopId)).rejects.toMatchObject({ code: 'LOOP_UNAVAILABLE' });
    });
    it('stops before inference without committing an unfinished conversation', async () => {
        // arrange
        const { runtime, inference, agent } = fixture();
        // act
        const result = await runtime.runLoop('agent', 'Inspect', {
            interception: { isSatisfiedBy: () => true, handle: async () => ({ action: 'stop', reason: 'policy' }) },
        });
        // assert
        expect(result).toMatchObject({ status: 'stopped', reason: 'policy' });
        expect(inference.run).not.toHaveBeenCalled();
        expect(agent.memory.getMessages()).toHaveLength(0);
    });
    it('discards a cancelled paused loop and frees capacity', async () => {
        // arrange
        const { runtime } = fixture();
        const paused = await runtime.runLoop('agent', 'Inspect', { interception: { isSatisfiedBy: () => true, handle: async () => ({ action: 'pause' }) } });
        // act
        runtime.cancelLoop(paused.loopId);
        // assert
        await expect(runtime.resumeLoop(paused.loopId)).rejects.toMatchObject({ code: 'LOOP_UNAVAILABLE' });
        expect(() => runtime.cancelLoop(paused.loopId)).toThrowError();
    });
    it('rejects an already cancelled caller before contacting the provider', async () => {
        // arrange
        const { runtime, inference } = fixture();
        const controller = new AbortController();
        controller.abort();
        // act
        const result = runtime.runLoop('agent', 'Inspect', { generation: { abortSignal: controller.signal } });
        // assert
        await expect(result).rejects.toMatchObject({ code: 'RUN_ABORTED' });
        expect(inference.run).not.toHaveBeenCalled();
    });
    it('bounds an inference adapter that ignores cancellation', async () => {
        // arrange
        vi.useFakeTimers();
        const { runtime, inference } = fixture();
        inference.run.mockImplementation(() => new Promise(() => undefined));
        const result = runtime.runLoop('agent', 'Inspect', { timeoutMs: 10 });
        const rejected = expect(result).rejects.toMatchObject({ code: 'RUN_ABORTED' });
        // act
        await vi.advanceTimersByTimeAsync(10);
        // assert
        await rejected;
    });
    it('cancels an active run when its participant leaves', async () => {
        // arrange
        const { runtime, inference } = fixture();
        inference.run.mockImplementation(() => new Promise(() => undefined));
        const result = runtime.runLoop('agent', 'Inspect');
        const rejected = expect(result).rejects.toMatchObject({ code: 'RUN_ABORTED' });
        // act
        runtime.leave('agent');
        // assert
        await rejected;
    });
    it('rejects a concurrent run above capacity and frees capacity after completion', async () => {
        // arrange
        const inference = fixture().inference;
        let release: (result: IAgentInferenceResult) => void = () => undefined;
        inference.run.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    release = resolve;
                }),
        );
        const runtime = new AgentRuntime(inference, { maxConcurrentLoops: 1 });
        runtime.join(new Agent({ id: 'agent', name: 'Inspector', instruction: '' }));
        const active = runtime.runLoop('agent', 'first');
        await Promise.resolve();
        // act
        const second = runtime.runLoop('agent', 'second');
        // assert
        await expect(second).rejects.toMatchObject({ code: 'LOOP_CAPACITY' });
        release(answer());
        await active;
        await expect(runtime.runLoop('agent', 'third')).resolves.toMatchObject({ status: 'completed' });
    });
    it('disposes idempotently and waits for cancelled active runs to settle', async () => {
        // arrange
        const { runtime, inference } = fixture();
        inference.run.mockImplementation(() => new Promise(() => undefined));
        const active = runtime.runLoop('agent', 'Inspect');
        const rejected = expect(active).rejects.toMatchObject({ code: 'RUN_ABORTED' });
        // act
        const disposal = runtime.dispose();
        expect(runtime.dispose()).toBe(disposal);
        await disposal;
        // assert
        await rejected;
        expect(runtime.state.getParticipants()).toHaveLength(0);
        expect(() => runtime.sendMessage('Inspect', 'agent')).toThrowError(expect.objectContaining({ code: 'RUNTIME_DISPOSED' }));
    });
    it('bounds draining an event processor that never settles', async () => {
        // arrange
        vi.useFakeTimers();
        const { runtime, agent } = fixture();
        agent.setHandlers([{ specification: new EventType('custom'), processor: { apply: () => new Promise(() => undefined) } }]);
        runtime.sendEvent(new AgentEvent('custom', 'agent', {}));
        const drained = runtime.drain(10);
        const rejected = expect(drained).rejects.toMatchObject({ code: 'RUN_ABORTED' });
        // act
        await vi.advanceTimersByTimeAsync(10);
        // assert
        await rejected;
    });
});
describe('State and memory boundaries', () => {
    it('round-trips memory without sharing mutable messages', () => {
        // arrange
        const context = new ModelContext();
        context.append([{ role: 'user', content: [{ type: 'text', text: 'first' }] }]);
        const fork = context.fork();
        // act
        fork.append([{ role: 'assistant', content: 'second' }]);
        const restored = new ModelContext(fork.record());
        // assert
        expect(context.getMessages()).toHaveLength(1);
        expect(restored.getMessages()).toEqual(fork.getMessages());
        expect(restored.id).toBe(context.id);
    });
    it('rejects context overflow atomically', () => {
        // arrange
        const context = new ModelContext({ id: 'context', messages: [] }, 1);
        context.append([{ role: 'user', content: 'one' }]);
        // act
        const append = () => context.append([{ role: 'assistant', content: 'two' }]);
        // assert
        expect(append).toThrowError(expect.objectContaining({ code: 'CONTEXT_CAPACITY' }));
        expect(context.getMessages()).toHaveLength(1);
    });
    it('bounds membership without losing registered participants', () => {
        // arrange
        const state = new RuntimeState(1);
        const first = new Human({ name: 'first' });
        state.addParticipant(first);
        // act
        const second = () => state.addParticipant(new Human({ name: 'second' }));
        // assert
        expect(second).toThrowError(expect.objectContaining({ code: 'PARTICIPANT_CAPACITY' }));
        expect(state.getParticipants()).toEqual([first]);
        expect(state.removeParticipant('unknown')).toBe(false);
    });
    it.each([0, -1, 1.5])('rejects invalid capacities (%s)', (value) => {
        // arrange
        const inference = fixture().inference;
        // act
        const state = () => new RuntimeState(value);
        const context = () => new ModelContext(undefined, value);
        const runtime = () => new AgentRuntime(inference, { maxConcurrentLoops: value });
        // assert
        expect(state).toThrowError();
        expect(context).toThrowError();
        expect(runtime).toThrowError();
    });
    it('lets a consumer expose a larger bounded tool catalog', () => {
        // arrange
        const tools = Object.fromEntries(Array.from({ length: 129 }, (_, index) => ['tool_' + index, { inputSchema: schema }]));
        // act
        const agent = new Agent({ name: 'Catalog agent', instruction: '', tools, maxTools: 129 });
        // assert
        expect(Object.keys(agent.tools)).toHaveLength(129);
    });
    it('rejects invalid or exceeded tool catalog budgets', () => {
        // arrange
        const configuration = { name: 'Agent', instruction: '', tools: { first: { inputSchema: schema }, second: { inputSchema: schema } } };
        // act
        const invalid = () => new Agent({ ...configuration, maxTools: 0 });
        const exceeded = () => new Agent({ ...configuration, maxTools: 1 });
        // assert
        expect(invalid).toThrowError(expect.objectContaining({ code: 'TOOL_CAPACITY' }));
        expect(exceeded).toThrowError();
    });
    it('rejects empty identities and excessive handlers', () => {
        // arrange
        const handler = { specification: new EventType('custom'), processor: { apply: () => undefined } };
        // act
        const empty = () => new Human({ id: '', name: 'Operator' });
        const excessive = () => new Human({ name: 'Operator', handlers: Array.from({ length: 129 }, () => handler) });
        // assert
        expect(empty).toThrowError();
        expect(excessive).toThrowError();
    });
    it.each([{ maxTransitions: 0 }, { timeoutMs: 0 }, { maxTransitions: 5000 }])('rejects invalid run budgets (%j)', async (options) => {
        // arrange
        const { runtime } = fixture();
        // act
        const result = runtime.runLoop('agent', 'Inspect', options);
        // assert
        await expect(result).rejects.toMatchObject({ code: 'INVALID_RUN_OPTIONS' });
    });
});
