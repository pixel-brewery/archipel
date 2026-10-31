// #region Imports

import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import type { INestApplicationContext } from '@nestjs/common';

// #endregion

/**
 * Pre-bootstrap context for stage-aware module composition.
 *
 * This context is created before the main application module graph is built.
 * It provides access to configuration and lightweight composition services
 * that help determine which modules should be dynamically imported.
 *
 * @remarks
 * The composition context uses a temporary NestJS application context internally.
 * This context must be closed after the real application has been created by
 * calling {@link ICompositionContext.close}.
 *
 * @example
 * ```typescript
 * const composition = await createCompositionContext();
 *
 * try {
 *     const appModule = await createAppModule(composition);
 *     const app = await NestFactory.create(appModule);
 *     await app.listen(3000);
 * } finally {
 *     await composition.close();
 * }
 * ```
 *
 * @public
 */
export interface ICompositionContext {
    /**
     * The temporary NestJS application context.
     *
     * Used only for dependency injection resolution during composition.
     * Do not use this context for runtime services.
     *
     * @public
     */
    readonly context: INestApplicationContext;

    /**
     * The Archipel configuration service.
     *
     * Provides typed access to environment configuration values.
     *
     * @public
     */
    readonly config: ConfigService;

    /**
     * Reads a required configuration value.
     *
     * @typeParam T - The expected type of the configuration value.
     * @param key - The typed configuration key.
     * @returns The typed configuration value.
     * @throws {ConfigKeyNotFoundError} When the configuration key is not found.
     *
     * @public
     */
    getConfigValue<T>(key: IConfigKey<T>): T;

    /**
     * Reads an optional configuration value with a fallback.
     *
     * @typeParam T - The expected type of the configuration value.
     * @param key - The typed configuration key.
     * @param fallback - The fallback value when the key is absent.
     * @returns The typed configuration value or the fallback.
     *
     * @public
     */
    tryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T;

    /**
     * Resolves a provider from the composition context.
     *
     * @typeParam T - The type of the provider.
     * @param token - The provider token (class, string, or symbol).
     * @returns The resolved provider instance.
     *
     * @public
     */
    getService<T>(token: abstract new (...args: Array<unknown>) => T): T;

    /**
     * Closes the temporary composition context.
     *
     * Must be called after the real application has been created to release
     * resources held by the composition context.
     *
     * @returns A promise that resolves when the context is closed.
     *
     * @public
     */
    close(): Promise<void>;
}
