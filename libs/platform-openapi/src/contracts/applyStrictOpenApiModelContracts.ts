// #region Imports

import type { Type } from '@nestjs/common';
import { DECORATORS, getSchemaPath, type OpenAPIObject } from '@nestjs/swagger';
import { getMetadataStorage } from 'class-validator';

// #endregion

// #region Constants

const COMPONENT_SCHEMA_PREFIX = '#/components/schemas/';

// #endregion

// #region Methods

/**
 * Closes selected DTO object graphs and mirrors portable class-validator constraints into OpenAPI.
 *
 * @param document - Generated OpenAPI document to synchronize.
 * @param rootModels - Root DTO models whose complete reachable graphs are strict transport contracts.
 * @internal
 */
export function applyStrictOpenApiModelContracts(document: OpenAPIObject, rootModels: ReadonlyArray<Type<unknown>>): void {
    const schemas = document.components?.schemas;

    if (!schemas || rootModels.length === 0) {
        return;
    }

    const schemaRecords = schemas as Record<string, unknown>;
    closeReachableSchemas(
        schemaRecords,
        rootModels.map((model) => getSchemaName(model)),
    );
    synchronizeOpenApiModelConstraints(schemaRecords, rootModels);
}

/** Synchronizes portable validator metadata into an already generated Swagger schema graph. */
export function synchronizeOpenApiModelConstraints(schemas: Record<string, unknown>, rootModels: ReadonlyArray<Type<unknown>>): void {
    for (const model of collectModelGraph(rootModels)) {
        synchronizeModelConstraints(schemas, model);
    }
}

function collectModelGraph(rootModels: ReadonlyArray<Type<unknown>>): ReadonlyArray<Type<unknown>> {
    const pending = [...rootModels];
    const models: Type<unknown>[] = [];
    const visited = new Set<Type<unknown>>();

    while (pending.length > 0) {
        const model = pending.shift();

        if (!model || visited.has(model)) {
            continue;
        }

        visited.add(model);
        models.push(model);

        for (const propertyName of getModelPropertyNames(model)) {
            const metadata = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, model.prototype, propertyName);

            if (!isRecord(metadata)) {
                continue;
            }

            for (const propertyModel of getPropertyModels(metadata['type'])) {
                if (!visited.has(propertyModel)) {
                    pending.push(propertyModel);
                }
            }
        }
    }

    return models;
}

function getModelPropertyNames(model: Type<unknown>): ReadonlyArray<string> {
    const propertyNames = Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES_ARRAY, model.prototype);

    if (!Array.isArray(propertyNames)) {
        return [];
    }

    return propertyNames
        .filter((propertyName): propertyName is string => typeof propertyName === 'string' && propertyName.startsWith(':'))
        .map((propertyName) => propertyName.slice(1));
}

function getPropertyModels(metadataType: unknown): ReadonlyArray<Type<unknown>> {
    const resolvedType = resolveMetadataType(metadataType);
    const candidates = Array.isArray(resolvedType) ? resolvedType.flat(Number.POSITIVE_INFINITY) : [resolvedType];

    return candidates.filter(isModelType);
}

function resolveMetadataType(metadataType: unknown): unknown {
    if (typeof metadataType !== 'function' || isModelType(metadataType)) {
        return metadataType;
    }

    return metadataType();
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

function closeReachableSchemas(schemas: Record<string, unknown>, rootSchemaNames: ReadonlyArray<string>): void {
    const pending = [...rootSchemaNames];
    const visited = new Set<string>();

    while (pending.length > 0) {
        const schemaName = pending.shift();

        if (!schemaName || visited.has(schemaName)) {
            continue;
        }

        const schema = schemas[schemaName];

        if (!isRecord(schema)) {
            throw new Error(`Strict OpenAPI model schema "${schemaName}" is missing.`);
        }

        visited.add(schemaName);
        closeSchemaObjects(schema, pending);
    }
}

function closeSchemaObjects(value: unknown, referencedSchemaNames: string[]): void {
    if (Array.isArray(value)) {
        for (const item of value) {
            closeSchemaObjects(item, referencedSchemaNames);
        }
        return;
    }

    if (!isRecord(value)) {
        return;
    }

    const reference = value['$ref'];

    if (typeof reference === 'string' && reference.startsWith(COMPONENT_SCHEMA_PREFIX)) {
        referencedSchemaNames.push(reference.slice(COMPONENT_SCHEMA_PREFIX.length));
    }

    if ((value['type'] === 'object' || isRecord(value['properties'])) && !Object.hasOwn(value, 'additionalProperties')) {
        value['additionalProperties'] = false;
    }

    for (const nestedValue of Object.values(value)) {
        closeSchemaObjects(nestedValue, referencedSchemaNames);
    }
}

function synchronizeModelConstraints(schemas: Record<string, unknown>, model: Type<unknown>): void {
    const schemaName = getSchemaName(model);
    const schema = schemas[schemaName];

    if (!isRecord(schema)) {
        throw new Error(`Strict OpenAPI model schema "${schemaName}" is missing.`);
    }

    const validationMetadata = getMetadataStorage().getTargetValidationMetadatas(model, '', true, false);

    for (const validation of validationMetadata) {
        const propertySchema = findPropertySchema(schema, validation.propertyName, schemas, new Set());

        if (!propertySchema) {
            continue;
        }

        const firstConstraint = validation.constraints?.[0];

        switch (validation.name) {
            case 'arrayMaxSize':
                setConstraint(model, validation.propertyName, propertySchema, 'maxItems', firstConstraint);
                break;
            case 'arrayMinSize':
                setConstraint(model, validation.propertyName, propertySchema, 'minItems', firstConstraint);
                break;
            case 'arrayUnique':
                setConstraint(model, validation.propertyName, propertySchema, 'uniqueItems', true);
                break;
            case 'isDateString':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'format', 'date-time');
                break;
            case 'isEmail':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'format', 'email');
                break;
            case 'isInt':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'type', 'integer');
                break;
            case 'isNumber':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'type', 'number');
                break;
            case 'isUUID':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'format', 'uuid');
                break;
            case 'isUrl':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'format', 'uri');
                break;
            case 'length':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'minLength', firstConstraint);
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'maxLength', validation.constraints?.[1]);
                break;
            case 'matches':
                if (firstConstraint instanceof RegExp) {
                    setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'pattern', firstConstraint.source);
                }
                break;
            case 'max':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'maximum', firstConstraint);
                break;
            case 'maxLength':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'maxLength', firstConstraint);
                break;
            case 'min':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'minimum', firstConstraint);
                break;
            case 'minLength':
                setConstraint(model, validation.propertyName, getValidationTarget(validation.each, propertySchema), 'minLength', firstConstraint);
                break;
        }
    }
}

function getValidationTarget(each: boolean, propertySchema: Record<string, unknown>): Record<string, unknown> {
    return each ? getArrayItemSchema(propertySchema) : propertySchema;
}

function findPropertySchema(
    schema: Record<string, unknown>,
    propertyName: string,
    schemas: Record<string, unknown>,
    visitedReferences: Set<string>,
): Record<string, unknown> | undefined {
    const properties = schema['properties'];

    if (isRecord(properties) && isRecord(properties[propertyName])) {
        return properties[propertyName];
    }

    const composedSchemas = [...readSchemaArray(schema['allOf']), ...readSchemaArray(schema['anyOf'])];

    for (const composedSchema of composedSchemas) {
        const resolved = resolveSchemaReference(composedSchema, schemas, visitedReferences);
        const propertySchema = resolved
            ? findPropertySchema(resolved, propertyName, schemas, visitedReferences)
            : findPropertySchema(composedSchema, propertyName, schemas, visitedReferences);

        if (propertySchema) {
            return propertySchema;
        }
    }

    return undefined;
}

function resolveSchemaReference(
    schema: Record<string, unknown>,
    schemas: Record<string, unknown>,
    visitedReferences: Set<string>,
): Record<string, unknown> | undefined {
    const reference = schema['$ref'];

    if (typeof reference !== 'string' || !reference.startsWith(COMPONENT_SCHEMA_PREFIX)) {
        return undefined;
    }

    const schemaName = reference.slice(COMPONENT_SCHEMA_PREFIX.length);

    if (visitedReferences.has(schemaName)) {
        return undefined;
    }

    visitedReferences.add(schemaName);
    const referencedSchema = schemas[schemaName];

    return isRecord(referencedSchema) ? referencedSchema : undefined;
}

function readSchemaArray(value: unknown): ReadonlyArray<Record<string, unknown>> {
    return Array.isArray(value) ? value.filter(isRecord) : [];
}

function getArrayItemSchema(schema: Record<string, unknown>): Record<string, unknown> {
    const items = schema['items'];

    if (!isRecord(items)) {
        throw new Error('An each:true validation constraint requires an OpenAPI array item schema.');
    }

    return items;
}

function setConstraint(model: Type<unknown>, propertyName: string, schema: Record<string, unknown>, keyword: string, value: unknown): void {
    if (value === undefined) {
        return;
    }

    const current = schema[keyword];

    if (current !== undefined && current !== value) {
        throw new Error(
            `OpenAPI constraint mismatch for ${model.name}.${propertyName}: ${keyword} is ${JSON.stringify(current)}, expected ${JSON.stringify(value)}.`,
        );
    }

    schema[keyword] = value;
}

function getSchemaName(model: Type<unknown>): string {
    const schemaPath = getSchemaPath(model);

    return schemaPath.startsWith(COMPONENT_SCHEMA_PREFIX) ? schemaPath.slice(COMPONENT_SCHEMA_PREFIX.length) : schemaPath;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// #endregion
