import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';
import type { IFeatureAccessResult } from '../contracts/IFeatureAccessResult.js';

/**
 * Abstract base for checking and recording feature usage.
 * Consuming projects must provide a concrete implementation (e.g. backed by Prisma
 * with subscription + usage tables) and register it via `PaymentModule.register()`.
 *
 * @public
 */
export abstract class FeatureAccessBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Checks whether a user is allowed to use the specified feature
     * without incrementing usage.
     *
     * @public
     * @param userId - The user identifier.
     * @param featureKey - The feature key to check.
     * @param context - Request-scoped access context resolved by the guard.
     * @param requestedAmount - Units the caller intends to consume. Defaults to one unit.
     * @returns The access check result including quota information.
     *
     * @remarks
     * `requestedAmount` exists because not every allowance is counted in equal units. A storage
     * allowance is measured in bytes, so "may I use one more" cannot answer whether a specific file
     * still fits. Implementations that ignore the parameter keep their previous behaviour.
     */
    public abstract checkAccess(userId: string, featureKey: string, context?: IFeatureAccessContext, requestedAmount?: number): Promise<IFeatureAccessResult>;

    /**
     * Records feature usage. Implementations should throw if the quota has been exceeded.
     *
     * @public
     * @param userId - The user identifier.
     * @param featureKey - The feature key to record usage for.
     * @param context - Request-scoped access context resolved by the interceptor.
     * @param amount - Units to record. Defaults to one unit.
     */
    public abstract recordUsage(userId: string, featureKey: string, context?: IFeatureAccessContext, amount?: number): Promise<void>;

    /**
     * Declares whether a feature key describes a stock of existing resources rather than
     * consumption over a period.
     *
     * A stock allowance must never be metered: a period counter rises when a resource is created,
     * does not fall when it is removed, and therefore ends up limiting write operations instead of
     * the resources that exist. Returning `true` here keeps the usage interceptor from booking the
     * key, so the implementation can derive its value from the records that actually exist.
     *
     * Defaults to `false`, which preserves the previous behaviour for every existing key.
     *
     * @public
     * @param featureKey - The feature key to classify.
     */
    public isStockFeature(featureKey: string): boolean {
        void featureKey;

        return false;
    }

    // #endregion
}
