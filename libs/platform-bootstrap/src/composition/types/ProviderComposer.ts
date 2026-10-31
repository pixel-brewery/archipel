// #region Imports

import type { ICompositionContext } from '../context/ICompositionContext.js';
import type { IProviderDecision } from './IProviderDecision.js';

// #endregion

/**
 * Function signature for a provider composer.
 *
 * A provider composer is responsible for determining which modules should be
 * imported based on the current composition context (configuration, stage, etc.).
 *
 * @typeParam TContext - The composition context type. Defaults to {@link ICompositionContext}.
 *
 * @example
 * ```typescript
 * const composeMailProvider: ProviderComposer = async (context) => {
 *     const driver = context.config.tryGet('MAIL_DRIVER', 'log');
 *
 *     if (driver === 'smtp') {
 *         const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
 *         const { SmtpDeliveryStrategy } = await import('@pixel-brewery/archipel-platform-mailing/delivering/smtp');
 *
 *         return {
 *             shouldImport: true,
 *             imports: [MailModule.register({ deliveryStrategy: SmtpDeliveryStrategy })]
 *         };
 *     }
 *
 *     return { shouldImport: false, imports: [] };
 * };
 * ```
 *
 * @public
 */
export type ProviderComposer<TContext extends ICompositionContext = ICompositionContext> = (context: TContext) => Promise<IProviderDecision>;
