import type * as DMMF from '@prisma/dmmf';
import type { IJsonSchema } from './IJsonSchema.js';

const jsonWildcardTypes: ReadonlyArray<string> = ['array', 'boolean', 'integer', 'null', 'number', 'object', 'string'];

export interface IJsonSchemaFieldContext {
    // #region Properties

    readonly currentModelName: string;
    readonly modelFileLookup: ReadonlyMap<string, string>;
    readonly enumFileLookup: ReadonlyMap<string, string>;

    // #endregion
}

/**
 * Resolves JSON Schema fragments for Prisma field definitions.
 */
export class JsonSchemaTypeMapper {
    // #region Methods

    public resolve(field: DMMF.Field, context: IJsonSchemaFieldContext): IJsonSchema {
        const baseSchema = this.resolveBase(field, context);
        const listAwareSchema = this.applyListModifier(baseSchema, field.isList);
        const nullableAwareSchema = this.applyNullableModifier(listAwareSchema, !field.isRequired);

        return nullableAwareSchema;
    }

    private resolveBase(field: DMMF.Field, context: IJsonSchemaFieldContext): IJsonSchema {
        switch (field.kind) {
            case 'scalar': {
                return this.resolveScalar(field.type);
            }
            case 'enum': {
                return this.resolveEnum(field.type, context.enumFileLookup);
            }
            case 'object': {
                return this.resolveRelation(field.type, context);
            }
            default: {
                return {};
            }
        }
    }

    private resolveScalar(typeName: string): IJsonSchema {
        switch (typeName) {
            case 'String': {
                return { type: 'string' };
            }
            case 'Boolean': {
                return { type: 'boolean' };
            }
            case 'Int': {
                return { type: 'integer' };
            }
            case 'BigInt': {
                return { type: 'integer' };
            }
            case 'Float': {
                return { type: 'number' };
            }
            case 'Decimal': {
                return { type: 'string' };
            }
            case 'DateTime': {
                return { type: 'string', format: 'date-time' };
            }
            case 'Json': {
                return { type: jsonWildcardTypes };
            }
            case 'Bytes': {
                return { type: 'string', contentEncoding: 'base64' };
            }
            default: {
                return {};
            }
        }
    }

    private resolveEnum(typeName: string, enumLookup: ReadonlyMap<string, string>): IJsonSchema {
        const targetFile = enumLookup.get(typeName);

        if (!targetFile) {
            return { type: 'string' };
        }

        return { $ref: `./${targetFile}` };
    }

    private resolveRelation(typeName: string, context: IJsonSchemaFieldContext): IJsonSchema {
        if (typeName === context.currentModelName) {
            return { $ref: '#' };
        }

        const targetFile = context.modelFileLookup.get(typeName);

        if (!targetFile) {
            return { type: 'object' };
        }

        return { $ref: `./${targetFile}` };
    }

    private applyListModifier(schema: IJsonSchema, isList: boolean): IJsonSchema {
        if (!isList) {
            return schema;
        }

        return {
            type: 'array',
            items: schema,
        };
    }

    private applyNullableModifier(schema: IJsonSchema, isNullable: boolean): IJsonSchema {
        if (!isNullable) {
            return schema;
        }

        if (schema.$ref !== undefined && schema.type === undefined && schema.anyOf === undefined) {
            return {
                anyOf: [{ ...schema }, { type: 'null' }],
            };
        }

        if (schema.type === undefined) {
            return {
                ...schema,
                anyOf: [{ ...schema }, { type: 'null' }],
            };
        }

        if (Array.isArray(schema.type)) {
            if (schema.type.includes('null')) {
                return schema;
            }

            return {
                ...schema,
                type: [...schema.type, 'null'],
            };
        }

        if (typeof schema.type === 'string') {
            if (schema.type === 'null') {
                return schema;
            }

            return {
                ...schema,
                type: [schema.type, 'null'],
            };
        }

        return schema;
    }

    // #endregion
}
