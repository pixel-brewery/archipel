export interface IJsonSchema {
    // #region Properties

    readonly $schema?: string;
    readonly $id?: string;
    readonly $ref?: string;
    readonly $comment?: string;
    readonly title?: string;
    readonly type?: string | ReadonlyArray<string>;
    readonly enum?: ReadonlyArray<string>;
    readonly description?: string;
    readonly properties?: Readonly<Record<string, IJsonSchema>>;
    readonly required?: ReadonlyArray<string>;
    readonly items?: IJsonSchema;
    readonly additionalProperties?: boolean;
    readonly format?: string;
    readonly contentEncoding?: string;
    readonly anyOf?: ReadonlyArray<IJsonSchema>;
    readonly allOf?: ReadonlyArray<IJsonSchema>;
    readonly oneOf?: ReadonlyArray<IJsonSchema>;

    // #endregion
}
