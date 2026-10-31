// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { IReportingContributor } from './ReportingContributor.js';

// #endregion

/**
 * Registry responsible for tracking feature-provided reporting contributors.
 */
@Injectable()
export class ReportingContributorRegistry {
    // #region Fields

    private static readonly _MAX_CONTRIBUTORS = 200;
    private readonly _contributors: Array<IReportingContributor> = [];
    private readonly _logger = new Logger(ReportingContributorRegistry.name);

    // #endregion

    // #region Methods

    public register(contributor: IReportingContributor): void {
        if (this._contributors.includes(contributor)) {
            this._logger.warn(`Contributor '${contributor.featureKey}' is already registered.`);
            return;
        }
        if (this._contributors.length >= ReportingContributorRegistry._MAX_CONTRIBUTORS) {
            this._logger.warn(`ReportingContributorRegistry reached max capacity of ${ReportingContributorRegistry._MAX_CONTRIBUTORS}`);
            return;
        }
        this._contributors.push(contributor);
    }

    public getContributors(): ReadonlyArray<IReportingContributor> {
        return [...this._contributors];
    }

    // #endregion
}

// #endregion
