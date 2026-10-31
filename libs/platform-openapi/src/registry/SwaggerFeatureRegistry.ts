// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { IFeatureSwaggerConfig } from './IFeatureSwaggerConfig.js';

// #endregion

/**
 * Registry service for dynamically discovered Swagger features.
 * Collects feature configurations from `@SwaggerFeature` decorators.
 *
 * @public
 */
@Injectable()
export class SwaggerFeatureRegistry {
    // #region Fields

    private readonly _features: IFeatureSwaggerConfig[];
    private readonly _logger: Logger = new Logger(SwaggerFeatureRegistry.name);
    private _finalized: boolean;

    // #endregion

    // #region Ctor

    public constructor() {
        this._features = new Array<IFeatureSwaggerConfig>();
        this._finalized = false;
    }

    // #endregion

    // #region Methods

    /**
     * Register a new feature for Swagger documentation
     * @param feature - The feature configuration
     */
    public registerFeature(feature: IFeatureSwaggerConfig): void {
        if (this._finalized) {
            this._logger.warn(`Cannot register feature '${feature.name}' after registry has been finalized`);
            return;
        }

        // Check for duplicates
        const existingByName = this._features.find((f) => f.name === feature.name);
        if (existingByName) {
            this._logger.warn(`Feature '${feature.name}' is already registered, skipping duplicate`);
            return;
        }

        const existingByTag = this._features.find((f) => f.tag === feature.tag && feature.tag !== '*');
        if (existingByTag) {
            this._logger.warn(`Tag '${feature.tag}' is already used by feature '${existingByTag.name}', skipping '${feature.name}'`);
            return;
        }

        this._features.push(feature);
        this._logger.debug(`Registered Swagger feature: ${feature.name} (${feature.tag})`);
    }

    /**
     * Finalize feature registration and prepare for use
     */
    public finalize(): void {
        if (this._finalized) {
            return;
        }

        this._finalized = true;
        this._logger.log(`Finalized Swagger feature registry with ${this._features.length} features`);
    }

    /**
     * Get all registered features
     */
    public getFeatures(): IFeatureSwaggerConfig[] {
        return [...this._features].sort((a, b) => a.name.localeCompare(b.name));
    }

    // #endregion
}
