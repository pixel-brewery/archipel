// #region Imports

import { describe, expect, it } from 'vitest';
import { createJsonSchemaFingerprint } from './createJsonSchemaFingerprint.js';

// #endregion

// #region Tests

describe('createJsonSchemaFingerprint', () => {
    it('returns the same fingerprint for semantically identical key ordering', () => {
        const left = createJsonSchemaFingerprint({
            type: 'object',
            properties: { second: { type: 'number' }, first: { type: 'string' } },
        });
        const right = createJsonSchemaFingerprint({
            properties: { first: { type: 'string' }, second: { type: 'number' } },
            type: 'object',
        });

        expect(left).toMatch(/^[a-f0-9]{64}$/u);
        expect(right).toBe(left);
    });

    it('changes when a validation constraint changes', () => {
        expect(createJsonSchemaFingerprint({ type: 'string', maxLength: 10 })).not.toBe(createJsonSchemaFingerprint({ type: 'string', maxLength: 11 }));
    });

    it('ignores annotation-only changes', () => {
        const left = createJsonSchemaFingerprint({
            type: 'string',
            maxLength: 10,
            description: 'First description',
            example: 'first@example.test',
        });
        const right = createJsonSchemaFingerprint({
            type: 'string',
            maxLength: 10,
            description: 'Second description',
            example: 'second@example.test',
        });

        expect(right).toBe(left);
    });

    it('normalizes JSON Pointer encoding and unordered validation sets', () => {
        const encoded = createJsonSchemaFingerprint({
            type: 'object',
            required: ['second', 'first'],
            properties: {
                value: { $ref: '#/%24defs/Shared%20Value' },
            },
            $defs: {
                'Shared Value': { type: 'string', enum: ['second', 'first'] },
            },
        });
        const literal = createJsonSchemaFingerprint({
            $defs: {
                'Shared Value': { enum: ['first', 'second'], type: 'string' },
            },
            properties: {
                value: { $ref: '#/$defs/Shared%20Value' },
            },
            required: ['first', 'second'],
            type: 'object',
        });

        expect(encoded).toBe(literal);
    });

    it('keeps ref siblings and normalizes order-insensitive combinators', () => {
        const left = createJsonSchemaFingerprint({
            $ref: '#/$defs/Base',
            maxLength: 20,
            allOf: [{ type: 'string', minLength: 2 }, false, { pattern: '^safe' }],
            $defs: { Base: { type: 'string' } },
        });
        const right = createJsonSchemaFingerprint({
            $defs: { Base: { type: 'string' } },
            allOf: [{ pattern: '^safe' }, { minLength: 2, type: 'string' }, false],
            maxLength: 20,
            $ref: '#/%24defs/Base',
        });

        expect(right).toBe(left);
        expect(left).not.toBe(createJsonSchemaFingerprint({ $ref: '#/$defs/Base', $defs: { Base: { type: 'string' } } }));
    });

    it('supports boolean schemas and schema-valued boolean keywords', () => {
        expect(createJsonSchemaFingerprint(true)).toBe('b5bea41b6c623f7c09f1bf24dcae58ebab3c0cdd90ad966bc43a45b44867e12b');
        expect(createJsonSchemaFingerprint({ type: 'object', additionalProperties: false })).not.toBe(
            createJsonSchemaFingerprint({ type: 'object', additionalProperties: true }),
        );
    });

    it('matches the cross-generator golden fixture for root-local definitions', () => {
        const fingerprint = createJsonSchemaFingerprint({
            $defs: {
                Local: { type: 'string', minLength: 2 },
            },
            type: 'object',
            additionalProperties: false,
            properties: {
                value: { $ref: '#/$defs/Local' },
            },
            required: ['value'],
        });

        expect(fingerprint).toBe('33bd8c718fed9847b5643e5263bbb4a6b750f2be190ce95c370a70a780ab3c79');
    });

    it('matches the cross-generator golden fixture for component subpaths and ref siblings', () => {
        const fingerprint = createJsonSchemaFingerprint({
            $ref: '#/$defs/__openapi_components__/$defs/Target/properties/code',
            type: 'string',
            maxLength: 3,
            $defs: {
                __openapi_components__: {
                    $defs: {
                        Target: {
                            type: 'object',
                            properties: {
                                code: { type: 'string', pattern: '^[A-Z]+$' },
                            },
                        },
                    },
                },
            },
        });

        expect(fingerprint).toBe('7984d8dc00d157d9afa313d5c9fb7f2d6904fe0142c865829c6cfbc8b246f863');
    });

    it('matches the cross-generator golden fixture for commutative validation collections', () => {
        const fingerprint = createJsonSchemaFingerprint({
            anyOf: [
                { type: 'number', minimum: 1 },
                { type: 'string', minLength: 2 },
            ],
            enum: ['a', 'b'],
        });

        expect(fingerprint).toBe('737d8ee27ad61599bc4f2456e6bdbea2012d460447b00457858b4133ca50ade8');
    });

    it('accepts the declared 2020-12 dialect without making it hash-relevant', () => {
        const withDialect = createJsonSchemaFingerprint({
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'string',
        });

        expect(withDialect).toBe(createJsonSchemaFingerprint({ type: 'string' }));
        expect(() => createJsonSchemaFingerprint({ $schema: 'http://json-schema.org/draft-07/schema#', type: 'string' })).toThrow('2020-12');
    });

    it('fails closed for unknown validation keywords and non-local references', () => {
        expect(() => createJsonSchemaFingerprint({ type: 'string', futureValidationKeyword: true })).toThrow('cannot be fingerprinted safely');
        expect(() => createJsonSchemaFingerprint({ $ref: 'https://schemas.example.test/value' })).toThrow('local JSON Pointers');
    });

    it('uses locale-independent code-point ordering for mixed-case schema members', () => {
        // arrange
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                alpha: { type: 'string' },
                Beta: { type: 'string' },
            },
            required: ['alpha', 'Beta'],
        } as const;

        // act
        const fingerprint = createJsonSchemaFingerprint(schema);

        // assert
        expect(fingerprint).toBe('496fb84ea87f1e63d14b7ef61d0d66bc9fb35f8929347d418c5d0294231270e0');
    });

    it('uses code-point ordering for integer-like object keys', () => {
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                '10': { type: 'string' },
                '2': { type: 'integer' },
            },
            required: ['2', '10'],
        } as const;

        expect(createJsonSchemaFingerprint(schema)).toBe('f7ef0adf4c533294344971a9600eede763323ee8452d90a40c331e45e0774948');
    });

    it('keeps mixed-case and Unicode validation collections stable across contract generators', () => {
        // arrange
        const enumValues = ['\u{10400}', '\uE000', 'ä', 'z', 'Z'] as const;
        const schema = {
            type: 'object',
            additionalProperties: false,
            properties: {
                alpha: { type: 'string' },
                Beta: { type: 'string' },
                '\u{10400}': { $ref: '#/$defs/\u{10400}NonBmpDefinition' },
                '\uE000': { $ref: '#/$defs/\uE000PrivateUseDefinition' },
                ä: { $ref: '#/$defs/äUmlautDefinition' },
                z: { $ref: '#/$defs/zLowerDefinition' },
                Z: { $ref: '#/$defs/ZUpperDefinition' },
            },
            required: ['\u{10400}', '\uE000', 'ä', 'z', 'Z', 'alpha', 'Beta'],
            dependentRequired: {
                '\u{10400}': ['\uE000', 'ä', 'z', 'Z', 'alpha', 'Beta'],
                ä: ['z', 'Z'],
                Beta: ['\u{10400}', '\uE000'],
            },
            patternProperties: {
                '^\u{10400}': { type: 'string' },
                '^\uE000': { type: 'string' },
                '^ä': { type: 'string' },
                '^z': { type: 'string' },
                '^Z': { type: 'string' },
            },
            $defs: {
                '\u{10400}NonBmpDefinition': { type: 'string', enum: enumValues },
                '\uE000PrivateUseDefinition': { type: 'string', enum: [...enumValues].reverse() },
                äUmlautDefinition: { type: 'string', enum: enumValues },
                zLowerDefinition: { type: 'string', enum: [...enumValues].reverse() },
                ZUpperDefinition: { type: 'string', enum: enumValues },
            },
        } as const;

        // act
        const fingerprint = createJsonSchemaFingerprint(schema);

        // assert
        expect(fingerprint).toBe('addb1fe2db3806d95b09598c178ab2edddce9e3fabf2882a6a5c690179e5bb1e');
    });

    it('rejects non-JSON schema values', () => {
        expect(() => createJsonSchemaFingerprint({ type: 'string', invalid: BigInt(1) })).toThrow('JSON-compatible');
    });

    it('rejects numeric constraints that violate the JSON Schema 2020-12 metaschema', () => {
        expect(() => createJsonSchemaFingerprint({ type: 'string', minLength: -1 })).toThrow('must be a non-negative integer');
        expect(() => createJsonSchemaFingerprint({ type: 'array', maxItems: 1.5 })).toThrow('must be a non-negative integer');
        expect(() => createJsonSchemaFingerprint({ type: 'number', multipleOf: 0 })).toThrow('must be a positive finite number');
    });

    it('rejects invalid type, enum, and schema-array collections', () => {
        expect(() => createJsonSchemaFingerprint({ type: 'date' })).toThrow('Unsupported JSON Schema type');
        expect(() => createJsonSchemaFingerprint({ enum: [] })).toThrow('non-empty array');
        expect(() => createJsonSchemaFingerprint({ enum: ['same', 'same'] })).toThrow('unique values');
        expect(() => createJsonSchemaFingerprint({ anyOf: [] })).toThrow('non-empty array');
        expect(() => createJsonSchemaFingerprint({ required: ['value', 'value'] })).toThrow('unique values');
    });
});

// #endregion
