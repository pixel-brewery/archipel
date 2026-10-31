// #region Imports

import { ConfigModule, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { type DynamicModule, Module, type Type } from '@nestjs/common';
import { FeatureAccessBase } from './abstracts/FeatureAccessBase.js';
import { PaymentClientBase } from './abstracts/PaymentClientBase.js';
import { FeatureGuard } from './guards/FeatureGuard.js';
import { FeatureUsageInterceptor } from './interceptors/FeatureUsageInterceptor.js';

// #endregion

// #region Interfaces

/**
 * Configuration options for the `PaymentModule`.
 *
 * @public
 */
export interface IPaymentModuleOptions {
    /**
     * Concrete implementation of the {@link PaymentClientBase}.
     * For example, `StripeClient`, `PaddleClient`, `LemonSqueezyClient`, or `MollieClient`.
     */
    paymentClient: Type<PaymentClientBase>;

    /**
     * Provider-specific configuration entries to register with the config module.
     */
    configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * Concrete implementation of the {@link FeatureAccessBase}.
     * Required when using `FeatureGuard` or `FeatureUsageInterceptor`.
     */
    featureAccess?: Type<FeatureAccessBase>;

    /**
     * When `true` the module is registered globally.
     */
    isGlobal?: boolean;
}

// #endregion

/**
 * NestJS module providing generic payment infrastructure.
 * Exposes a configurable payment client, a feature-gating guard, and a usage-tracking interceptor.
 * The specific payment provider (Stripe, Paddle, LemonSqueezy, Mollie) is selected via the options.
 *
 * @public
 */
@Module({})
export class PaymentModule {
    // #region Methods

    /**
     * Configures the module with the specified options.
     *
     * @public
     * @param options - The module configuration options.
     * @returns Dynamic module definition.
     */
    public static register(options: IPaymentModuleOptions): DynamicModule {
        const providers = [
            {
                provide: PaymentClientBase,
                useClass: options.paymentClient,
            },
            ...(options.featureAccess
                ? [
                      {
                          provide: FeatureAccessBase,
                          useClass: options.featureAccess,
                      },
                      FeatureGuard,
                      FeatureUsageInterceptor,
                  ]
                : []),
        ];

        const exports = [PaymentClientBase, ...(options.featureAccess ? [FeatureAccessBase, FeatureGuard, FeatureUsageInterceptor] : [])];

        return {
            global: options.isGlobal ?? true,
            module: PaymentModule,
            imports: [ConfigModule.register('platform-payments', options.configEntries ?? [])],
            providers: providers,
            exports: exports,
        };
    }

    // #endregion
}
