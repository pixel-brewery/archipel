// #region Imports

import type { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { CompositionContext } from '../context/CompositionContext.js';
import type { ICompositionContext } from '../context/ICompositionContext.js';
import { CompositionModule } from '../module/CompositionModule.js';

// #endregion

/**
 * Options for creating the composition context.
 *
 * @public
 */
export interface ICreateCompositionContextOptions {
    /**
     * Custom composition module to use instead of the default {@link CompositionModule}.
     *
     * Use this to provide application-specific composition services such as
     * custom {@link CompositionResolverBase} implementations.
     *
     * @example
     * ```typescript
     * @Module({
     *     imports: [ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() })],
     *     providers: [AppCompositionResolver],
     *     exports: [ConfigModule, AppCompositionResolver]
     * })
     * export class AppCompositionModule {}
     *
     * const context = await createCompositionContext({
     *     module: AppCompositionModule
     * });
     * ```
     *
     * @public
     */
    readonly module?: Type<unknown>;

    /**
     * Whether to enable logging for the composition context.
     *
     * Defaults to `false` to keep composition silent.
     *
     * @public
     */
    readonly enableLogging?: boolean;
}

/**
 * Creates a temporary NestJS context for stage-aware module composition.
 *
 * This function bootstraps a minimal NestJS application context that provides
 * access to configuration. Use this context to make decisions about which
 * modules should be dynamically imported into the real application.
 *
 * @remarks
 * The composition context must be closed after the real application has been
 * created by calling {@link ICompositionContext.close}. Use a try/finally block
 * to ensure proper cleanup.
 *
 * @param options - Optional configuration for the composition context.
 * @returns A promise that resolves to the composition context.
 *
 * @example
 * ```typescript
 * async function bootstrap(): Promise<void> {
 *     const composition = await createCompositionContext();
 *
 *     try {
 *         const appModule = await createAppModule(composition);
 *         const app = await NestFactory.create(appModule);
 *
 *         await PlatformApplicationBuilder
 *             .from(app)
 *             .use(useApi({ ... }))
 *             .listenFromConfig();
 *     } finally {
 *         await composition.close();
 *     }
 * }
 * ```
 *
 * @public
 */
export async function createCompositionContext(options?: ICreateCompositionContextOptions): Promise<ICompositionContext> {
    const moduleToUse = options?.module ?? CompositionModule;

    const nestContext = await NestFactory.createApplicationContext(moduleToUse, {
        logger: options?.enableLogging === true ? undefined : false,
    });

    const configService = nestContext.get(ConfigService, { strict: false });

    return new CompositionContext(nestContext, configService);
}
