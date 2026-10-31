import { describe, expect, it } from 'vitest';
import { pipe, pipeAll } from './pipe.js';

describe('pipe operators', () => {
    it('executes a single operator with pipe', () => {
        const delegate = { value: 42 };
        const result = pipe(delegate, (input) => input.value + 1);
        expect(result).toBe(43);
    });

    it('executes operators in order with pipeAll', async () => {
        const calls: Array<string> = [];
        const delegate = { name: 'delegate' };

        const result = await pipeAll<{ name: string }, number>(
            delegate,
            (input) => {
                calls.push(`first:${input.name}`);
                return 1;
            },
            async (input) => {
                calls.push(`second:${input.name}`);
                return 2;
            },
            () => 3,
        );

        expect(calls).toEqual(['first:delegate', 'second:delegate']);
        expect(result).toBe(3);
    });
});
