import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ReportingContributorRegistry } from './core/ReportingContributorRegistry.js';
import { ReportingFacade } from './core/ReportingFacade.js';
import { ReportingModule } from './ReportingModule.js';

describe('ReportingModule (DI Integration)', () => {
    // #region Methods

    it('should resolve ReportingFacade when the module is imported', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [ReportingModule],
        }).compile();

        // act
        const facade = moduleRef.get(ReportingFacade);

        // assert
        expect(facade).toBeInstanceOf(ReportingFacade);
    });

    it('should resolve ReportingContributorRegistry when the module is imported', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [ReportingModule],
        }).compile();

        // act
        const registry = moduleRef.get(ReportingContributorRegistry);

        // assert
        expect(registry).toBeInstanceOf(ReportingContributorRegistry);
    });

    // #endregion
});
