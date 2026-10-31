// #region Imports

import { IReportingDatasetField } from './ReportingDatasetField.js';

// #endregion

/**
 * Represents a dataset definition that can be consumed through the reporting API.
 *
 * @public
 */
export interface IReportingDataset {
    /**
     * Fully qualified dataset identifier (`<feature>.<dataset>`).
     */
    readonly datasetId: string;

    /**
     * Feature namespace owning the dataset.
     */
    readonly featureKey: string;

    /**
     * Dataset key within the feature namespace.
     */
    readonly datasetKey: string;

    /**
     * Human readable dataset name.
     */
    readonly name: string;

    /**
     * Optional dataset description presented to consumers.
     */
    readonly description?: string;

    /**
     * Fields exposed by the dataset.
     */
    readonly fields: ReadonlyArray<IReportingDatasetField>;
}

// #endregion
