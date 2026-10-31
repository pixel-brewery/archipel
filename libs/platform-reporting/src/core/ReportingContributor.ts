// #region Imports

import { IReportingDataset } from '../models/ReportingDataset.js';
import { IReportingQuery } from '../models/ReportingQuery.js';
import { IReportingQueryResult } from '../models/ReportingQueryResult.js';

// #endregion

/**
 * Describes a feature-level contributor that exposes reporting datasets.
 */
export interface IReportingContributor {
    /**
     * Feature namespace associated with the contributor.
     */
    readonly featureKey: string;

    /**
     * Returns the datasets exposed by the contributor.
     */
    listDatasets(): Promise<ReadonlyArray<IReportingDataset>>;

    /**
     * Executes the dataset query defined by the given request.
     */
    executeQuery(_dataset: IReportingDataset, _request: IReportingQuery): Promise<IReportingQueryResult>;
}

// #endregion
