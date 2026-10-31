export interface IRenderedSourceFile {
    // #region Properties

    readonly fileName: string;
    readonly content: string;

    // #endregion
}

export interface IRenderedOutput {
    // #region Properties

    readonly primaryFile: IRenderedSourceFile;
    readonly supportingFiles: ReadonlyArray<IRenderedSourceFile>;

    // #endregion
}
