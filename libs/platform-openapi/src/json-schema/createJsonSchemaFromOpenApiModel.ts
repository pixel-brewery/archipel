// #region Imports

import type { Type } from '@nestjs/common';
import { DECORATORS, generateSchema, getSchemaPath } from '@nestjs/swagger';
import { synchronizeOpenApiModelConstraints } from '../contracts/applyStrictOpenApiModelContracts.js';
import { compareUnicodeCodePoints } from './compareUnicodeCodePoints.js';
import type { ICreateJsonSchemaFromOpenApiModelOptions } from './ICreateJsonSchemaFromOpenApiModelOptions.js';

// #endregion

// #region Constants

const OPENAPI_SCHEMA_REFERENCE_PREFIX = '#/components/schemas/';
const OPENAPI_COMPONENT_NAMESPACE = '__openapi_components__';
const OPENAPI_COMPONENT_POINTER_PREFIX = ['$defs', OPENAPI_COMPONENT_NAMESPACE, '$defs'] as const;
const SCHEMA_VALUE_KEYWORDS = new Set([
    'additionalProperties',
    'contains',
    'contentSchema',
    'else',
    'if',
    'items',
    'not',
    'propertyNames',
    'then',
    'unevaluatedItems',
    'unevaluatedProperties',
]);
const SCHEMA_ARRAY_KEYWORDS = new Set(['allOf', 'anyOf', 'oneOf', 'prefixItems']);
const SCHEMA_MAP_KEYWORDS = new Set(['$defs', 'definitions', 'dependentSchemas', 'patternProperties', 'properties']);
const VALID_SCHEMA_TYPES = new Set(['array', 'boolean', 'integer', 'null', 'number', 'object', 'string']);

// #endregion

// #region Types

type SchemaRecord = Record<string, unknown>;

interface IEnumSchemaOwner {
    readonly kind: 'enum';
    readonly description: string;
    readonly signature: string;
}

interface IModelSchemaOwner {
    readonly kind: 'model';
    readonly description: string;
    readonly model: Type<unknown>;
}

type SchemaOwner = IEnumSchemaOwner | IModelSchemaOwner;

// #endregion

// #region Methods

/**
 * Creates a self-contained JSON Schema from a NestJS Swagger model.
 *
 * The converter delegates DTO discovery to NestJS Swagger, keeps only the root
 * model's recursively reachable component schemas, bundles them in a reserved
 * collision-free `$defs` namespace, rebases component-local JSON Pointers, and
 * converts OpenAPI `nullable` flags into JSON Schema null unions.
 *
 * @param model - Root DTO model to convert.
 * @param options - Optional JSON Schema normalization controls.
 * @returns A provider-neutral, self-contained JSON Schema object.
 * @throws Error when the root or a referenced component is missing, a nullable
 * schema has no valid explicit sibling type, or multiple DTOs or enums claim
 * the same OpenAPI schema name.
 *
 * @public
 */
export function createJsonSchemaFromOpenApiModel(
    model: Type<unknown>,
    options: ICreateJsonSchemaFromOpenApiModelOptions = {},
): Readonly<Record<string, unknown>> {
    assertNoSchemaNameCollisions(model);

    const generated = generateSchema(model);

    assertNoSchemaNameCollisions(model);

    const schemas = generated.schemas as Record<string, unknown>;
    synchronizeOpenApiModelConstraints(schemas, [model]);
    const rootSchemaName = getOpenApiSchemaName(model);
    const rootSchema = getRequiredSchema(schemas, rootSchemaName, 'root');
    const pendingSchemaNames = new Array<string>();
    const pendingSchemaNameSet = new Set<string>();
    const bundledSchemaNames = new Set<string>();
    const definitionEntries = new Array<readonly [string, unknown]>();
    const normalizedRoot = normalizeSchema(rootSchema, options, [], (schemaName) => {
        enqueueSchemaName(schemaName, pendingSchemaNames, pendingSchemaNameSet, bundledSchemaNames);
    });

    if (!isRecord(normalizedRoot)) {
        throw new Error(`OpenAPI root schema "${rootSchemaName}" must be an object.`);
    }
    assertAvailableComponentNamespace(normalizedRoot);

    while (pendingSchemaNames.length > 0) {
        const schemaName = pendingSchemaNames.shift();
        if (!schemaName || bundledSchemaNames.has(schemaName)) {
            continue;
        }

        pendingSchemaNameSet.delete(schemaName);
        const schema = getRequiredSchema(schemas, schemaName, 'referenced');
        const normalizedSchema = normalizeSchema(schema, options, [...OPENAPI_COMPONENT_POINTER_PREFIX, schemaName], (referencedSchemaName) => {
            enqueueSchemaName(referencedSchemaName, pendingSchemaNames, pendingSchemaNameSet, bundledSchemaNames);
        });

        bundledSchemaNames.add(schemaName);
        definitionEntries.push([schemaName, normalizedSchema]);
    }

    return bundleOpenApiComponents(normalizedRoot, definitionEntries);
}

function assertAvailableComponentNamespace(rootSchema: Readonly<SchemaRecord>): void {
    const definitions = rootSchema['$defs'];
    if (isRecord(definitions) && Object.hasOwn(definitions, OPENAPI_COMPONENT_NAMESPACE)) {
        throw new Error(`OpenAPI model root schema reserves local $defs key "${OPENAPI_COMPONENT_NAMESPACE}" for bundled components.`);
    }
}

function bundleOpenApiComponents(rootSchema: Readonly<SchemaRecord>, componentEntries: ReadonlyArray<readonly [string, unknown]>): Readonly<SchemaRecord> {
    if (componentEntries.length === 0) {
        return rootSchema;
    }

    const rootDefinitions = rootSchema['$defs'];
    if (rootDefinitions !== undefined && !isRecord(rootDefinitions)) {
        throw new Error('OpenAPI model root schema $defs must be an object.');
    }

    const rootWithoutDefinitions = Object.fromEntries(Object.entries(rootSchema).filter(([key]) => key !== '$defs'));
    const sortedComponents = [...componentEntries].sort(([left], [right]) => compareUnicodeCodePoints(left, right));

    return {
        ...rootWithoutDefinitions,
        $defs: {
            ...(rootDefinitions ?? {}),
            [OPENAPI_COMPONENT_NAMESPACE]: {
                $defs: Object.fromEntries(sortedComponents),
            },
        },
    };
}

function assertNoSchemaNameCollisions(rootModel: Type<unknown>): void {
    const schemaOwners = new Map<string, SchemaOwner>();
    const pendingModels = new Array<Type<unknown>>(rootModel);
    const visitedModels = new Set<Type<unknown>>();

    while (pendingModels.length > 0) {
        const model = pendingModels.shift();
        if (!model || visitedModels.has(model)) {
            continue;
        }

        visitedModels.add(model);
        registerSchemaOwner(schemaOwners, getOpenApiSchemaName(model), {
            kind: 'model',
            description: `model "${model.name || '<anonymous>'}"`,
            model,
        });

        for (const propertyName of getModelPropertyNames(model)) {
            const metadataValue = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, model.prototype, propertyName) as unknown;
            if (!isRecord(metadataValue)) {
                continue;
            }

            registerEnumSchemaOwner(schemaOwners, model, propertyName, metadataValue);

            for (const propertyModel of getPropertyModels(metadataValue['type'])) {
                if (!visitedModels.has(propertyModel)) {
                    pendingModels.push(propertyModel);
                }
            }
        }
    }
}

function registerEnumSchemaOwner(schemaOwners: Map<string, SchemaOwner>, model: Type<unknown>, propertyName: string, metadata: Readonly<SchemaRecord>): void {
    const enumName = metadata['enumName'];
    if (typeof enumName !== 'string' || enumName.length === 0) {
        return;
    }

    registerSchemaOwner(schemaOwners, enumName, {
        kind: 'enum',
        description: `enum "${enumName}" on ${model.name || '<anonymous>'}.${propertyName}`,
        signature: createEnumSchemaSignature(metadata),
    });
}

function createEnumSchemaSignature(metadata: Readonly<SchemaRecord>): string {
    const enumSource = metadata['isArray'] === true && isRecord(metadata['items']) ? metadata['items'] : metadata;
    const enumSchema = isRecord(metadata['enumSchema']) ? metadata['enumSchema'] : {};
    const componentSchema: SchemaRecord = {
        type: enumSource['type'] ?? 'string',
        ...enumSchema,
        enum: enumSource['enum'],
        ...(metadata['x-enumNames'] !== undefined ? { 'x-enumNames': metadata['x-enumNames'] } : {}),
    };

    return JSON.stringify(canonicalizeValue(componentSchema));
}

function canonicalizeValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => canonicalizeValue(item));
    }

    if (!isRecord(value)) {
        return value;
    }

    return Object.fromEntries(
        Object.keys(value)
            .filter((key) => value[key] !== undefined)
            .sort(compareUnicodeCodePoints)
            .map((key) => [key, canonicalizeValue(value[key])]),
    );
}

function registerSchemaOwner(schemaOwners: Map<string, SchemaOwner>, schemaName: string, owner: SchemaOwner): void {
    const existingOwner = schemaOwners.get(schemaName);
    if (!existingOwner) {
        schemaOwners.set(schemaName, owner);
        return;
    }

    const isSameModel = existingOwner.kind === 'model' && owner.kind === 'model' && existingOwner.model === owner.model;
    const isSameEnum = existingOwner.kind === 'enum' && owner.kind === 'enum' && existingOwner.signature === owner.signature;
    if (isSameModel || isSameEnum) {
        return;
    }

    throw new Error(`OpenAPI schema name collision for "${schemaName}" between ${existingOwner.description} and ${owner.description}.`);
}

function getModelPropertyNames(model: Type<unknown>): ReadonlyArray<string> {
    const propertyNames = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, model.prototype) as unknown;
    if (!Array.isArray(propertyNames)) {
        return [];
    }

    return propertyNames
        .filter((propertyName): propertyName is string => typeof propertyName === 'string' && propertyName.startsWith(':'))
        .map((propertyName) => propertyName.slice(1));
}

function getPropertyModels(metadataType: unknown): ReadonlyArray<Type<unknown>> {
    const resolvedType = isLazyTypeFunction(metadataType) ? metadataType() : metadataType;
    const candidates = flattenTypeCandidates(resolvedType);

    return candidates.filter(isModelType);
}

function flattenTypeCandidates(value: unknown): ReadonlyArray<unknown> {
    if (!Array.isArray(value)) {
        return [value];
    }

    return value.flatMap((item) => flattenTypeCandidates(item));
}

function isLazyTypeFunction(value: unknown): value is () => unknown {
    return typeof value === 'function' && value.name === 'type';
}

function isModelType(value: unknown): value is Type<unknown> {
    return (
        typeof value === 'function' &&
        value !== String &&
        value !== Boolean &&
        value !== Number &&
        value !== Object &&
        value !== Array &&
        value !== Date &&
        value !== BigInt &&
        typeof value.prototype === 'object' &&
        value.prototype !== null
    );
}

function getOpenApiSchemaName(model: Type<unknown>): string {
    const schemaPath = getSchemaPath(model);
    if (!schemaPath.startsWith(OPENAPI_SCHEMA_REFERENCE_PREFIX)) {
        throw new Error(`NestJS Swagger returned an unsupported schema path for model "${model.name || '<anonymous>'}": "${schemaPath}".`);
    }

    const schemaName = schemaPath.slice(OPENAPI_SCHEMA_REFERENCE_PREFIX.length);
    if (schemaName.length === 0) {
        throw new Error(`NestJS Swagger returned an empty schema name for model "${model.name || '<anonymous>'}".`);
    }

    return schemaName;
}

function getRequiredSchema(schemas: Readonly<Record<string, unknown>>, schemaName: string, role: 'referenced' | 'root'): SchemaRecord {
    if (!Object.hasOwn(schemas, schemaName) || !isRecord(schemas[schemaName])) {
        throw new Error(`OpenAPI ${role} schema "${schemaName}" is missing.`);
    }

    return schemas[schemaName];
}

function enqueueSchemaName(
    schemaName: string,
    pendingSchemaNames: Array<string>,
    pendingSchemaNameSet: Set<string>,
    bundledSchemaNames: ReadonlySet<string>,
): void {
    if (!pendingSchemaNameSet.has(schemaName) && !bundledSchemaNames.has(schemaName)) {
        pendingSchemaNameSet.add(schemaName);
        pendingSchemaNames.push(schemaName);
    }
}

function normalizeSchema(
    value: unknown,
    options: ICreateJsonSchemaFromOpenApiModelOptions,
    localReferenceBase: ReadonlyArray<string>,
    onComponentReference: (schemaName: string) => void,
): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeSchema(item, options, localReferenceBase, onComponentReference));
    }

    if (!isRecord(value)) {
        return value;
    }

    const nullable = value['nullable'];
    if (nullable !== undefined && typeof nullable !== 'boolean') {
        throw new Error('OpenAPI schema keyword "nullable" must be a boolean.');
    }
    const normalizedEntries = new Array<readonly [string, unknown]>();

    for (const [key, entryValue] of Object.entries(value)) {
        if (key === 'nullable' || entryValue === undefined) {
            continue;
        }

        if (key === '$ref' && typeof entryValue === 'string') {
            normalizedEntries.push([key, rewriteSchemaReference(entryValue, localReferenceBase, onComponentReference)]);
            continue;
        }

        normalizedEntries.push([key, normalizeSchemaKeywordValue(key, entryValue, options, localReferenceBase, onComponentReference)]);
    }

    const normalized = Object.fromEntries(normalizedEntries) as SchemaRecord;
    if (
        options.additionalProperties === false &&
        (normalized['type'] === 'object' || isRecord(normalized['properties'])) &&
        !Object.hasOwn(normalized, 'additionalProperties')
    ) {
        normalized['additionalProperties'] = false;
    }

    if (nullable === true) {
        normalized['type'] = createNullableTypeUnion(normalized['type']);
    }

    return normalized;
}

function createNullableTypeUnion(type: unknown): ReadonlyArray<string> {
    const types = typeof type === 'string' ? [type] : type;
    if (!Array.isArray(types) || types.length === 0 || !types.every((entry) => typeof entry === 'string')) {
        throw new Error('OpenAPI nullable schemas must declare an explicit sibling type.');
    }
    if (new Set(types).size !== types.length) {
        throw new Error('OpenAPI nullable schema type arrays must contain unique values.');
    }
    for (const candidate of types) {
        if (!VALID_SCHEMA_TYPES.has(candidate)) {
            throw new Error(`OpenAPI nullable schema declares unsupported type "${candidate}".`);
        }
    }

    return [...new Set([...types, 'null'])].sort(compareUnicodeCodePoints);
}

function normalizeSchemaKeywordValue(
    keyword: string,
    value: unknown,
    options: ICreateJsonSchemaFromOpenApiModelOptions,
    localReferenceBase: ReadonlyArray<string>,
    onComponentReference: (schemaName: string) => void,
): unknown {
    if (SCHEMA_VALUE_KEYWORDS.has(keyword)) {
        return normalizeSchema(value, options, localReferenceBase, onComponentReference);
    }

    if (SCHEMA_ARRAY_KEYWORDS.has(keyword) && Array.isArray(value)) {
        return value.map((schema) => normalizeSchema(schema, options, localReferenceBase, onComponentReference));
    }

    if (SCHEMA_MAP_KEYWORDS.has(keyword) && isRecord(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([name, schema]) => [name, normalizeSchema(schema, options, localReferenceBase, onComponentReference)]),
        );
    }

    if (keyword === 'dependencies' && isRecord(value)) {
        return Object.fromEntries(
            Object.entries(value).map(([name, dependency]) => [
                name,
                Array.isArray(dependency) ? cloneValue(dependency) : normalizeSchema(dependency, options, localReferenceBase, onComponentReference),
            ]),
        );
    }

    return cloneValue(value);
}

function cloneValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => cloneValue(item));
    }

    if (isRecord(value)) {
        return Object.fromEntries(
            Object.entries(value)
                .filter(([, entryValue]) => entryValue !== undefined)
                .map(([key, entryValue]) => [key, cloneValue(entryValue)]),
        );
    }

    return value;
}

function rewriteSchemaReference(reference: string, localReferenceBase: ReadonlyArray<string>, onComponentReference: (schemaName: string) => void): string {
    const pointerTokens = parseLocalJsonPointerReference(reference);
    if (!pointerTokens) {
        return reference;
    }

    if (pointerTokens[0] !== 'components' || pointerTokens[1] !== 'schemas') {
        return createJsonPointerReference([...localReferenceBase, ...pointerTokens]);
    }

    const schemaName = pointerTokens[2];
    if (!schemaName) {
        throw new Error(`OpenAPI component reference "${reference}" has an empty schema name.`);
    }

    onComponentReference(schemaName);

    return createJsonPointerReference([...OPENAPI_COMPONENT_POINTER_PREFIX, schemaName, ...pointerTokens.slice(3)]);
}

function createJsonPointerReference(tokens: ReadonlyArray<string>): string {
    return `#${tokens.map((token) => `/${encodeUriFragmentToken(escapeJsonPointerToken(token))}`).join('')}`;
}

function decodeJsonPointerToken(token: string, reference: string): string {
    if (/~(?:[^01]|$)/u.test(token)) {
        throw new Error(`OpenAPI schema reference "${reference}" contains an invalid JSON Pointer escape.`);
    }

    return token.replaceAll('~1', '/').replaceAll('~0', '~');
}

function encodeUriFragmentToken(token: string): string {
    return encodeURIComponent(token).replace(/[!'()*]/gu, (character) => `%${character.codePointAt(0)?.toString(16).toUpperCase() ?? ''}`);
}

function escapeJsonPointerToken(value: string): string {
    return value.replaceAll('~', '~0').replaceAll('/', '~1');
}

function parseLocalJsonPointerReference(reference: string): ReadonlyArray<string> | undefined {
    if (reference === '#') {
        return [];
    }
    if (!reference.startsWith('#/')) {
        return undefined;
    }

    let decodedFragment: string;
    try {
        decodedFragment = decodeURIComponent(reference.slice(1));
    } catch {
        throw new Error(`OpenAPI schema reference "${reference}" contains invalid percent encoding.`);
    }

    return decodedFragment
        .slice(1)
        .split('/')
        .map((token) => decodeJsonPointerToken(token, reference));
}

function isRecord(value: unknown): value is SchemaRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// #endregion
