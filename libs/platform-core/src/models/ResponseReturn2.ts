// #region Imports

import type { StandardJSONSchemaV1, StandardSchemaV1 } from '@standard-schema/spec';
import { HttpStatus } from '@nestjs/common';

// #endregion

type ResponseSchema2<TInput, TOutput> = StandardSchemaV1<ResponseReturn2<TInput>, ResponseReturn2<TOutput>> &
    StandardJSONSchemaV1<ResponseReturn2<TInput>, ResponseReturn2<TOutput>>;

type DataSchema2<TInput, TOutput> = StandardSchemaV1<TInput, TOutput> & StandardJSONSchemaV1<TInput, TOutput>;

type DefinitionKeyword = '$defs' | 'definitions';

const validatedResponseSchemas = new WeakMap<object, object>();

/**
 * Schema-native success response envelope for NestJS 12 applications.
 *
 * Unlike {@link ResponseReturnBase}, this version validates and transforms response
 * data with a Standard Schema instead of a class constructor. Use
 * {@link ResponseReturn2.schema} as the schema for Nest response
 * serialization. OpenAPI must publish the complete envelope schema; its
 * `x-archipel-envelope` metadata allows compatible generators to recognize and
 * unwrap `data` explicitly.
 *
 * @public
 */
export class ResponseReturn2<T> {
    // #region Ctor

    private constructor(status: number, data: T, timestamp = new Date().toISOString(), dataSchema?: StandardSchemaV1) {
        this.success = true;
        this.status = status;
        this.data = data;
        this.timestamp = timestamp;

        if (dataSchema) {
            validatedResponseSchemas.set(this, dataSchema);
        }

        Object.freeze(this);
    }

    // #endregion

    // #region Properties

    /** Indicates that the request was successful. */
    public readonly success: true;

    /** HTTP status code of the response. */
    public readonly status: number;

    /** Schema-validated response payload. */
    public readonly data: T;

    /** Server-side timestamp in ISO 8601 format. */
    public readonly timestamp: string;

    // #endregion

    // #region Methods

    /**
     * Creates a successful response after validating and transforming its data.
     *
     * @param dataSchema Standard Schema used to serialize the response data.
     * @param data Response data accepted by the schema.
     * @param validateOptions Optional vendor-specific Standard Schema options.
     * @remarks The controller's HTTP status metadata must also resolve to 200.
     */
    public static async ok<TInput, TOutput>(
        dataSchema: StandardSchemaV1<TInput, TOutput>,
        data: TInput,
        validateOptions?: StandardSchemaV1.Options,
    ): Promise<ResponseReturn2<TOutput>> {
        return this.makeSuccess(HttpStatus.OK, dataSchema, data, validateOptions);
    }

    /**
     * Creates a resource-created response after validating and transforming its data.
     *
     * @param dataSchema Standard Schema used to serialize the response data.
     * @param data Response data accepted by the schema.
     * @param validateOptions Optional vendor-specific Standard Schema options.
     * @remarks The controller's HTTP status metadata must also resolve to 201.
     */
    public static async created<TInput, TOutput>(
        dataSchema: StandardSchemaV1<TInput, TOutput>,
        data: TInput,
        validateOptions?: StandardSchemaV1.Options,
    ): Promise<ResponseReturn2<TOutput>> {
        return this.makeSuccess(HttpStatus.CREATED, dataSchema, data, validateOptions);
    }

    /**
     * Creates an accepted response after validating and transforming its data.
     *
     * @param dataSchema Standard Schema used to serialize the response data.
     * @param data Response data accepted by the schema.
     * @param validateOptions Optional vendor-specific Standard Schema options.
     * @remarks The controller must declare `@HttpCode(HttpStatus.ACCEPTED)`.
     */
    public static async accepted<TInput, TOutput>(
        dataSchema: StandardSchemaV1<TInput, TOutput>,
        data: TInput,
        validateOptions?: StandardSchemaV1.Options,
    ): Promise<ResponseReturn2<TOutput>> {
        return this.makeSuccess(HttpStatus.ACCEPTED, dataSchema, data, validateOptions);
    }

    /**
     * Returns the bodyless value for a 204 controller response.
     *
     * Controllers must also use `@HttpCode(HttpStatus.NO_CONTENT)`. Do not
     * attach a response serializer schema to a 204 response because it has no
     * representation body.
     */
    public static noContent(): undefined {
        return undefined;
    }

    /**
     * Creates the full response-envelope Standard Schema for runtime
     * serialization and OpenAPI output.
     *
     * The data schema must implement both Standard Schema and Standard JSON
     * Schema. Zod 4 schemas satisfy both contracts. A named data schema produces
     * a named `ResponseReturn2...` OpenAPI component automatically. Publish
     * this complete schema to OpenAPI because it describes the actual wire body.
     *
     * @param dataSchema Schema for the envelope's `data` property.
     * @param id Optional explicit OpenAPI component identifier for the envelope.
     */
    public static schema<TInput, TOutput>(dataSchema: DataSchema2<TInput, TOutput>, id?: string): ResponseSchema2<TInput, TOutput> {
        return {
            '~standard': {
                version: 1,
                vendor: 'archipel',
                validate: (value, options) => this.validateEnvelope(value, dataSchema, options),
                jsonSchema: {
                    input: (options) => this.createJsonSchema(dataSchema, 'input', options, id),
                    output: (options) => this.createJsonSchema(dataSchema, 'output', options, id),
                },
            },
        };
    }

    private static async makeSuccess<TInput, TOutput>(
        status: number,
        dataSchema: StandardSchemaV1<TInput, TOutput>,
        data: TInput,
        validateOptions?: StandardSchemaV1.Options,
    ): Promise<ResponseReturn2<TOutput>> {
        const result = await dataSchema['~standard'].validate(data, validateOptions);

        if (result.issues) {
            throw new TypeError(`Response serialization failed: ${formatIssues(result.issues)}`);
        }

        return new ResponseReturn2(status, result.value, undefined, dataSchema);
    }

    private static async validateEnvelope<TInput, TOutput>(
        value: unknown,
        dataSchema: DataSchema2<TInput, TOutput>,
        validateOptions?: StandardSchemaV1.Options,
    ): Promise<StandardSchemaV1.Result<ResponseReturn2<TOutput>>> {
        if (!isRecord(value)) {
            return { issues: [{ message: 'Response must be an object.' }] };
        }

        const issues: StandardSchemaV1.Issue[] = [];
        const status = value['status'];
        const timestamp = value['timestamp'];

        if (value['success'] !== true) {
            issues.push({ message: 'Success must be true.', path: ['success'] });
        }

        if (typeof status !== 'number' || !Number.isInteger(status) || status < 200 || status > 299) {
            issues.push({ message: 'Status must be an integer between 200 and 299.', path: ['status'] });
        }

        if (!isCanonicalIsoTimestamp(timestamp)) {
            issues.push({ message: 'Timestamp must be a canonical ISO 8601 UTC date-time string.', path: ['timestamp'] });
        }

        if (!Object.hasOwn(value, 'data')) {
            issues.push({ message: 'Data is required.', path: ['data'] });
        }

        if (issues.length > 0) {
            return { issues };
        }

        if (isValidatedResponseFor<TOutput>(value, dataSchema)) {
            return { value };
        }

        const dataResult = await dataSchema['~standard'].validate(value['data'], validateOptions);

        if (dataResult.issues) {
            return {
                issues: dataResult.issues.map((issue) => ({
                    ...issue,
                    path: ['data', ...(issue.path ?? [])],
                })),
            };
        }

        return {
            value: new ResponseReturn2(status as number, dataResult.value, timestamp as string, dataSchema),
        };
    }

    private static createJsonSchema<TInput, TOutput>(
        dataSchema: DataSchema2<TInput, TOutput>,
        schemaType: 'input' | 'output',
        options: StandardJSONSchemaV1.Options,
        id?: string,
    ): Record<string, unknown> {
        const convertedDataSchema = dataSchema['~standard'].jsonSchema[schemaType](options);
        const definitionKeyword: DefinitionKeyword = options.target === 'draft-2020-12' ? '$defs' : 'definitions';
        const { definitions, rootSchema } = normalizeJsonSchema(convertedDataSchema, definitionKeyword);
        const dataSchemaId = getReferenceId(rootSchema['$ref'], definitionKeyword);
        const responseSchemaId = id ?? (dataSchemaId ? `ResponseReturn2${dataSchemaId}` : undefined);
        const envelopeSchema: Record<string, unknown> = {
            type: 'object',
            description: 'Schema-validated Archipel success response envelope.',
            'x-archipel-envelope': {
                version: 2,
                dataProperty: 'data',
            },
            properties: {
                success: {
                    type: 'boolean',
                    enum: [true],
                    description: 'Indicates that the request was successful.',
                },
                status: {
                    type: 'integer',
                    minimum: 200,
                    maximum: 299,
                    description: 'HTTP status code of the response.',
                },
                data: rootSchema,
                timestamp: {
                    type: 'string',
                    format: 'date-time',
                    pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z$',
                    description: 'Server-side timestamp in ISO 8601 format.',
                },
            },
            required: ['success', 'status', 'data', 'timestamp'],
            additionalProperties: false,
        };

        if (!responseSchemaId) {
            return Object.keys(definitions).length > 0 ? { ...envelopeSchema, [definitionKeyword]: definitions } : envelopeSchema;
        }

        return {
            $ref: `#/${definitionKeyword}/${responseSchemaId}`,
            [definitionKeyword]: {
                ...definitions,
                [responseSchemaId]: envelopeSchema,
            },
        };
    }

    // #endregion
}

interface INormalizedJsonSchema {
    readonly definitions: Record<string, unknown>;
    readonly rootSchema: Record<string, unknown>;
}

function formatIssues(issues: ReadonlyArray<StandardSchemaV1.Issue>): string {
    return issues
        .map((issue) => {
            const path = issue.path?.map((segment) => String(isPathSegment(segment) ? segment.key : segment)).join('.');
            return path ? `${path}: ${issue.message}` : issue.message;
        })
        .join(', ');
}

function getReferenceId(reference: unknown, definitionKeyword: DefinitionKeyword): string | undefined {
    if (typeof reference !== 'string') {
        return undefined;
    }

    const prefix = `#/${definitionKeyword}/`;
    return reference.startsWith(prefix) ? reference.slice(prefix.length) : undefined;
}

function isPathSegment(value: PropertyKey | StandardSchemaV1.PathSegment): value is StandardSchemaV1.PathSegment {
    return typeof value === 'object' && value !== null && 'key' in value;
}

function isValidatedResponseFor<TOutput>(value: unknown, dataSchema: StandardSchemaV1): value is ResponseReturn2<TOutput> {
    return typeof value === 'object' && value !== null && validatedResponseSchemas.get(value) === dataSchema;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCanonicalIsoTimestamp(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.valueOf()) && date.toISOString() === value;
}

function normalizeJsonSchema(schema: Record<string, unknown>, definitionKeyword: DefinitionKeyword): INormalizedJsonSchema {
    const rootSchema: Record<string, unknown> = {};
    const definitions: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(schema)) {
        if (key === '$defs' || key === 'definitions') {
            if (isRecord(value)) {
                Object.assign(definitions, rewriteDefinitionReferences(value, definitionKeyword));
            }
            continue;
        }

        if (key !== '$schema') {
            rootSchema[key] =
                key === '$ref' && typeof value === 'string'
                    ? rewriteDefinitionReference(value, definitionKeyword)
                    : rewriteDefinitionReferences(value, definitionKeyword);
        }
    }

    return { definitions, rootSchema };
}

function rewriteDefinitionReference(reference: string, definitionKeyword: DefinitionKeyword): string {
    return reference.replace('#/$defs/', `#/${definitionKeyword}/`).replace('#/definitions/', `#/${definitionKeyword}/`);
}

function rewriteDefinitionReferences(value: unknown, definitionKeyword: DefinitionKeyword): unknown {
    if (Array.isArray(value)) {
        return value.map((item) => rewriteDefinitionReferences(item, definitionKeyword));
    }

    if (!isRecord(value)) {
        return value;
    }

    const rewritten: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(value)) {
        rewritten[key] =
            key === '$ref' && typeof child === 'string'
                ? rewriteDefinitionReference(child, definitionKeyword)
                : rewriteDefinitionReferences(child, definitionKeyword);
    }

    return rewritten;
}
