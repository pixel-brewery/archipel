/**
 * Output of the built-in deferred tool loader.
 *
 * The model receives this result as the loader's tool result, and
 * `onToolExecutionEnd` observers receive it as the loader's `tool-result`
 * output.
 *
 * @public
 */
export interface IIntelligenceDeferredToolLoadResult {
    // #region Properties

    /** Requested tools activated by this loader call. They are callable from the next step on. */
    readonly loaded: ReadonlyArray<string>;

    /** Requested tools that were already active, including the loader itself. */
    readonly alreadyActive: ReadonlyArray<string>;

    /** Requested names that are not available for this call. */
    readonly unknown: ReadonlyArray<string>;

    // #endregion
}
