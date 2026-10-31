// #region Imports

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureFlagReaderBase } from '../abstracts/FeatureFlagReaderBase.js';
import { FEATURE_FLAG_KEY_METADATA } from '../decorators/FeatureFlag.js';

// #endregion

/**
 * Guard that checks if a feature flag is enabled before allowing access to a route.
 * Use the {@link FeatureFlag} decorator to specify which flag to check.
 *
 * @public
 */
@Injectable()
export class FeatureFlagGuard implements CanActivate {
    // #region Fields

    private readonly _featureFlagReader: FeatureFlagReaderBase;
    private readonly _reflector: Reflector;
    private readonly _logger: Logger = new Logger(FeatureFlagGuard.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `FeatureFlagGuard` class.
     *
     * @public
     * @param featureFlagReader - The feature flag reader abstract base.
     * @param reflector - The NestJS reflector.
     */
    public constructor(featureFlagReader: FeatureFlagReaderBase, reflector: Reflector) {
        this._featureFlagReader = featureFlagReader;
        this._reflector = reflector;
    }

    // #endregion

    // #region Methods

    /**
     * Determines whether the guarded feature flag is enabled.
     *
     * @public
     * @param context - The execution context.
     * @returns `true` when the feature flag is enabled and access is allowed.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const flagKey = this._reflector.get<string>(FEATURE_FLAG_KEY_METADATA, context.getHandler());

        if (!flagKey) {
            return true;
        }

        try {
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            const isEnabled = await this._featureFlagReader.isEnabled(flagKey, {
                userId: user?.id,
            });

            return isEnabled;
        } catch (error: unknown) {
            this._logger.error(`[FeatureFlagGuard] Failed to evaluate flag "${flagKey}"`, {
                flagKey,
                error: (error as Error).message,
            });

            return false;
        }
    }

    // #endregion
}
