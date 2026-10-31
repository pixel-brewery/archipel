// #region Imports

import { createHash } from 'node:crypto';
import { compareUnicodeCodePoints } from './compareUnicodeCodePoints.js';

// #endregion

// #region Constants

const ANNOTATION_KEYS = new Set([
    '$comment',
    'default',
    'deprecated',
    'description',
    'discriminator',
    'example',
    'examples',
    'externalDocs',
    'readOnly',
    'title',
    'writeOnly',
    'xml',
]);
const COMBINATOR_SCHEMA_KEYS = ['allOf', 'anyOf', 'oneOf'] as const;
const MAP_SCHEMA_KEYS = ['$defs', 'dependentSchemas', 'patternProperties', 'properties'] as const;
const NUMBER_KEYS = ['maximum', 'minimum'] as const;
const NON_NEGATIVE_INTEGER_KEYS = ['maxContains', 'maxItems', 'maxLength', 'maxProperties', 'minContains', 'minItems', 'minLength', 'minProperties'] as const;
const ORDERED_SCHEMA_ARRAY_KEYS = ['prefixItems'] as const;
const SCHEMA_VALUE_KEYS = [
    'additionalProperties',
    'contains',
    'contentSchema',
    'else',
    'if',
    'not',
    'propertyNames',
    'then',
    'unevaluatedItems',
    'unevaluatedProperties',
] as const;
const STRING_KEYS = ['contentEncoding', 'contentMediaType', 'format', 'pattern'] as const;
const VALID_TYPES = new Set(['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']);
const SUPPORTED_SCHEMA_KEYWORDS = new Set([
    '$defs',
    '$ref',
    '$schema',
    'additionalProperties',
    'allOf',
    'anyOf',
    'const',
    'contains',
    'contentEncoding',
    'contentMediaType',
    'contentSchema',
    'dependentRequired',
    'dependentSchemas',
    'else',
    'enum',
    'exclusiveMaximum',
    'exclusiveMinimum',
    'format',
    'if',
    'items',
    'maxContains',
    'maxItems',
    'maxLength',
    'maxProperties',
    'maximum',
    'minContains',
    'minItems',
    'minLength',
    'minProperties',
    'minimum',
    'multipleOf',
    'not',
    'nullable',
    'oneOf',
    'pattern',
    'patternProperties',
    'prefixItems',
    'properties',
    'propertyNames',
    'required',
    'then',
    'type',
    'unevaluatedItems',
    'unevaluatedProperties',
    'uniqueItems',
]);
const JSON_SCHEMA_2020_12_DIALECT = 'https://json-schema.org/draft/2020-12/schema';

// #endregion

// #region Types

type JsonPrimitive = boolean | null | number | string;

interface IJsonObject {
    readonly [key: string]: JsonValue;
}

type JsonValue = IJsonObject | JsonPrimitive | readonly JsonValue[];
type JsonSchema = boolean | Readonly<Record<string, unknown>>;

// #endregion

// #region Methods

/**
 * Creates a versioned, stable SHA-256 fingerprint for a JSON Schema document.
 *
 * The fingerprint represents validation semantics rather than annotations.
 * Known annotations and OpenAPI vendor extensions are removed, validation
 * collections are normalized deterministically, local JSON Pointer references
 * are canonicalized, and OpenAPI 3.0 compatibility keywords are translated.
 * Unknown keywords fail closed so a new validation rule can never disappear
 * silently from the fingerprint.
 *
 * Pair the returned value with `JSON_SCHEMA_FINGERPRINT_ALGORITHM`. Consumers
 * must reject fingerprints carrying a different algorithm identifier.
 *
 * @param schema - Self-contained JSON Schema 2020-12 document.
 * @returns Lowercase hexadecimal SHA-256 fingerprint.
 * @public
 */
export function createJsonSchemaFingerprint(schema: JsonSchema): string {
    canonicalizeJsonValue(schema);
    const normalized = normalizeValidationSchema(schema);
    const canonical = serializeCanonicalJson(canonicalizeJsonValue(normalized));

    return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

function assertKnownKeywords(source: Readonly<Record<string, unknown>>): void {
    for (const key of Object.keys(source)) {
        if (!SUPPORTED_SCHEMA_KEYWORDS.has(key) && !ANNOTATION_KEYS.has(key) && !key.startsWith('x-')) {
            throw new TypeError(`Unsupported JSON Schema keyword "${key}" cannot be fingerprinted safely.`);
        }
    }
}

function canonicalizeJsonValue(value: unknown): JsonValue {
    if (value === null || typeof value === 'string' || typeof value === 'boolean' || (typeof value === 'number' && Number.isFinite(value))) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => canonicalizeJsonValue(item));
    }

    if (isRecord(value)) {
        return Object.fromEntries(
            Object.keys(value)
                .sort(compareUnicodeCodePoints)
                .map((key) => [key, canonicalizeJsonValue(value[key])]),
        );
    }

    throw new TypeError('JSON Schema fingerprints require JSON-compatible values.');
}

function canonicalizeReference(reference: string): string {
    if (reference === '#') {
        return reference;
    }
    if (!reference.startsWith('#/')) {
        throw new TypeError(`JSON Schema fingerprint references must be local JSON Pointers: "${reference}".`);
    }

    let decodedFragment: string;
    try {
        decodedFragment = decodeURIComponent(reference.slice(1));
    } catch {
        throw new TypeError(`JSON Schema reference contains invalid percent encoding: "${reference}".`);
    }

    if (!decodedFragment.startsWith('/')) {
        throw new TypeError(`JSON Schema reference is not a JSON Pointer: "${reference}".`);
    }

    const tokens = decodedFragment
        .slice(1)
        .split('/')
        .map((token) => decodeJsonPointerToken(token, reference));

    return createJsonPointerReference(tokens);
}

function copyCombinatorSchemas(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of COMBINATOR_SCHEMA_KEYS) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }

        const schemas = normalizeSchemaArray(source[key], key);
        target[key] = sortJsonValues(schemas);
    }
}

function copyConst(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (Object.hasOwn(source, 'const')) {
        target['const'] = canonicalizeJsonValue(source['const']);
    }
}

function copyDependentRequired(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, 'dependentRequired')) {
        return;
    }

    const value = source['dependentRequired'];
    if (!isRecord(value)) {
        throw new TypeError('JSON Schema keyword "dependentRequired" must be an object.');
    }

    target['dependentRequired'] = Object.fromEntries(
        Object.keys(value)
            .sort(compareUnicodeCodePoints)
            .map((key) => [key, normalizeStringSet(value[key], `dependentRequired.${key}`)]),
    );
}

function copyEnum(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, 'enum')) {
        return;
    }
    if (!Array.isArray(source['enum']) || source['enum'].length === 0) {
        throw new TypeError('JSON Schema keyword "enum" must be a non-empty array.');
    }

    const values = source['enum'].map((value) => canonicalizeJsonValue(value));
    if (new Set(values.map((value) => serializeCanonicalJson(value))).size !== values.length) {
        throw new TypeError('JSON Schema keyword "enum" must contain unique values.');
    }
    target['enum'] = sortJsonValues(values);
}

function copyExclusiveBounds(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    copyExclusiveBound(source, target, 'exclusiveMaximum', 'maximum');
    copyExclusiveBound(source, target, 'exclusiveMinimum', 'minimum');
}

function copyExclusiveBound(
    source: Readonly<Record<string, unknown>>,
    target: Record<string, JsonValue>,
    exclusiveKey: 'exclusiveMaximum' | 'exclusiveMinimum',
    inclusiveKey: 'maximum' | 'minimum',
): void {
    if (!Object.hasOwn(source, exclusiveKey)) {
        return;
    }

    const value = source[exclusiveKey];
    if (typeof value === 'number' && Number.isFinite(value)) {
        target[exclusiveKey] = value;
        return;
    }
    if (typeof value !== 'boolean') {
        throw new TypeError(`JSON Schema keyword "${exclusiveKey}" must be a finite number.`);
    }
    if (!value) {
        return;
    }

    const inclusiveValue = source[inclusiveKey];
    if (typeof inclusiveValue !== 'number' || !Number.isFinite(inclusiveValue)) {
        throw new TypeError(`OpenAPI boolean "${exclusiveKey}" requires a finite "${inclusiveKey}".`);
    }
    target[exclusiveKey] = inclusiveValue;
    delete target[inclusiveKey];
}

function copyItems(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, 'items')) {
        return;
    }

    const value = source['items'];
    target['items'] = Array.isArray(value) ? normalizeSchemaArray(value, 'items') : normalizeValidationSchema(value);
}

function copyMapSchemas(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of MAP_SCHEMA_KEYS) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }

        const value = source[key];
        if (!isRecord(value)) {
            throw new TypeError(`JSON Schema keyword "${key}" must be an object.`);
        }

        target[key] = Object.fromEntries(
            Object.keys(value)
                .sort(compareUnicodeCodePoints)
                .map((name) => [name, normalizeValidationSchema(value[name])]),
        );
    }
}

function copyNumberValues(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of NUMBER_KEYS) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }

        const value = source[key];
        if (typeof value !== 'number' || !Number.isFinite(value)) {
            throw new TypeError(`JSON Schema keyword "${key}" must be a finite number.`);
        }
        target[key] = value;
    }

    for (const key of NON_NEGATIVE_INTEGER_KEYS) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }
        const value = source[key];
        if (typeof value !== 'number' || !Number.isInteger(value) || value < 0) {
            throw new TypeError(`JSON Schema keyword "${key}" must be a non-negative integer.`);
        }
        target[key] = value;
    }

    if (Object.hasOwn(source, 'multipleOf')) {
        const multipleOf = source['multipleOf'];
        if (typeof multipleOf !== 'number' || !Number.isFinite(multipleOf) || multipleOf <= 0) {
            throw new TypeError('JSON Schema keyword "multipleOf" must be a positive finite number.');
        }
        target['multipleOf'] = multipleOf;
    }
}

function copyOrderedSchemaArrays(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of ORDERED_SCHEMA_ARRAY_KEYS) {
        if (Object.hasOwn(source, key)) {
            target[key] = normalizeSchemaArray(source[key], key);
        }
    }
}

function copyReference(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, '$ref')) {
        return;
    }
    if (typeof source['$ref'] !== 'string') {
        throw new TypeError('JSON Schema keyword "$ref" must be a string.');
    }

    target['$ref'] = canonicalizeReference(source['$ref']);
}

function copyRequired(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (Object.hasOwn(source, 'required')) {
        target['required'] = normalizeStringSet(source['required'], 'required');
    }
}

function copySchemaValues(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of SCHEMA_VALUE_KEYS) {
        if (Object.hasOwn(source, key)) {
            target[key] = normalizeValidationSchema(source[key]);
        }
    }
}

function copyStringValues(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    for (const key of STRING_KEYS) {
        if (!Object.hasOwn(source, key)) {
            continue;
        }
        if (typeof source[key] !== 'string') {
            throw new TypeError(`JSON Schema keyword "${key}" must be a string.`);
        }
        target[key] = source[key];
    }
}

function copyType(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, 'type')) {
        return;
    }

    const value = source['type'];
    if (typeof value === 'string') {
        assertValidType(value);
        target['type'] = value;
        return;
    }
    const types = normalizeStringSet(value, 'type', false);
    for (const type of types) {
        assertValidType(type);
    }
    if (types.length === 0) {
        throw new TypeError('JSON Schema keyword "type" must not be empty.');
    }
    target['type'] = types;
}

function copyUniqueItems(source: Readonly<Record<string, unknown>>, target: Record<string, JsonValue>): void {
    if (!Object.hasOwn(source, 'uniqueItems')) {
        return;
    }
    if (typeof source['uniqueItems'] !== 'boolean') {
        throw new TypeError('JSON Schema keyword "uniqueItems" must be a boolean.');
    }
    target['uniqueItems'] = source['uniqueItems'];
}

function createJsonPointerReference(tokens: ReadonlyArray<string>): string {
    return `#${tokens.map((token) => `/${encodeUriFragmentToken(escapeJsonPointerToken(token))}`).join('')}`;
}

function decodeJsonPointerToken(token: string, reference: string): string {
    if (/~(?:[^01]|$)/u.test(token)) {
        throw new TypeError(`JSON Schema reference contains an invalid JSON Pointer escape: "${reference}".`);
    }

    return token.replaceAll('~1', '/').replaceAll('~0', '~');
}

function encodeUriFragmentToken(token: string): string {
    return encodeURIComponent(token).replace(/[!'()*]/gu, (character) => `%${character.codePointAt(0)?.toString(16).toUpperCase() ?? ''}`);
}

function escapeJsonPointerToken(token: string): string {
    return token.replaceAll('~', '~0').replaceAll('/', '~1');
}

function normalizeDialect(source: Readonly<Record<string, unknown>>): void {
    if (!Object.hasOwn(source, '$schema')) {
        return;
    }
    if (source['$schema'] !== JSON_SCHEMA_2020_12_DIALECT) {
        throw new TypeError(`Only the JSON Schema 2020-12 dialect can be fingerprinted; received "${String(source['$schema'])}".`);
    }
}

function normalizeSchemaArray(value: unknown, keyword: string): ReadonlyArray<JsonValue> {
    if (!Array.isArray(value) || value.length === 0) {
        throw new TypeError(`JSON Schema keyword "${keyword}" must be a non-empty array.`);
    }

    return value.map((schema) => normalizeValidationSchema(schema));
}

function normalizeStringSet(value: unknown, keyword: string, allowEmpty = true): ReadonlyArray<string> {
    if (!Array.isArray(value) || !value.every((entry) => typeof entry === 'string')) {
        throw new TypeError(`JSON Schema keyword "${keyword}" must be an array of strings.`);
    }
    if ((!allowEmpty && value.length === 0) || new Set(value).size !== value.length) {
        throw new TypeError(`JSON Schema keyword "${keyword}" must contain unique values${allowEmpty ? '' : ' and must not be empty'}.`);
    }

    return [...value].sort(compareUnicodeCodePoints);
}

function assertValidType(value: string): void {
    if (!VALID_TYPES.has(value)) {
        throw new TypeError(`Unsupported JSON Schema type "${value}" cannot be fingerprinted safely.`);
    }
}

function normalizeValidationSchema(source: unknown): JsonValue {
    if (typeof source === 'boolean') {
        return source;
    }
    if (!isRecord(source)) {
        throw new TypeError('JSON Schema values must be booleans or objects.');
    }

    assertKnownKeywords(source);
    normalizeDialect(source);
    const result: Record<string, JsonValue> = {};

    copyReference(source, result);
    copyType(source, result);
    copyEnum(source, result);
    copyConst(source, result);
    copyNumberValues(source, result);
    copyExclusiveBounds(source, result);
    copyStringValues(source, result);
    copyUniqueItems(source, result);
    copyRequired(source, result);
    copyDependentRequired(source, result);
    copySchemaValues(source, result);
    copyItems(source, result);
    copyCombinatorSchemas(source, result);
    copyOrderedSchemaArrays(source, result);
    copyMapSchemas(source, result);

    const nullable = source['nullable'];
    if (nullable !== undefined && typeof nullable !== 'boolean') {
        throw new TypeError('OpenAPI keyword "nullable" must be a boolean.');
    }

    return nullable === true ? { anyOf: sortJsonValues([result, { type: 'null' }]) } : result;
}

function sortJsonValues(values: ReadonlyArray<JsonValue>): ReadonlyArray<JsonValue> {
    return [...values].sort((left, right) =>
        compareUnicodeCodePoints(serializeCanonicalJson(canonicalizeJsonValue(left)), serializeCanonicalJson(canonicalizeJsonValue(right))),
    );
}

function serializeCanonicalJson(value: JsonValue): string {
    if (Array.isArray(value)) {
        return `[${value.map((item) => serializeCanonicalJson(item)).join(',')}]`;
    }
    if (isRecord(value)) {
        const members = Object.keys(value)
            .sort(compareUnicodeCodePoints)
            .map((key) => `${JSON.stringify(key)}:${serializeCanonicalJson(canonicalizeJsonValue(value[key]))}`);

        return `{${members.join(',')}}`;
    }

    return JSON.stringify(value);
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        return false;
    }

    const prototype = Object.getPrototypeOf(value) as unknown;
    return prototype === Object.prototype || prototype === null;
}

// #endregion
