// #region Imports

import { Global, Module } from '@nestjs/common';
import { ReportingContributorRegistry } from './core/ReportingContributorRegistry.js';
import { ReportingFacade } from './core/ReportingFacade.js';

// #endregion

/**
 * Global module providing the reporting facade and contributor registry.
 *
 * @public
 */
@Global()
@Module({
    providers: [ReportingContributorRegistry, ReportingFacade],
    exports: [ReportingContributorRegistry, ReportingFacade],
})
export class ReportingModule {}

// #endregion
