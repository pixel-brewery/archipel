import type * as DMMF from '@prisma/dmmf';

const scalarMappings = {
    String: 'string',
    Boolean: 'boolean',
    Int: 'number',
    BigInt: 'bigint',
    Float: 'number',
    Decimal: 'number',
    DateTime: 'Date',
    Json: 'unknown',
    Bytes: 'Uint8Array',
} as const;

type ScalarTypeName = keyof typeof scalarMappings;

/**
 * Resolves TypeScript representations for Prisma field types.
 */
export class TypeMapper {
    // #region Fields

    private readonly _useReadonlyArray: boolean;
    private readonly _modelPrefix: string;
    private readonly _modelSuffix: string;

    // #endregion

    // #region Ctor

    public constructor(useReadonlyArray: boolean, modelPrefix = '', modelSuffix = '') {
        this._useReadonlyArray = useReadonlyArray;
        this._modelPrefix = modelPrefix;
        this._modelSuffix = modelSuffix;
    }

    // #endregion

    // #region Methods

    /**
     * Resolves the TypeScript type for the provided Prisma field.
     *
     * @param field Prisma data model field metadata
     */
    public resolve(field: DMMF.Field): string {
        switch (field.kind) {
            case 'scalar': {
                return this.resolveScalar(field.type);
            }
            case 'enum': {
                return field.type;
            }
            case 'object': {
                return `${this._modelPrefix}${field.type}${this._modelSuffix}`;
            }
            default: {
                return 'never';
            }
        }
    }

    /**
     * Applies array semantics to the provided base type according to generator configuration.
     *
     * @param baseType TypeScript type resolved for the field
     * @param isList Indicates whether the field represents a list
     */
    public applyListModifier(baseType: string, isList: boolean): string {
        if (!isList) {
            return baseType;
        }

        const container = this._useReadonlyArray ? 'ReadonlyArray' : 'Array';
        return `${container}<${baseType}>`;
    }

    private resolveScalar(typeName: string): string {
        const candidate = typeName as ScalarTypeName;

        if (Object.prototype.hasOwnProperty.call(scalarMappings, candidate)) {
            return scalarMappings[candidate];
        }

        return 'unknown';
    }

    // #endregion
}
