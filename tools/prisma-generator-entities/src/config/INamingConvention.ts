export interface INamingConventionReplace {
    // #region Properties

    /**
     * Regular expression to change the naming of the class.
     */
    readonly regex: string;

    /**
     * Value to replace the matched regex.
     */
    readonly value: string;

    // #endregion
}

export interface INamingConvention {
    // #region Properties

    /**
     * Prefix for generated classes. Defaults to empty.
     */
    readonly prefix?: string;

    /**
     * Suffix for generated classes. Defaults to empty. If it is a Service, Defaults to 'Service'.
     */
    readonly suffix?: string;

    /**
     *  Regular expression to change the naming of the class.
     */
    readonly replace?: INamingConventionReplace;

    // #endregion
}
