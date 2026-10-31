export interface IEntityGeneratorConfig {
    // #region Properties

    readonly fileName: string;
    readonly entityFileSuffix: string;
    readonly useReadonlyArray: boolean;
    readonly generateModels: boolean;
    readonly generateEnums: boolean;
    readonly usePrismaEnumsWhenDisabled: boolean;
    readonly namespaceName: string;
    readonly prismaClientImportPath: string;
    readonly modelNamingConventionPrefix: string;
    readonly modelNamingConventionSuffix: string;
    readonly modelNamingConventionReplaceRegex?: string;
    readonly modelNamingConventionReplaceValue?: string;
    readonly enumNamingConventionPrefix: string;
    readonly enumNamingConventionSuffix: string;
    readonly enumNamingConventionReplaceRegex?: string;
    readonly enumNamingConventionReplaceValue?: string;

    // #endregion
}
