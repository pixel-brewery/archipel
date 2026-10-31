// #region Imports

import { Ajv, type ValidateFunction } from 'ajv';
import ajvFormatsModule, { type FormatsPlugin } from 'ajv-formats';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { type IntelligenceValidationStage } from '../errors/IntelligenceValidationStage.js';
import { IntelligenceValidationStages } from '../errors/IntelligenceValidationStages.js';

// #endregion

// #region Fields

const JSON_SCHEMA_VALIDATOR = new Ajv({ allErrors: true, strict: false });
const ADD_JSON_SCHEMA_FORMATS = ajvFormatsModule as unknown as FormatsPlugin;
ADD_JSON_SCHEMA_FORMATS(JSON_SCHEMA_VALIDATOR);
const JSON_SCHEMA_VALIDATORS = new WeakMap<Readonly<Record<string, unknown>>, ValidateFunction<unknown>>();

// #endregion

/**
 * Validates a value through an Archipel schema without exposing the underlying schema library.
 *
 * Plain JSON schemas are compiled and cached by object identity. Schemas with
 * an explicit validator and Standard Schema implementations retain ownership
 * of their validation and normalization behavior.
 *
 * A value that does not satisfy the schema fails in the given `stage`: pass
 * `output` when the value is a provider answer, so the failure is reported as
 * unusable provider output instead of an invalid request. A schema that
 * cannot be compiled is always an `input` failure, because the application
 * defined it.
 *
 * @param schema - Provider-neutral Archipel schema.
 * @param value - Untrusted value to validate and normalize.
 * @param label - Context label included in normalized validation errors.
 * @param stage - Which side of the provider call the value belongs to. Defaults to `input`.
 * @returns The validated and normalized value.
 * @throws {IntelligenceValidationError} When the schema is invalid or the value does not satisfy it.
 * @public
 */
export async function validateIntelligenceSchema<T>(
    schema: IIntelligenceSchema<T>,
    value: unknown,
    label: string,
    stage: IntelligenceValidationStage = IntelligenceValidationStages.Input,
): Promise<T> {
    if ('kind' in schema) {
        if (schema.validate) {
            const result = await schema.validate(value);
            if (!result.success) {
                throw new IntelligenceValidationError(`${label} validation failed: ${result.error.message}`, stage);
            }

            return result.value;
        }

        return validateJsonSchema(schema.jsonSchema, value, label, stage);
    }

    const result = await schema['~standard'].validate(value);
    if (result.issues) {
        throw new IntelligenceValidationError(`${label} validation failed with ${result.issues.length} schema issue(s).`, stage);
    }

    return result.value;
}

function validateJsonSchema<T>(schema: Readonly<Record<string, unknown>>, value: unknown, label: string, stage: IntelligenceValidationStage): T {
    const validator = getJsonSchemaValidator<T>(schema, label);
    if (!validator(value)) {
        const details = JSON_SCHEMA_VALIDATOR.errorsText(validator.errors, { separator: '; ' });
        throw new IntelligenceValidationError(`${label} validation failed: ${details}`, stage);
    }

    return value;
}

function getJsonSchemaValidator<T>(schema: Readonly<Record<string, unknown>>, label: string): ValidateFunction<T> {
    const cached = JSON_SCHEMA_VALIDATORS.get(schema);
    if (cached) {
        return cached as ValidateFunction<T>;
    }

    try {
        const validator = JSON_SCHEMA_VALIDATOR.compile<T>(schema);
        JSON_SCHEMA_VALIDATORS.set(schema, validator);

        return validator;
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown JSON Schema compilation error.';
        throw new IntelligenceValidationError(`${label} schema is invalid: ${message}`);
    }
}
