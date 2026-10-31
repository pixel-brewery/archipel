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
    readonly replace?: {
        readonly regex: string;
        readonly value: string;
    };

    // #endregion
}
