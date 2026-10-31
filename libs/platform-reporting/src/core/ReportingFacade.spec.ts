import { describe, expect, it, vi } from 'vitest';
import { ReportingDatasetNotFoundError } from '../models/errors/ReportingDatasetNotFoundError.js';
import { ReportingExecutionError } from '../models/errors/ReportingExecutionError.js';
import { ReportingQueryValidationError } from '../models/errors/ReportingQueryValidationError.js';
import { type IReportingContributor } from './ReportingContributor.js';
import { ReportingContributorRegistry } from './ReportingContributorRegistry.js';
import { ReportingFacade } from './ReportingFacade.js';

const createContributor = (): IReportingContributor => ({
    featureKey: 'billing',
    listDatasets: async () => [
        {
            datasetId: 'legacy_id',
            featureKey: 'billing',
            datasetKey: 'subscriptions',
            name: 'Subscriptions',
            description: 'Subscription reporting',
            fields: [
                { fieldId: 'id', label: 'ID', type: 'string', isNullable: false },
                { fieldId: 'amount', label: 'Amount', type: 'number', isNullable: false },
            ],
        },
    ],
    executeQuery: async () => ({
        datasetId: 'billing.subscriptions',
        fields: [],
        rows: [{ id: 'row-1' }],
        totalCount: 1,
        generatedAt: new Date('2026-01-01T00:00:00.000Z'),
    }),
});

const createFacade = (): ReportingFacade => {
    const registry = new ReportingContributorRegistry();
    registry.register(createContributor());
    return new ReportingFacade(registry);
};

describe('ReportingFacade', () => {
    it('normalizes and sorts catalog datasets', async () => {
        const reportingFacade = createFacade();

        const catalog = await reportingFacade.getCatalog();

        expect(catalog).toHaveLength(1);
        expect(catalog[0]?.datasetId).toBe('billing.subscriptions');
        expect(catalog[0]?.featureKey).toBe('billing');
    });

    it('executes contributor query for resolved dataset', async () => {
        const reportingFacade = createFacade();

        const result = await reportingFacade.executeQuery({
            datasetId: 'billing.subscriptions',
            filters: [],
            sorts: [],
            limit: 10,
            offset: 0,
        });

        expect(result.datasetId).toBe('billing.subscriptions');
        expect(result.totalCount).toBe(1);
        expect(result.rows).toEqual([{ id: 'row-1' }]);
    });

    it('throws when dataset cannot be resolved', async () => {
        const registry = new ReportingContributorRegistry();
        const reportingFacade = new ReportingFacade(registry);

        await expect(reportingFacade.getDataset('billing.subscriptions')).rejects.toBeInstanceOf(ReportingDatasetNotFoundError);
    });

    it('throws ReportingQueryValidationError for unknown filter fields', async () => {
        // arrange
        const reportingFacade = createFacade();

        // act & assert
        await expect(
            reportingFacade.executeQuery({
                datasetId: 'billing.subscriptions',
                filters: [{ fieldId: 'nonexistent', operator: 'equals', value: 'x' }],
            }),
        ).rejects.toBeInstanceOf(ReportingQueryValidationError);
    });

    it('throws ReportingQueryValidationError for unknown sort fields', async () => {
        // arrange
        const reportingFacade = createFacade();

        // act & assert
        await expect(
            reportingFacade.executeQuery({
                datasetId: 'billing.subscriptions',
                sorts: [{ fieldId: 'unknown_field', direction: 'asc' }],
            }),
        ).rejects.toBeInstanceOf(ReportingQueryValidationError);
    });

    it('allows queries with valid filter and sort fields', async () => {
        // arrange
        const reportingFacade = createFacade();

        // act
        const result = await reportingFacade.executeQuery({
            datasetId: 'billing.subscriptions',
            filters: [{ fieldId: 'id', operator: 'equals', value: 'row-1' }],
            sorts: [{ fieldId: 'amount', direction: 'desc' }],
        });

        // assert
        expect(result.rows).toHaveLength(1);
    });

    it('wraps contributor execution failures in ReportingExecutionError', async () => {
        // arrange
        const failingContributor: IReportingContributor = {
            featureKey: 'billing',
            listDatasets: async () => [
                {
                    datasetId: 'billing.subscriptions',
                    featureKey: 'billing',
                    datasetKey: 'subscriptions',
                    name: 'Subscriptions',
                    description: '',
                    fields: [],
                },
            ],
            executeQuery: vi.fn().mockRejectedValue(new Error('DB connection lost')),
        };
        const registry = new ReportingContributorRegistry();
        registry.register(failingContributor);
        const reportingFacade = new ReportingFacade(registry);

        // act & assert
        await expect(
            reportingFacade.executeQuery({
                datasetId: 'billing.subscriptions',
            }),
        ).rejects.toBeInstanceOf(ReportingExecutionError);
    });
});
