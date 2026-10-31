// #region Imports

import { BlobModule } from '@pixel-brewery/archipel-platform-blob-storage';
import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { ConfigModule } from '@pixel-brewery/archipel-platform-configuration';
import { ContentTemplateEngine, EventModule } from '@pixel-brewery/archipel-platform-core';
import { type Abstract, type DynamicModule, type Provider, type Type, Module } from '@nestjs/common';
import type { DeliveryStrategyBase } from './delivering/strategies/abstracts/DeliveryStrategyBase.js';
import { PLATFORM_MAILING_CONFIG_ENTRIES } from './env.js';
import { MailEventSubscriber } from './events/listeners/MailEventSubscriber.js';
import type { IMailTemplateRepository } from './interfaces/IMailTemplateRepository.js';
import { MailService } from './services/MailService.js';
import { MailVerificationService } from './services/MailVerificationService.js';
import { SmtpConnectionVerifier } from './services/SmtpConnectionVerifier.js';
import { MailTemplateEngine } from './templating/MailTemplateEngine.js';
import type { TemplateFetchStrategyBase } from './templating/strategies/abstracts/TemplateFetchStrategyBase.js';
import { MAIL_DELIVERY_STRATEGY_TOKEN, MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN, MAIL_TEMPLATE_NAMES_TOKEN } from './tokens/MailTokens.js';

// #endregion

/**
 * Options for configuring the {@link MailModule}.
 *
 * @public
 */
export interface IMailModuleOptions {
    /**
     * Concrete implementation of the {@link DeliveryStrategyBase} abstract base.
     * For example, `SmtpDeliveryStrategy`, `PostmarkDeliveryStrategy`, or `EmptyDeliveryStrategy`.
     */
    readonly deliveryStrategy: Type<DeliveryStrategyBase>;

    /**
     * Concrete implementation of the {@link TemplateFetchStrategyBase} abstract base.
     * For example, `FileTemplateFetchStrategy`, `BlobTemplateFetchStrategy`, or `DatabaseTemplateFetchStrategy`.
     */
    readonly templateFetchStrategy: Type<TemplateFetchStrategyBase>;

    /**
     * Whether to register the module globally.
     * Defaults to `true`.
     */
    readonly isGlobal?: boolean;

    /**
     * Provider-specific configuration entries to register with the config module.
     */
    readonly configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * Template names to load when using the `FileTemplateFetchStrategy`.
     * Each name corresponds to a resource file (e.g. `'AuthRegister'` loads
     * `AuthRegister.html` and `AuthRegister.txt`).
     *
     * Defaults to an empty array (no templates loaded).
     */
    readonly templateNames?: ReadonlyArray<string>;

    /**
     * Provider for the `IMailTemplateRepository` abstract base.
     * Required when using `DatabaseTemplateFetchStrategy`.
     *
     * Example:
     * ```typescript
     * MailModule.register({
     *   deliveryStrategy: SmtpDeliveryStrategy,
     *   templateFetchStrategy: DatabaseTemplateFetchStrategy,
     *   templateRepositoryProvider: {
     *     provide: MAIL_TEMPLATE_REPOSITORY_TOKEN,
     *     useClass: PrismaMailTemplateRepository,
     *   }
     * })
     * ```
     */
    readonly templateRepositoryProvider?: Provider<IMailTemplateRepository>;
}

/**
 * Represents the mail module.
 *
 * Delivery and template strategies are selected at compile time via
 * `IMailModuleOptions`. NestJS DI resolves the concrete classes.
 *
 * @public
 */
@Module({})
export class MailModule {
    // #region Methods

    /**
     * Registers the mail module with the specified configuration.
     *
     * @param options - Module registration options.
     * @returns A configured `DynamicModule`.
     *
     * @public
     */
    public static register(options: IMailModuleOptions): DynamicModule {
        const isGlobal = options.isGlobal ?? true;
        const configEntries = options.configEntries ?? PLATFORM_MAILING_CONFIG_ENTRIES;

        const providers: Array<Provider> = [
            {
                provide: MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN,
                useClass: options.templateFetchStrategy,
            },
            {
                provide: MAIL_DELIVERY_STRATEGY_TOKEN,
                useClass: options.deliveryStrategy,
            },
            {
                provide: MAIL_TEMPLATE_NAMES_TOKEN,
                useValue: options.templateNames ?? [],
            },
            ContentTemplateEngine,
            MailService,
            MailTemplateEngine,
            MailVerificationService,
            SmtpConnectionVerifier,
            MailEventSubscriber,
        ];

        const exports: Array<Provider | Type | Abstract<unknown>> = [MailService, MailVerificationService, SmtpConnectionVerifier];

        if (options.templateRepositoryProvider) {
            providers.push(options.templateRepositoryProvider);
        }

        return {
            module: MailModule,
            global: isGlobal,
            imports: [ConfigModule.register('platform-mailing', configEntries), BlobModule, EventModule],
            providers,
            exports,
        };
    }

    // #endregion
}
