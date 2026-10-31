// #region Imports

import { IReportingDatasetField } from './ReportingDatasetField.js';

// #endregion

/**
 * Represents a single row returned by a reporting dataset.
 *
 * @public
 */
export type ReportingQueryResultRow = Record<string, unknown>;

/**
 * Represents the result of a dataset query execution.
 *
 * @public
 */
export interface IReportingQueryResult {
    readonly datasetId: string;
    readonly fields: ReadonlyArray<IReportingDatasetField>;
    readonly rows: ReadonlyArray<ReportingQueryResultRow>;
    readonly totalCount: number;
    readonly generatedAt: Date;
}

// #endregion
