// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { ReportingDatasetNotFoundError } from '../models/errors/ReportingDatasetNotFoundError.js';
import { ReportingExecutionError } from '../models/errors/ReportingExecutionError.js';
import { ReportingQueryValidationError } from '../models/errors/ReportingQueryValidationError.js';
import { IReportingDataset } from '../models/ReportingDataset.js';
import { IReportingQuery, ReportingFilterOperators } from '../models/ReportingQuery.js';
import { IReportingQueryResult } from '../models/ReportingQueryResult.js';
import { IReportingContributor } from './ReportingContributor.js';
import { ReportingContributorRegistry } from './ReportingContributorRegistry.js';

// #endregion

/**
 * Facade orchestrating dataset resolution and query execution for reporting consumers.
 *
 * @public
 */
@Injectable()
export class ReportingFacade {
    // #region Fields

    private static readonly _datasetIdSeparator = '.';
    private static readonly _maxRowLimit = 10_000;
    private readonly _logger = new Logger(ReportingFacade.name);
    private readonly _registry: ReportingContributorRegistry;

    // #endregion

    // #region Ctor

    public constructor(registry: ReportingContributorRegistry) {
        this._registry = registry;
    }

    // #endregion

    // #region Methods

    public async getCatalog(): Promise<ReadonlyArray<IReportingDataset>> {
        const contributors = this._registry.getContributors();
        const datasetGroups = await Promise.all(contributors.map((contributor) => this.loadContributorDatasets(contributor)));
        const datasets = datasetGroups.flat();
        datasets.sort((left, right) => left.datasetId.localeCompare(right.datasetId));
        return datasets;
    }

    public async getDataset(datasetId: string): Promise<IReportingDataset> {
        const { dataset } = await this.resolveDataset(datasetId);
        return dataset;
    }

    public async executeQuery(request: IReportingQuery): Promise<IReportingQueryResult> {
        const { dataset, contributor } = await this.resolveDataset(request.datasetId);
        this.validateQueryFields(dataset, request);

        const effectiveLimit = Math.min(request.limit ?? ReportingFacade._maxRowLimit, ReportingFacade._maxRowLimit);
        const boundedRequest: IReportingQuery = { ...request, limit: effectiveLimit };

        try {
            const queryTimeout = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new ReportingExecutionError(request.datasetId, new Error('Query execution timed out after 30000ms'))), 30_000);
            });
            const result = await Promise.race([contributor.executeQuery(dataset, boundedRequest), queryTimeout]);
            return {
                datasetId: dataset.datasetId,
                fields: dataset.fields,
                rows: result.rows,
                totalCount: result.totalCount,
                generatedAt: result.generatedAt,
            } satisfies IReportingQueryResult;
        } catch (error: unknown) {
            this._logger.error(`Query execution failed for dataset '${request.datasetId}'.`, error instanceof Error ? error.stack : error);
            throw new ReportingExecutionError(request.datasetId, error);
        }
    }

    private validateQueryFields(dataset: IReportingDataset, request: IReportingQuery): void {
        const knownFields = new Set(dataset.fields.map((field) => field.fieldId));
        const referencedFields: Array<string> = [];

        if (request.filters) {
            for (const filter of request.filters) {
                referencedFields.push(filter.fieldId);
            }
        }
        if (request.sorts) {
            for (const sort of request.sorts) {
                referencedFields.push(sort.fieldId);
            }
        }

        const invalidFields = referencedFields.filter((fieldId) => !knownFields.has(fieldId));
        if (invalidFields.length > 0) {
            throw new ReportingQueryValidationError(dataset.datasetId, [...new Set(invalidFields)]);
        }

        const validOperators = new Set(Object.values(ReportingFilterOperators));
        if (request.filters) {
            const invalidOperators = request.filters.filter((filter) => !validOperators.has(filter.operator)).map((filter) => filter.operator);
            if (invalidOperators.length > 0) {
                throw new ReportingQueryValidationError(dataset.datasetId, [...new Set(invalidOperators)]);
            }
        }
    }

    private async resolveDataset(datasetId: string): Promise<{
        dataset: IReportingDataset;
        contributor: IReportingContributor;
    }> {
        const featureKey = this.extractFeatureKey(datasetId);
        const contributor = this._registry.getContributors().find((candidate) => candidate.featureKey === featureKey);
        if (!contributor) {
            throw new ReportingDatasetNotFoundError(datasetId);
        }

        const datasets = await this.loadContributorDatasets(contributor);
        const dataset = datasets.find((candidate) => candidate.datasetId === datasetId);
        if (!dataset) {
            throw new ReportingDatasetNotFoundError(datasetId);
        }

        return {
            dataset,
            contributor,
        };
    }

    private async loadContributorDatasets(contributor: IReportingContributor): Promise<ReadonlyArray<IReportingDataset>> {
        const datasets = await contributor.listDatasets();
        return datasets.map((dataset) => this.normalizeDataset(contributor, dataset));
    }

    private normalizeDataset(contributor: IReportingContributor, dataset: IReportingDataset): IReportingDataset {
        const expectedDatasetId = `${dataset.featureKey}${ReportingFacade._datasetIdSeparator}${dataset.datasetKey}`;
        if (dataset.datasetId !== expectedDatasetId) {
            this._logger.warn(`Dataset '${dataset.datasetId}' does not follow the '<feature>.<dataset>' format. Normalizing to '${expectedDatasetId}'.`);
        }
        if (dataset.featureKey !== contributor.featureKey) {
            this._logger.warn(
                `Dataset '${dataset.datasetId}' reported feature '${dataset.featureKey}' but contributor '${
                    contributor.featureKey
                }' owns the dataset. Using contributor feature key.`,
            );
        }

        const normalized: IReportingDataset = {
            datasetId: expectedDatasetId,
            featureKey: contributor.featureKey,
            datasetKey: dataset.datasetKey,
            name: dataset.name,
            description: dataset.description,
            fields: dataset.fields,
        } satisfies IReportingDataset;

        this._logger.debug(`Normalized dataset '${dataset.datasetId}' → '${normalized.datasetId}' (${normalized.fields.length} fields).`);

        return normalized;
    }

    private extractFeatureKey(datasetId: string): string {
        const [featureKey, datasetKey] = datasetId.split(ReportingFacade._datasetIdSeparator);
        if (!featureKey || !datasetKey) {
            throw new ReportingDatasetNotFoundError(datasetId);
        }
        return featureKey;
    }

    // #endregion
}

// #endregion
