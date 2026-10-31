import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';

/**
 * Abstract base class for composition-time feature resolution.
 *
 * Applications extend this class to define their own composition logic,
 * determining which modules and providers should be imported based on
 * configuration, stage, or other criteria.
 *
 * @remarks
 * The resolver is instantiated within a lightweight composition context
 * before the main application module graph is built. It should only
 * depend on configuration and other composition-safe services.
 *
 * Do not inject heavy infrastructure services (database, queues, etc.)
 * into the resolver as they are not available during composition.
 *
 * @example
 * ```typescript
 * @Injectable()
 * export class AppCompositionResolver extends CompositionResolverBase {
 *     public constructor(configService: ConfigService) {
 *         super(configService);
 *     }
 *
 *     public shouldImportSmtpMail(): boolean {
 *         const driver = this.tryGetConfigValue(MAIL_DRIVER, 'log');
 *         return driver === 'smtp' || this.isProductionLike();
 *     }
 *
 *     public isProductionLike(): boolean {
 *         const stage = this.tryGetConfigValue(NODE_ENV, 'development');
 *         return stage === 'production' || stage === 'staging';
 *     }
 * }
 * ```
 *
 * @public
 */
@Injectable()
export abstract class CompositionResolverBase {
    // #region Fields

    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new composition resolver.
     *
     * @param configService - The configuration service for reading environment values.
     *
     * @protected
     */
    protected constructor(configService: ConfigService) {
        this._configService = configService;
    }

    // #endregion

    // #region Properties

    /**
     * The underlying configuration service.
     *
     * @protected
     */
    protected get configService(): ConfigService {
        return this._configService;
    }

    // #endregion

    // #region Methods

    /**
     * Determines whether a specific provider should be imported.
     *
     * Override this method to implement custom provider resolution logic.
     *
     * @param providerKey - A unique key identifying the provider (e.g., `'mail'`, `'blob-storage'`).
     * @returns `true` if the provider should be imported; otherwise, `false`.
     *
     * @public
     */
    public abstract shouldImportProvider(providerKey: string): boolean;

    /**
     * Gets a required configuration value.
     *
     * @typeParam T - The expected type of the configuration value.
     * @param key - The typed configuration key.
     * @returns The typed configuration value.
     * @throws {ConfigKeyNotFoundError} When the configuration key is not found.
     *
     * @protected
     */
    protected getConfigValue<T>(key: IConfigKey<T>): T {
        return this._configService.get<T>(key.key);
    }

    /**
     * Gets an optional configuration value with a fallback.
     *
     * @typeParam T - The expected type of the configuration value.
     * @param key - The typed configuration key.
     * @param fallback - The fallback value when the key is absent.
     * @returns The typed configuration value or the fallback.
     *
     * @protected
     */
    protected tryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T {
        return this._configService.tryGet<T>(key.key, fallback);
    }

    /**
     * Compares a configuration value against an expected value.
     *
     * @typeParam T - The expected type of the configuration value.
     * @param key - The typed configuration key.
     * @param value - The value to compare against.
     * @returns `true` if the configuration value matches; otherwise, `false`.
     *
     * @protected
     */
    protected compareConfigValue<T>(key: IConfigKey<T>, value: T): boolean {
        return this._configService.compare<T>(key.key, value);
    }

    // #endregion
}
