// #region Imports

import { HttpStatus, StandardSchemaSerializerInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import { ResponseReturn2 } from './ResponseReturn2.js';

// #endregion

// #region Tests

describe('ResponseReturn2', () => {
    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('serializes response data with its Standard Schema', async () => {
        // arrange
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-09-05T10:15:30.000Z'));
        const responseSchema = z.object({
            displayName: z.string().trim(),
        });
        const data = {
            displayName: '  Ada  ',
            passwordHash: 'must-not-leak',
        };

        // act
        const result = await ResponseReturn2.ok(responseSchema, data);

        // assert
        expect(result).toEqual({
            success: true,
            status: HttpStatus.OK,
            data: { displayName: 'Ada' },
            timestamp: '2026-09-05T10:15:30.000Z',
        });
    });

    it.each([
        ['created', HttpStatus.CREATED],
        ['accepted', HttpStatus.ACCEPTED],
    ] as const)('creates a schema-validated %s response', async (factory, status) => {
        // arrange
        const responseSchema = z.object({ id: z.string().uuid() });
        const data = { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' };

        // act
        const result = await ResponseReturn2[factory](responseSchema, data);

        // assert
        expect(result.status).toBe(status);
        expect(result.data).toEqual(data);
    });

    it('rejects response data that violates its Standard Schema', async () => {
        // arrange
        const responseSchema = z.object({ id: z.string().uuid() });

        // act
        const result = ResponseReturn2.ok(responseSchema, { id: 'not-a-uuid' });

        // assert
        await expect(result).rejects.toThrow('Response serialization failed: id: Invalid UUID');
    });

    it('returns no body for a no-content controller response', () => {
        // act
        const result = ResponseReturn2.noContent();

        // assert
        expect(result).toBeUndefined();
    });

    it('provides one schema for Nest response serialization and data filtering', async () => {
        // arrange
        const dataSchema = z.object({
            displayName: z.string().trim(),
        });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());
        const response = {
            success: true,
            status: HttpStatus.OK,
            data: {
                displayName: '  Ada  ',
                passwordHash: 'must-not-leak',
            },
            timestamp: '2026-09-05T10:15:30.000Z',
            internal: true,
        };

        // act
        const result = await interceptor.serialize(response, envelopeSchema);

        // assert
        expect(result).toEqual({
            success: true,
            status: HttpStatus.OK,
            data: { displayName: 'Ada' },
            timestamp: '2026-09-05T10:15:30.000Z',
        });
    });

    it('does not repeat a non-idempotent transform for an internally validated response', async () => {
        // arrange
        const transform = vi.fn((value: string) => `${value}-serialized`);
        const dataSchema = z.object({
            value: z.string().transform(transform),
        });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());
        const response = await ResponseReturn2.ok(dataSchema, { value: 'once' });

        // act
        const result = await interceptor.serialize(response, envelopeSchema);

        // assert
        expect(result).toEqual({
            success: true,
            status: HttpStatus.OK,
            data: { value: 'once-serialized' },
            timestamp: expect.any(String),
        });
        expect(transform).toHaveBeenCalledTimes(1);
        expect(result).toBe(response);
    });

    it('awaits an asynchronous non-idempotent transform only once for an internally validated response', async () => {
        // arrange
        type Payload = { value: string };
        const transform = vi.fn(async (value: Payload): Promise<Payload> => Promise.resolve({ value: `${value.value}-async` }));
        const jsonSchema = (): Record<string, unknown> => ({
            type: 'object',
            properties: { value: { type: 'string' } },
            required: ['value'],
        });
        const dataSchema: StandardSchemaV1<Payload, Payload> & StandardJSONSchemaV1<Payload, Payload> = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: async (value) => ({ value: await transform(value) }),
                jsonSchema: { input: jsonSchema, output: jsonSchema },
            },
        };
        const envelopeSchema = ResponseReturn2.schema(dataSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());
        const response = await ResponseReturn2.ok(dataSchema, { value: 'once' });

        // act
        const result = await interceptor.serialize(response, envelopeSchema);

        // assert
        expect(result.data).toEqual({ value: 'once-async' });
        expect(transform).toHaveBeenCalledTimes(1);
    });

    it('revalidates a helper response when the envelope uses a different schema instance', async () => {
        // arrange
        const firstTransform = vi.fn((value: string) => `${value}-first`);
        const secondTransform = vi.fn((value: string) => `${value}-second`);
        const firstSchema = z.object({ value: z.string().transform(firstTransform) });
        const structurallyEqualSchema = z.object({ value: z.string().transform(secondTransform) });
        const envelopeSchema = ResponseReturn2.schema(structurallyEqualSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());
        const response = await ResponseReturn2.ok(firstSchema, { value: 'once' });

        // act
        const result = await interceptor.serialize(response, envelopeSchema);

        // assert
        expect(result.data).toEqual({ value: 'once-first-second' });
        expect(firstTransform).toHaveBeenCalledTimes(1);
        expect(secondTransform).toHaveBeenCalledTimes(1);
        expect(result).not.toBe(response);
    });

    it('fully validates and filters a plain untrusted envelope', async () => {
        // arrange
        const transform = vi.fn((value: string) => `${value}-serialized`);
        const dataSchema = z.object({
            value: z.string().transform(transform),
        });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());
        const response = {
            success: true,
            status: HttpStatus.OK,
            data: { value: 'once', secret: 'must-not-leak' },
            timestamp: '2026-09-05T10:15:30.000Z',
            internal: true,
        };

        // act
        const result = await interceptor.serialize(response, envelopeSchema);

        // assert
        expect(result).toEqual({
            success: true,
            status: HttpStatus.OK,
            data: { value: 'once-serialized' },
            timestamp: '2026-09-05T10:15:30.000Z',
        });
        expect(transform).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['a false success flag', { success: false, status: HttpStatus.OK, data: { value: 'valid' }, timestamp: '2026-09-05T10:15:30.000Z' }],
        ['a non-success HTTP status', { success: true, status: HttpStatus.BAD_REQUEST, data: { value: 'valid' }, timestamp: '2026-09-05T10:15:30.000Z' }],
        ['a non-canonical timestamp', { success: true, status: HttpStatus.OK, data: { value: 'valid' }, timestamp: '2026-09-05 10:15:30Z' }],
        ['an impossible timestamp', { success: true, status: HttpStatus.OK, data: { value: 'valid' }, timestamp: '2026-02-30T10:15:30.000Z' }],
        ['a missing data property', { success: true, status: HttpStatus.OK, timestamp: '2026-09-05T10:15:30.000Z' }],
    ])('rejects %s in an untrusted success envelope', async (_case, response) => {
        // arrange
        const dataSchema = z.object({ value: z.string() });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);
        const interceptor = new StandardSchemaSerializerInterceptor(new Reflector());

        // act
        const result = interceptor.serialize(response, envelopeSchema);

        // assert
        await expect(result).rejects.toThrow();
    });

    it('projects a named response envelope and its data schema to OpenAPI JSON Schema', () => {
        // arrange
        const dataSchema = z
            .strictObject({
                id: z.string().uuid(),
            })
            .meta({ id: 'UserResponse' });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);

        // act
        const result = envelopeSchema['~standard'].jsonSchema.output({ target: 'openapi-3.0' });

        // assert
        expect(result).toMatchObject({
            $ref: '#/definitions/ResponseReturn2UserResponse',
            definitions: {
                UserResponse: {
                    type: 'object',
                    required: ['id'],
                    additionalProperties: false,
                },
                ResponseReturn2UserResponse: {
                    type: 'object',
                    required: ['success', 'status', 'data', 'timestamp'],
                    additionalProperties: false,
                    'x-archipel-envelope': {
                        version: 2,
                        dataProperty: 'data',
                    },
                    properties: {
                        status: { minimum: 200, maximum: 299 },
                        data: { $ref: '#/definitions/UserResponse' },
                        timestamp: {
                            format: 'date-time',
                            pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$',
                        },
                    },
                },
            },
        });
    });

    it('uses an explicit response schema identifier when supplied', () => {
        // arrange
        const dataSchema = z.object({ value: z.string() });
        const envelopeSchema = ResponseReturn2.schema(dataSchema, 'CustomEnvelope');

        // act
        const result = envelopeSchema['~standard'].jsonSchema.output({ target: 'openapi-3.0' });

        // assert
        expect(result['$ref']).toBe('#/definitions/CustomEnvelope');
        expect(result['definitions']).toHaveProperty('CustomEnvelope');
    });

    it('preserves draft 2020-12 definition semantics', () => {
        // arrange
        const dataSchema = z.object({ value: z.string() }).meta({ id: 'Payload' });
        const envelopeSchema = ResponseReturn2.schema(dataSchema);

        // act
        const result = envelopeSchema['~standard'].jsonSchema.output({ target: 'draft-2020-12' });

        // assert
        expect(result['$ref']).toBe('#/$defs/ResponseReturn2Payload');
        expect(result['$defs']).toHaveProperty('Payload');
        expect(result['$defs']).toHaveProperty('ResponseReturn2Payload');
        expect(result).not.toHaveProperty('definitions');
    });

    it('keeps distinct input and output data references in their envelope projections', () => {
        // arrange
        type Input = { raw: string };
        type Output = { value: string };
        const dataSchema: StandardSchemaV1<Input, Output> & StandardJSONSchemaV1<Input, Output> = {
            '~standard': {
                version: 1,
                vendor: 'test',
                validate: (value) => ({ value: { value: value.raw } }),
                jsonSchema: {
                    input: () => ({
                        $ref: '#/definitions/InputPayload',
                        definitions: { InputPayload: { type: 'object', properties: { raw: { type: 'string' } } } },
                    }),
                    output: () => ({
                        $ref: '#/definitions/OutputPayload',
                        definitions: { OutputPayload: { type: 'object', properties: { value: { type: 'string' } } } },
                    }),
                },
            },
        };
        const envelopeSchema = ResponseReturn2.schema(dataSchema);

        // act
        const input = envelopeSchema['~standard'].jsonSchema.input({ target: 'openapi-3.0' });
        const output = envelopeSchema['~standard'].jsonSchema.output({ target: 'openapi-3.0' });

        // assert
        expect(input).toMatchObject({
            $ref: '#/definitions/ResponseReturn2InputPayload',
            definitions: {
                ResponseReturn2InputPayload: { properties: { data: { $ref: '#/definitions/InputPayload' } } },
            },
        });
        expect(output).toMatchObject({
            $ref: '#/definitions/ResponseReturn2OutputPayload',
            definitions: {
                ResponseReturn2OutputPayload: { properties: { data: { $ref: '#/definitions/OutputPayload' } } },
            },
        });
    });
});

// #endregion
