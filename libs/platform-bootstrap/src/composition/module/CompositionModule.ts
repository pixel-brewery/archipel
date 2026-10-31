// #region Imports

import { ConfigModule, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Module } from '@nestjs/common';

// #endregion

/**
 * Minimal module providing configuration access for composition.
 *
 * This module is used by {@link createCompositionContext} to create a
 * lightweight NestJS application context for module composition decisions.
 *
 * @remarks
 * The composition module intentionally does **not** import heavy infrastructure
 * such as database, queues, cron, or external API clients. It only provides
 * configuration access.
 *
 * To add custom composition services (e.g., a custom {@link CompositionResolverBase}),
 * create a custom module extending this pattern and pass it to
 * {@link createCompositionContext}.
 *
 * @example
 * ```typescript
 * // Custom composition module with application-specific resolver
 * @Module({
 *     imports: [
 *         ConfigModule.forRoot({
 *             strategyFactory: () => new EnvironmentConfigStrategy()
 *         })
 *     ],
 *     providers: [AppCompositionResolver],
 *     exports: [ConfigModule, AppCompositionResolver]
 * })
 * export class AppCompositionModule {}
 *
 * // Usage
 * const context = await createCompositionContext({
 *     module: AppCompositionModule
 * });
 * ```
 *
 * @public
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: (): EnvironmentConfigStrategy => new EnvironmentConfigStrategy(),
        }),
    ],
    exports: [ConfigModule],
})
export class CompositionModule {}
