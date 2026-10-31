// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createIntelligenceJsonSchema } from '../contracts/createIntelligenceJsonSchema.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { IntelligenceValidationStages } from '../errors/IntelligenceValidationStages.js';
import { validateIntelligenceSchema } from './validateIntelligenceSchema.js';

// #endregion

describe('Intelligence schema validation', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('accepts values that satisfy a plain JSON schema', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema<{ readonly query: string }>({
            type: 'object',
            properties: { query: { type: 'string' } },
            required: ['query'],
            additionalProperties: false,
        });
        const value = { query: 'approved products' };

        // act
        const result = await validateIntelligenceSchema(schema, value, 'Search input');

        // assert
        expect(result).toBe(value);
    });

    it('rejects values with undeclared JSON schema properties', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema<{ readonly query: string }>({
            type: 'object',
            properties: { query: { type: 'string' } },
            required: ['query'],
            additionalProperties: false,
        });

        // act
        const result = validateIntelligenceSchema(schema, { query: 'products', tenantId: 42 }, 'Search input');

        // assert
        await expect(result).rejects.toThrowError(new IntelligenceValidationError('Search input validation failed: data must NOT have additional properties'));
    });

    it('enforces standard JSON schema string formats', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema<{ readonly email: string }>({
            type: 'object',
            properties: { email: { type: 'string', format: 'email' } },
            required: ['email'],
            additionalProperties: false,
        });

        // act
        const result = validateIntelligenceSchema(schema, { email: 'not-an-email' }, 'Contact input');

        // assert
        await expect(result).rejects.toThrowError(new IntelligenceValidationError('Contact input validation failed: data/email must match format "email"'));
    });

    it('delegates normalization to an explicit JSON schema validator', async () => {
        // arrange
        const validate = vi.fn(async () => ({ success: true as const, value: { query: 'normalized' } }));
        const schema = createIntelligenceJsonSchema({ type: 'object' }, validate);

        // act
        const result = await validateIntelligenceSchema(schema, { query: ' raw ' }, 'Search input');

        // assert
        expect(result).toEqual({ query: 'normalized' });
        expect(validate).toHaveBeenCalledWith({ query: ' raw ' });
    });

    it('normalizes failures from Standard Schema implementations', async () => {
        // arrange
        const schema: IIntelligenceSchema<string> = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: async () => ({ issues: [{ message: 'Expected a string.' }] }),
            },
        };

        // act
        const result = validateIntelligenceSchema(schema, 42, 'Summary input');

        // assert
        await expect(result).rejects.toThrowError(new IntelligenceValidationError('Summary input validation failed with 1 schema issue(s).'));
    });

    it('normalizes invalid JSON schema definitions', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema({ type: 'unsupported-type' });

        // act
        const result = validateIntelligenceSchema(schema, {}, 'Broken input');

        // assert
        await expect(result).rejects.toThrowError(IntelligenceValidationError);
    });

    it('reports a provider answer that violates the schema as an output failure', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema<{ readonly summary: string }>({
            type: 'object',
            properties: { summary: { type: 'string' } },
            required: ['summary'],
        });

        // act
        const result = validateIntelligenceSchema(schema, { summary: 42 }, 'Output for prompt "summary"', IntelligenceValidationStages.Output);

        // assert
        await expect(result).rejects.toMatchObject({ stage: IntelligenceValidationStages.Output });
    });

    it('reports an uncompilable schema as an input failure even while validating provider output', async () => {
        // arrange
        const schema = createIntelligenceJsonSchema({ type: 'unsupported-type' });

        // act
        const result = validateIntelligenceSchema(schema, {}, 'Output for prompt "broken"', IntelligenceValidationStages.Output);

        // assert
        await expect(result).rejects.toMatchObject({ stage: IntelligenceValidationStages.Input });
    });
});
