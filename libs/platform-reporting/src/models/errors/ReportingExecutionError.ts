/**
 * Error thrown when a reporting query execution fails unexpectedly.
 *
 * @public
 */
export class ReportingExecutionError extends Error {
    // #region Fields

    public readonly datasetId: string;
    public override readonly cause: unknown;

    // #endregion

    // #region Ctor

    public constructor(datasetId: string, cause: unknown) {
        const message = cause instanceof Error ? cause.message : String(cause);
        super(`Failed to execute reporting query for dataset '${datasetId}': ${message}.`);
        this.datasetId = datasetId;
        this.cause = cause;
    }

    // #endregion
}
