// #region Imports

import { z } from 'zod';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { intelligencePrompt } from './intelligencePrompt.js';

// #endregion

describe('intelligence prompts', () => {
    // #region Methods

    it('should create an immutable object prompt invocation with typed input, output, and metadata', () => {
        // arrange
        const definition = intelligencePrompt({
            name: 'catalog.product.analysis',
            version: 1,
            mode: 'object',
            inputSchema: z.object({ productId: z.number() }),
            outputSchema: z.object({ status: z.enum(['READY', 'ATTENTION']) }),
            system: ({ input }) => `Analyze product ${input.productId}.`,
            messages: ({ input }) => [{ role: 'user', content: JSON.stringify(input) }],
        });

        // act
        const invocation = definition.with({ productId: 42 }, { coverage: 'FULL' as const });

        // assert
        expect(invocation.definition).toBe(definition);
        expect(invocation.input).toEqual({ productId: 42 });
        expect(invocation.metadata).toEqual({ coverage: 'FULL' });
        expect(Object.isFrozen(definition)).toBe(true);
        expect(Object.isFrozen(invocation)).toBe(true);
        expectTypeOf(invocation.input).toEqualTypeOf<Readonly<{ productId: number }>>();
        expectTypeOf(invocation.metadata).toEqualTypeOf<{ coverage: 'FULL' } | undefined>();
    });

    it('should reject an output schema on text prompt definitions at compile time', () => {
        // arrange
        const inputSchema = z.object({ query: z.string() });

        // act
        const createDefinition = (): void => {
            intelligencePrompt({
                name: 'assistant.search',
                version: 1,
                mode: 'text',
                inputSchema,
                // @ts-expect-error Text prompts do not accept an output schema.
                outputSchema: z.object({ answer: z.string() }),
                system: () => 'Answer accurately.',
                messages: ({ input }) => [{ role: 'user', content: input.query }],
            });
        };

        // assert
        expect(createDefinition).toBeTypeOf('function');
    });

    // #endregion
});
