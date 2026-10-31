/**
 * Error thrown when a dataset definition could not be resolved.
 *
 * @public
 */
export class ReportingDatasetNotFoundError extends Error {
    // #region Ctor

    public constructor(datasetId: string) {
        super(`Reporting dataset '${datasetId}' not found.`);
    }

    // #endregion
}
