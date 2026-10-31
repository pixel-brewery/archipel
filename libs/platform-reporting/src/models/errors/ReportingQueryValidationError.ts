/**
 * Error thrown when a reporting query contains invalid filter or sort fields.
 *
 * @public
 */
export class ReportingQueryValidationError extends Error {
    // #region Fields

    public readonly invalidFields: ReadonlyArray<string>;

    // #endregion

    // #region Ctor

    public constructor(datasetId: string, invalidFields: ReadonlyArray<string>) {
        super(`Reporting query for dataset '${datasetId}' references unknown fields: ${invalidFields.join(', ')}.`);
        this.invalidFields = invalidFields;
    }

    // #endregion
}
