import type * as DMMF from '@prisma/dmmf';
import type { IJsonSchemaGeneratorConfig } from '../config/IJsonSchemaGeneratorConfig.js';
import type { INamingConvention } from '../config/INamingConvention.js';
import type { IJsonSchema } from '../utils/IJsonSchema.js';
import { JsonSchemaTypeMapper, type IJsonSchemaFieldContext } from '../utils/JsonSchemaTypeMapper.js';
import type { IRenderedOutput, IRenderedSourceFile } from './IRenderedSourceFile.js';

type ManifestReferenceMap = Record<string, { readonly $ref: string }>;

/**
 * Creates JSON Schema documents representing Prisma models and enums.
 */
export class JsonSchemaRenderer {
    // #region Fields

    private readonly _config: IJsonSchemaGeneratorConfig;
    private readonly _typeMapper: JsonSchemaTypeMapper;

    // #endregion

    // #region Ctor

    public constructor(config: IJsonSchemaGeneratorConfig) {
        this._config = config;
        this._typeMapper = new JsonSchemaTypeMapper();
    }

    // #endregion

    // #region Methods

    /**
     * Renders the provided Prisma datamodel into JSON Schema documents.
     *
     * @param datamodel Prisma data model meta format representation
     */
    public render(datamodel: DMMF.Datamodel): IRenderedOutput {
        const modelFileLookup = this.buildModelFileLookup(datamodel.models);
        const enumFileLookup = this.buildEnumFileLookup(datamodel.enums);
        const supportingFiles: IRenderedSourceFile[] = [];

        for (const enumeration of datamodel.enums) {
            supportingFiles.push(this.renderEnumSchema(enumeration));
        }

        for (const model of datamodel.models) {
            supportingFiles.push(this.renderModelSchema(model, modelFileLookup, enumFileLookup));
        }

        const manifestFile = this.renderManifest(modelFileLookup, enumFileLookup);

        return {
            primaryFile: manifestFile,
            supportingFiles,
        };
    }

    private renderEnumSchema(enumeration: DMMF.DatamodelEnum): IRenderedSourceFile {
        const fileName = this.buildEnumFileName(enumeration.name);
        const schema: IJsonSchema = {
            $schema: this._config.schemaVersion,
            $id: enumeration.name,
            title: enumeration.name,
            type: 'string',
            enum: enumeration.values.map((value) => value.name),
            description: enumeration.documentation ?? undefined,
            $comment: this._config.emitGeneratorComment ? this.buildGeneratorComment() : undefined,
        };

        return {
            fileName,
            content: this.serialize(schema),
        };
    }

    private renderModelSchema(
        model: DMMF.Model,
        modelFileLookup: ReadonlyMap<string, string>,
        enumFileLookup: ReadonlyMap<string, string>,
    ): IRenderedSourceFile {
        const fileName = this.buildModelFileName(model.name);
        const context: IJsonSchemaFieldContext = {
            currentModelName: model.name,
            modelFileLookup,
            enumFileLookup,
        };
        const properties: Record<string, IJsonSchema> = {};
        const requiredFields: string[] = [];

        for (const field of model.fields) {
            const baseSchema = this._typeMapper.resolve(field, context);
            const describedSchema = field.documentation
                ? {
                      ...baseSchema,
                      description: field.documentation,
                  }
                : baseSchema;

            properties[field.name] = describedSchema;

            if (field.isRequired) {
                requiredFields.push(field.name);
            }
        }

        const schema: IJsonSchema = {
            $schema: this._config.schemaVersion,
            $id: model.name,
            title: model.name,
            description: model.documentation ?? undefined,
            type: 'object',
            additionalProperties: false,
            properties,
            required: requiredFields.length > 0 ? requiredFields : undefined,
            $comment: this._config.emitGeneratorComment ? this.buildGeneratorComment() : undefined,
        };

        return {
            fileName,
            content: this.serialize(schema),
        };
    }

    private renderManifest(modelFileLookup: ReadonlyMap<string, string>, enumFileLookup: ReadonlyMap<string, string>): IRenderedSourceFile {
        const models: ManifestReferenceMap = {};
        const enums: ManifestReferenceMap = {};
        const sortedModelEntries = [...modelFileLookup.entries()].sort(([left], [right]) => left.localeCompare(right));
        const sortedEnumEntries = [...enumFileLookup.entries()].sort(([left], [right]) => left.localeCompare(right));

        for (const [name, fileName] of sortedModelEntries) {
            models[name] = { $ref: `./${fileName}` };
        }

        for (const [name, fileName] of sortedEnumEntries) {
            enums[name] = { $ref: `./${fileName}` };
        }

        const manifest = {
            $schema: this._config.schemaVersion,
            $comment: this._config.emitGeneratorComment ? this.buildGeneratorComment() : undefined,
            models,
            enums,
        };

        return {
            fileName: this._config.fileName,
            content: this.serialize(manifest),
        };
    }

    private buildModelFileLookup(models: ReadonlyArray<DMMF.Model>): ReadonlyMap<string, string> {
        const lookup = new Map<string, string>();

        for (const model of models) {
            lookup.set(model.name, this.buildModelFileName(model.name));
        }

        return lookup;
    }

    private buildEnumFileLookup(enums: ReadonlyArray<DMMF.DatamodelEnum>): ReadonlyMap<string, string> {
        const lookup = new Map<string, string>();

        for (const enumeration of enums) {
            lookup.set(enumeration.name, this.buildEnumFileName(enumeration.name));
        }

        return lookup;
    }

    private buildModelFileName(modelName: string): string {
        const normalizedName = this.applyNamingConvention(modelName, this._config.modelNamingConvention);
        return `${normalizedName}${this._config.schemaFileSuffix}`;
    }

    private buildEnumFileName(enumName: string): string {
        const normalizedName = this.applyNamingConvention(enumName, this._config.enumNamingConvention);
        return `${normalizedName}${this._config.schemaFileSuffix}`;
    }

    private applyNamingConvention(name: string, convention: INamingConvention): string {
        let normalizedName = name;

        if (convention.replace && convention.replace.regex.length > 0) {
            try {
                const pattern = new RegExp(convention.replace.regex, 'gu');
                normalizedName = normalizedName.replace(pattern, convention.replace.value);
            } catch {
                normalizedName = normalizedName.split(convention.replace.regex).join(convention.replace.value);
            }
        }

        const prefix = convention.prefix ?? '';
        const suffix = convention.suffix ?? '';

        return `${prefix}${normalizedName}${suffix}`;
    }

    private buildGeneratorComment(): string {
        return 'Generated by prisma-generator-json-schema.';
    }

    private serialize(value: unknown): string {
        const serialized = JSON.stringify(value, null, 4) ?? '';
        return serialized.endsWith('\n') ? serialized : `${serialized}\n`;
    }

    // #endregion
}
