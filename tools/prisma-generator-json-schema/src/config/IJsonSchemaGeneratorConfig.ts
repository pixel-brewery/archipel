import type { INamingConvention } from './INamingConvention.js';

export interface IJsonSchemaGeneratorConfig {
    // #region Properties

    readonly fileName: string;
    readonly schemaFileSuffix: string;
    readonly schemaVersion: string;
    readonly emitGeneratorComment: boolean;
    readonly modelNamingConvention: INamingConvention;
    readonly enumNamingConvention: INamingConvention;

    // #endregion
}
