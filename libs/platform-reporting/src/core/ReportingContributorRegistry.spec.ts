import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IReportingContributor } from './ReportingContributor.js';
import { ReportingContributorRegistry } from './ReportingContributorRegistry.js';

describe('ReportingContributorRegistry', () => {
    // #region Fields

    let registry: ReportingContributorRegistry;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        registry = new ReportingContributorRegistry();
    });

    it('should register a contributor', () => {
        // arrange
        const contributor: IReportingContributor = {
            featureKey: 'orders',
            listDatasets: vi.fn(),
            executeQuery: vi.fn(),
        };

        // act
        registry.register(contributor);

        // assert
        expect(registry.getContributors()).toHaveLength(1);
        expect(registry.getContributors()[0].featureKey).toBe('orders');
    });

    it('should skip duplicate contributor registration', () => {
        // arrange
        const contributor: IReportingContributor = {
            featureKey: 'orders',
            listDatasets: vi.fn(),
            executeQuery: vi.fn(),
        };

        // act
        registry.register(contributor);
        registry.register(contributor);

        // assert
        expect(registry.getContributors()).toHaveLength(1);
    });

    it('should return a defensive copy of contributors', () => {
        // arrange
        const contributor: IReportingContributor = {
            featureKey: 'orders',
            listDatasets: vi.fn(),
            executeQuery: vi.fn(),
        };
        registry.register(contributor);

        // act
        const copy = registry.getContributors();

        // assert
        expect(copy).toHaveLength(1);
        expect(copy).not.toBe(registry.getContributors());
    });

    // #endregion
});
