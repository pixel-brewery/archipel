// #region Imports

import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { IIntelligenceLanguageCompletion } from '../contracts/IIntelligenceLanguageCompletion.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { IntelligenceValidationStages } from '../errors/IntelligenceValidationStages.js';
import { intelligencePrompt } from './intelligencePrompt.js';
import { IntelligencePromptExecutor } from './IntelligencePromptExecutor.js';

// #endregion

describe('IntelligencePromptExecutor', () => {
    function createCompletion<T>(output: T, text = typeof output === 'string' ? output : JSON.stringify(output)): IIntelligenceLanguageCompletion<T> {
        return {
            text,
            output,
            provider: 'test',
            model: 'test-model',
            finishReason: 'stop',
            sources: [],
            files: [],
            toolCalls: [],
            toolResults: [],
            warnings: [],
            usage: { inputTokens: 2, outputTokens: 3, totalTokens: 5 },
        };
    }

    function createExecutor(capabilities: ReadonlyArray<'textInput' | 'textOutput' | 'structuredOutput'> = ['textInput', 'textOutput']) {
        const policy = {
            resolve: vi.fn(async () => ({
                options: {},
                capabilities,
            })),
        };
        const languageGenerator = {
            generateText: vi.fn(async () => createCompletion('Hello Ada')),
            generateObject: vi.fn(async () => createCompletion({ greeting: 'Hello Ada' })),
        };

        return {
            executor: new IntelligencePromptExecutor(policy as never, languageGenerator as never),
            languageGenerator,
        };
    }

    it('should validate and execute a text prompt through the language facade', async () => {
        const definition = intelligencePrompt({
            name: 'welcome',
            version: 1,
            mode: 'text',
            inputSchema: z.object({ name: z.string() }),
            system: () => 'Be concise.',
            messages: ({ input }) => [{ role: 'user', content: `Welcome ${input.name}` }],
        });
        const { executor, languageGenerator } = createExecutor();

        const result = await executor.execute(definition.with({ name: 'Ada' }));

        expect(result).toMatchObject({
            output: 'Hello Ada',
            provider: 'test',
            model: 'test-model',
            finishReason: 'stop',
        });
        expect(languageGenerator.generateText).toHaveBeenCalledWith(
            {
                system: 'Be concise.',
                messages: [{ role: 'user', content: 'Welcome Ada' }],
            },
            {},
        );
    });

    it('should use schema-constrained language output for object prompts', async () => {
        const definition = intelligencePrompt({
            name: 'welcome-object',
            version: 1,
            mode: 'object',
            inputSchema: z.object({ name: z.string() }),
            outputSchema: z.object({ greeting: z.string() }),
            system: () => 'Return an object.',
            messages: ({ input }) => [{ role: 'user', content: input.name }],
        });
        const { executor, languageGenerator } = createExecutor(['textInput', 'textOutput', 'structuredOutput']);

        const result = await executor.execute(definition.with({ name: 'Ada' }));

        expect(result.output).toEqual({ greeting: 'Hello Ada' });
        expect(languageGenerator.generateObject).toHaveBeenCalledWith(expect.any(Object), definition.outputSchema, {});
    });

    it('should reject invalid prompt input before a provider call', async () => {
        const definition = intelligencePrompt({
            name: 'invalid',
            version: 1,
            mode: 'text',
            inputSchema: z.object({ name: z.string() }),
            system: () => 'System',
            messages: () => [{ role: 'user', content: 'User' }],
        });
        const { executor, languageGenerator } = createExecutor();

        await expect(executor.execute(definition.with({ name: 42 } as never))).rejects.toBeInstanceOf(IntelligenceValidationError);
        expect(languageGenerator.generateText).not.toHaveBeenCalled();
    });

    it('should report invalid prompt input as an input validation failure', async () => {
        // arrange
        const definition = intelligencePrompt({
            name: 'invalid-input',
            version: 1,
            mode: 'text',
            inputSchema: z.object({ name: z.string() }),
            system: () => 'System',
            messages: () => [{ role: 'user', content: 'User' }],
        });
        const { executor } = createExecutor();

        // act
        const failure = await executor.execute(definition.with({ name: 42 } as never)).catch((error: unknown) => error);

        // assert
        expect(failure).toMatchObject({ stage: IntelligenceValidationStages.Input });
    });

    it('should report a provider answer that violates the output schema as unusable provider output', async () => {
        // arrange
        const definition = intelligencePrompt({
            name: 'invalid-output',
            version: 1,
            mode: 'object',
            inputSchema: z.object({ name: z.string() }),
            outputSchema: z.object({ greeting: z.string() }),
            system: () => 'Return an object.',
            messages: ({ input }) => [{ role: 'user', content: input.name }],
        });
        const { executor, languageGenerator } = createExecutor(['textInput', 'textOutput', 'structuredOutput']);
        languageGenerator.generateObject.mockResolvedValueOnce(createCompletion({ greeting: 42 } as never));

        // act
        const failure = await executor.execute(definition.with({ name: 'Ada' })).catch((error: unknown) => error);

        // assert
        expect(failure).toBeInstanceOf(IntelligenceValidationError);
        expect(failure).toMatchObject({ stage: IntelligenceValidationStages.Output });
    });

    it('should fail closed when structured output capability is unavailable', async () => {
        const definition = intelligencePrompt({
            name: 'unsupported',
            version: 1,
            mode: 'object',
            inputSchema: z.object({ name: z.string() }),
            outputSchema: z.object({ greeting: z.string() }),
            system: () => 'System',
            messages: () => [{ role: 'user', content: 'User' }],
        });
        const { executor, languageGenerator } = createExecutor();

        await expect(executor.execute(definition.with({ name: 'Ada' }))).rejects.toThrow('requires unresolved capabilities: structuredOutput');
        expect(languageGenerator.generateObject).not.toHaveBeenCalled();
    });

    it('should pass the usage of every provider step through to the prompt result', async () => {
        // arrange
        const definition = intelligencePrompt({
            name: 'welcome',
            version: 1,
            mode: 'text',
            inputSchema: z.object({ name: z.string() }),
            system: () => 'Be concise.',
            messages: ({ input }) => [{ role: 'user', content: `Welcome ${input.name}` }],
        });
        const { executor, languageGenerator } = createExecutor();
        const usage = createCompletion('Hello Ada').usage;
        const stepUsage = [usage, usage];
        languageGenerator.generateText.mockResolvedValueOnce({ ...createCompletion('Hello Ada'), stepUsage });

        // act
        const result = await executor.execute(definition.with({ name: 'Ada' }));

        // assert
        expect(result.stepUsage).toEqual(stepUsage);
    });
});
