// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { IHealthCheckResult } from './IHealthCheckResult.js';
import { IHealthIndicator } from './IHealthIndicator.js';

// #endregion

/**
 * Orchestrates execution of all registered health indicators and aggregates their results.
 *
 * @public
 */
@Injectable()
export class HealthOrchestrator {
    // #region Fields

    private static readonly _maxIndicators = 100;
    private readonly _indicators: Array<IHealthIndicator> = [];
    private readonly _registeredNames: Set<string> = new Set();
    private readonly _logger: Logger = new Logger(HealthOrchestrator.name);

    // #endregion

    // #region Ctor

    public constructor() {
        // nothing
    }

    // #endregion

    // #region Methods

    /**
     * Registers a health indicator.
     *
     * @public
     * @param indicator - The health indicator to register.
     */
    public registerIndicator(indicator: IHealthIndicator): void {
        const name = indicator.constructor.name;

        if (this._registeredNames.has(name)) {
            this._logger.warn(`Health indicator already registered, skipping: ${name}`);
            return;
        }

        if (this._indicators.length >= HealthOrchestrator._maxIndicators) {
            this._logger.warn(`Maximum number of health indicators (${HealthOrchestrator._maxIndicators}) reached, skipping: ${name}`);
            return;
        }

        this._indicators.push(indicator);
        this._registeredNames.add(name);
        this._logger.debug(`Health indicator registered: ${name}`);
    }

    /**
     * Executes all registered health indicators and aggregates their results.
     *
     * @public
     * @return The aggregated health check results.
     */
    public async check(): Promise<Array<IHealthCheckResult>> {
        const startTime = Date.now();
        this._logger.debug(`Starting health check for ${this._indicators.length} indicators`);

        try {
            const results = await Promise.all(this._indicators.map(async (indicator) => [indicator.key, await Promise.resolve(indicator.check())]));

            results.forEach((result) => {
                this._logger.debug(`Health indicator result for ${result[0]}: ${JSON.stringify(result[1])}`);
            });

            const aggregated = results.flatMap((result) => {
                return Object.entries(result[1]).map(([key, value]) => {
                    return {
                        name: key,
                        status: value.status,
                        details: typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined,
                    };
                });
            });

            const durationMs = Date.now() - startTime;
            const statusCounts = aggregated.reduce(
                (acc, r) => {
                    acc[r.status] = (acc[r.status] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>,
            );

            const statusSummary = Object.entries(statusCounts)
                .map(([status, count]) => `${count} ${status}`)
                .join(', ');

            this._logger.debug(`Health check completed in ${durationMs}ms: ${aggregated.length} checks (${statusSummary})`);

            return aggregated;
        } catch (error) {
            const durationMs = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : String(error);
            this._logger.error(`Health check failed after ${durationMs}ms: ${errorMessage}`);
            throw error;
        }
    }

    // #endregion
}
