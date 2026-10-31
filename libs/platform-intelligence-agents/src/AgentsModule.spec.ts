import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AgentsModule } from './AgentsModule.js';
import { AgentRuntimeFactory } from './AgentRuntimeFactory.js';
import { AgentInferenceBase } from './abstracts/AgentInferenceBase.js';
import { Agent } from './participants/Agent.js';
import type { IAgentInferenceResult } from './interfaces/IAgentInferenceResult.js';
import type { AgentInferenceEvent } from './contracts/AgentInferenceEvent.js';

/**
 * Returns deterministic model responses for module-composition tests.
 *
 * @internal
 */
class CustomInference extends AgentInferenceBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Produces the fixed buffered response used by composition tests.
     *
     * @returns A completed response without provider I/O or tool calls.
     */
    public override async run(): Promise<IAgentInferenceResult> {
        return { text: 'custom', toolCalls: [], usage: null, finishReason: 'stop' };
    }
    /**
     * Produces the fixed streaming response used by composition tests.
     *
     * @returns One final output event containing the buffered test response.
     */
    public override async *stream(): AsyncIterable<AgentInferenceEvent> {
        yield { type: 'output', result: await this.run() };
    }
    // #endregion
}
afterEach(() => vi.restoreAllMocks());
describe('Reusable NestJS composition', () => {
    it('wires an application inference port without requiring a vendor module', async () => {
        // arrange
        const module = await Test.createTestingModule({ imports: [AgentsModule.register({ inference: CustomInference })] }).compile();
        const runtime = module.get(AgentRuntimeFactory).create();
        runtime.join(new Agent({ id: 'agent', name: 'Generic', instruction: 'Inspect.' }));
        // act
        const result = await runtime.runLoop('agent', 'Inspect');
        // assert
        expect(result.result?.text).toBe('custom');
        await module.close();
        expect(() => runtime.getParticipant('agent')).toThrowError();
    });
    it('fails composition early when default intelligence dependencies were not imported', async () => {
        // arrange
        const builder = Test.createTestingModule({ imports: [AgentsModule.register()] });
        // act
        const module = builder.compile();
        // assert
        await expect(module).rejects.toThrowError();
    });
    it('releases runtime factory capacity after explicit disposal', async () => {
        // arrange
        const factory = new AgentRuntimeFactory(new CustomInference());
        const runtimes = Array.from({ length: 128 }, () => factory.create());
        expect(() => factory.create()).toThrowError();
        await runtimes[0].dispose();
        // act
        const replacement = factory.create();
        // assert
        expect(replacement).toBeDefined();
        await factory.onModuleDestroy();
        expect(() => factory.create()).toThrowError();
    });
    it('reports failed shutdown drains through a typed factory failure', async () => {
        // arrange
        const factory = new AgentRuntimeFactory(new CustomInference());
        const runtime = factory.create();
        vi.spyOn(runtime, 'dispose').mockRejectedValue(new Error('cleanup failure'));
        // act
        const result = factory.onModuleDestroy();
        // assert
        await expect(result).rejects.toMatchObject({ code: 'SHUTDOWN_FAILED' });
    });
});
