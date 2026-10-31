/**
 * Controls conversion of a NestJS Swagger model into self-contained JSON Schema.
 *
 * @public
 */
export interface ICreateJsonSchemaFromOpenApiModelOptions {
    // #region Properties

    /**
     * Adds `additionalProperties: false` to object schemas that do not already
     * declare an additional-properties policy.
     *
     * Omit this option to preserve NestJS Swagger's generated object semantics.
     */
    readonly additionalProperties?: false;

    // #endregion
}
