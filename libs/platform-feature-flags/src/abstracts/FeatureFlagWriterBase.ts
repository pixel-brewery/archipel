import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';

/**
 * Abstract base for feature flag writer operations (CRUD).
 * Each provider (Azure App Configuration, Vercel Edge Config) must implement this contract
 * so that the admin UI backend can manage flags without being coupled to a specific provider.
 *
 * @remarks
 * This abstract base is intentionally separated from {@link FeatureFlagReaderBase} because
 * the read path (consumed by application code) and the write path (consumed by admin tooling)
 * have different deployment contexts, security requirements, and SDK dependencies.
 *
 * @public
 */
export abstract class FeatureFlagWriterBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Returns a single feature flag definition by key.
     *
     * @public
     * @param key - The unique key identifying the feature flag.
     * @returns The flag definition, or `undefined` if not found.
     */
    public abstract getFlag(key: string): Promise<IFeatureFlagDefinition | undefined>;

    /**
     * Returns all feature flag definitions managed by the provider.
     *
     * @public
     * @returns Array of flag definitions.
     */
    public abstract listFlags(): Promise<ReadonlyArray<IFeatureFlagDefinition>>;

    /**
     * Creates a new feature flag.
     *
     * @public
     * @param definition - The flag definition to create.
     * @throws {FeatureFlagError} If the flag already exists or creation fails.
     */
    public abstract createFlag(definition: IFeatureFlagDefinition): Promise<void>;

    /**
     * Updates an existing feature flag.
     * Only the fields present in the partial definition are updated.
     *
     * @public
     * @param key - The unique key of the flag to update.
     * @param updates - Partial definition with the fields to update.
     * @throws {FeatureFlagError} If the flag does not exist or the update fails.
     */
    public abstract updateFlag(key: string, updates: Partial<Omit<IFeatureFlagDefinition, 'key'>>): Promise<void>;

    /**
     * Deletes a feature flag.
     *
     * @public
     * @param key - The unique key of the flag to delete.
     * @throws {FeatureFlagError} If the deletion fails.
     */
    public abstract deleteFlag(key: string): Promise<void>;

    /**
     * Lightweight connectivity check for the writer provider.
     * Defaults to `true` if not overridden.
     *
     * @public
     * @returns `true` if the provider is reachable.
     */
    public async ping(): Promise<boolean> {
        return true;
    }

    // #endregion
}
