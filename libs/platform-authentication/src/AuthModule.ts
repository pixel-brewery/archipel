// #region Imports

import { ConfigModule, ConfigService, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils, EventModule, HostModule, IdentifierModule, LimitRequestSizeMiddleware, StringValue } from '@pixel-brewery/archipel-platform-core';
import { DeviceParserService } from '@pixel-brewery/archipel-platform-core/device';
import { BcryptService, CryptoService } from '@pixel-brewery/archipel-platform-cryptography';
import { MappingModule } from '@pixel-brewery/archipel-platform-mapping';
import { DynamicModule, Global, MiddlewareConsumer, Module, RequestMethod, Type, type Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AnonymousConnector } from './connectors/AnonymousConnector.js';
import { JwtConnector } from './connectors/JwtConnector.js';
import { LocalConnector } from './connectors/LocalConnector.js';
import { AuthSubjectBase } from './abstracts/AuthSubjectBase.js';
import { ChallengeStoreBase } from './abstracts/ChallengeStoreBase.js';
import { MfaSubjectBase } from './abstracts/MfaSubjectBase.js';
import { SessionPersistenceBase } from './abstracts/SessionPersistenceBase.js';
import { SocialAuthBase } from './abstracts/SocialAuthBase.js';
import { TokenEnricherBase } from './abstracts/TokenEnricherBase.js';
import { VerificationSubjectBase } from './abstracts/VerificationSubjectBase.js';
import { AUTH_JWT_EXPIRES_IN, AUTH_JWT_SECRET, PLATFORM_AUTHENTICATION_CONFIG_ENTRIES } from './env.js';
import { AnonymousAuthGuard } from './guards/AnonymousAuthGuard.js';
import { JwtAuthGuard } from './guards/JwtAuthGuard.js';
import { LocalAuthGuard } from './guards/LocalAuthGuard.js';
import { RolesGuard } from './guards/RolesGuard.js';
import { SessionMappingProfile } from './mappers/SessionMappingProfile.js';
import { EmailOtpMfaChannel } from './mfa/channels/EmailOtpMfaChannel.js';
import { PushMfaChannel } from './mfa/channels/PushMfaChannel.js';
import { SmsMfaChannel } from './mfa/channels/SmsMfaChannel.js';
import { type IMfaChannel } from './mfa/IMfaChannel.js';
import { MfaEncryptionService } from './mfa/MfaEncryptionService.js';
import { MfaService } from './mfa/MfaService.js';
import { MFA_CHANNELS } from './mfa/tokens/MfaTokens.js';
import { LastActiveMiddleware } from './middlewares/index.js';
import { SessionSerializer } from './serializer/SessionSerializer.js';
import { AuthTokenService } from './services/AuthTokenService.js';
import { ChallengeService } from './services/ChallengeService.js';
import { InMemoryChallengeStore } from './services/InMemoryChallengeStore.js';
import { SessionService } from './services/SessionService.js';
import { VerificationService } from './services/VerificationService.js';

// #endregion

/**
 * Options for configuring the `AuthModule`.
 *
 * @public
 */
export interface IAuthModuleOptions {
    /**
     * Implementation of the auth subject abstract base (user lookup for JWT/Local/Anonymous connectors).
     */
    authSubject: Type<AuthSubjectBase>;

    /**
     * Implementation of the MFA subject abstract base (MFA state persistence).
     */
    mfaSubject: Type<MfaSubjectBase>;

    /**
     * Implementation of the session persistence abstract base.
     */
    sessionPersistence: Type<SessionPersistenceBase>;

    /**
     * Implementation of the verification subject abstract base (email/pin verification).
     */
    verificationSubject: Type<VerificationSubjectBase>;

    /**
     * Optional implementation of the social auth abstract base (OAuth connectors).
     * When provided together with `socialConnectors`, the social auth flow is enabled.
     */
    socialAuth?: Type<SocialAuthBase>;

    /**
     * Optional array of social connector types to register (e.g. `AppleConnector`, `GithubConnector`).
     * Import them from the provider-specific sub-paths
     * (e.g. `@pixel-brewery/archipel-platform-authentication/connectors/apple`).
     * Requires `socialAuth` to be set.
     */
    socialConnectors?: Array<Type>;

    /**
     * Optional additional configuration entries to register (e.g. provider-specific OAuth keys).
     * Import them from the provider-specific sub-paths
     * (e.g. `APPLE_AUTH_CONFIG_ENTRIES` from `@pixel-brewery/archipel-platform-authentication/connectors/apple`).
     */
    additionalConfigEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * Optional implementation of the token enricher abstract base.
     * When provided, additional claims are added to JWT tokens.
     */
    tokenEnricher?: Type<TokenEnricherBase>;

    /**
     * Optional array of additional MFA channel types to register (e.g. `TotpMfaChannel`).
     * Import them from the provider-specific sub-paths
     * (e.g. `@pixel-brewery/archipel-platform-authentication/mfa/totp`).
     *
     * Built-in channels (SMS, Email, Push) are always registered.
     */
    mfaChannels?: Array<Type>;

    /**
     * Optional additional providers required by optional features (e.g. TOTP MFA).
     * Import them from the provider-specific sub-paths
     * (e.g. `TOTP_MFA_PROVIDERS` from `@pixel-brewery/archipel-platform-authentication/mfa/totp`).
     */
    additionalProviders?: Array<Provider>;

    /**
     * Optional implementation of the challenge store abstract base.
     * Defaults to an in-memory store suitable for single-instance deployments.
     * For multi-instance deployments, provide a Redis-backed implementation.
     */
    challengeStore?: Type<ChallengeStoreBase>;

    /**
     * Optional middleware configuration.
     * Controls registration of `LastActiveMiddleware` and `LimitRequestSizeMiddleware`.
     * Both are enabled by default when omitted.
     */
    middleware?: IAuthMiddlewareOptions;
}

/**
 * Configuration for the auth module's middleware registration.
 *
 * @public
 */
export interface IAuthMiddlewareOptions {
    /**
     * Configuration for the last-active tracking middleware.
     * - `true` or `undefined`: enabled for all routes (default)
     * - `false`: disabled entirely
     */
    lastActive?: boolean;

    /**
     * Configuration for the request size limit middleware on the register endpoint.
     * - `undefined`: enabled with default path `'auth/register'`
     * - `false`: disabled entirely
     * - `string`: custom path for the register endpoint (relative, without global prefix)
     */
    requestSizeLimit?: false | string;
}

/**
 * The `AuthModule` handles JWT-based authentication,
 * including token creation and validation.
 *
 * **Rate Limiting:** This library does not expose controllers. Consumers should
 * apply `@nestjs/throttler` guards on their auth endpoints (login, MFA verify)
 * to prevent brute-force attacks (recommended: 5 req/min per IP + username).
 *
 * **OAuth CSRF Protection:** All social connectors use `state: true` which requires
 * a session middleware (e.g. `express-session`) to store and verify OAuth state
 * parameters. Ensure your application configures session middleware before using
 * social connectors.
 *
 * @public
 */
@Global()
@Module({})
export class AuthModule {
    // #region Fields

    private static _options: IAuthModuleOptions | undefined;

    // #endregion

    // #region Methods

    /**
     * Registers the auth module with the provided abstract base implementations.
     *
     * @public
     * @param options - Abstract Base implementations for the auth module.
     * @returns The configured dynamic module.
     */
    public static register(options: IAuthModuleOptions): DynamicModule {
        AuthModule._options = options;

        const portProviders: Array<{ provide: abstract new (...args: unknown[]) => unknown; useClass: Type }> = [
            { provide: AuthSubjectBase, useClass: options.authSubject },
            { provide: MfaSubjectBase, useClass: options.mfaSubject },
            { provide: SessionPersistenceBase, useClass: options.sessionPersistence },
            { provide: VerificationSubjectBase, useClass: options.verificationSubject },
        ];

        if (options.socialAuth) {
            portProviders.push({ provide: SocialAuthBase, useClass: options.socialAuth });
        }

        if (options.tokenEnricher) {
            portProviders.push({ provide: TokenEnricherBase, useClass: options.tokenEnricher });
        }

        portProviders.push({
            provide: ChallengeStoreBase,
            useClass: options.challengeStore ?? InMemoryChallengeStore,
        });

        const connectors = [JwtConnector, LocalConnector, AnonymousConnector];

        if (options.socialConnectors) {
            connectors.push(...options.socialConnectors);
        }

        const builtInMfaChannels: Array<Type> = [SmsMfaChannel, EmailOtpMfaChannel, PushMfaChannel];
        const allMfaChannels = [...builtInMfaChannels, ...(options.mfaChannels ?? [])];

        const configEntries: Array<Omit<IConfigRegistryEntry, 'module'>> = [
            ...PLATFORM_AUTHENTICATION_CONFIG_ENTRIES,
            ...(options.additionalConfigEntries ?? []),
        ];

        return {
            module: AuthModule,
            imports: [
                ConfigModule.register('platform-authentication', configEntries),
                EventModule,
                IdentifierModule,
                HostModule,
                PassportModule.register({
                    defaultStrategy: 'jwt',
                    session: true,
                }),
                JwtModule.registerAsync({
                    imports: [ConfigModule.register('platform-authentication', configEntries)],
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => {
                        const secret = configService.get<string>(AUTH_JWT_SECRET.key);
                        const MIN_SECRET_LENGTH = 32;
                        if (secret.length < MIN_SECRET_LENGTH) {
                            throw new Error(`AUTH_JWT_SECRET must be at least ${MIN_SECRET_LENGTH} characters (256 bits). Current length: ${secret.length}`);
                        }

                        const expiresInMilliseconds = DateTimeUtils.parse(configService.get<StringValue>(AUTH_JWT_EXPIRES_IN.key));
                        // jsonwebtoken treats numeric expiresIn values as seconds, while DateTimeUtils.parse returns milliseconds.
                        const expiresInSeconds = expiresInMilliseconds / 1000;

                        return {
                            secret,
                            signOptions: {
                                expiresIn: expiresInSeconds,
                            },
                        };
                    },
                }),
                MappingModule.withProfiles([SessionMappingProfile]),
            ],
            providers: [
                ...portProviders,
                ...connectors,
                ...(options.additionalProviders ?? []),
                ...allMfaChannels,
                SessionSerializer,
                JwtAuthGuard,
                LocalAuthGuard,
                AnonymousAuthGuard,
                RolesGuard,
                AuthTokenService,
                VerificationService,
                SessionService,
                MfaService,
                ChallengeService,
                MfaEncryptionService,
                {
                    provide: MFA_CHANNELS,
                    useFactory: (...channels: IMfaChannel[]) => channels,
                    inject: allMfaChannels,
                },
                DeviceParserService,
                LastActiveMiddleware,
                BcryptService,
                CryptoService,
            ],
            exports: [
                AuthTokenService,
                VerificationService,
                SessionService,
                MfaService,
                ChallengeService,
                JwtAuthGuard,
                LocalAuthGuard,
                AnonymousAuthGuard,
                RolesGuard,
                BcryptService,
                CryptoService,
            ],
        };
    }

    public configure(consumer: MiddlewareConsumer): void {
        const middleware = AuthModule._options?.middleware;

        if (middleware?.requestSizeLimit !== false) {
            const registerPath = typeof middleware?.requestSizeLimit === 'string' ? middleware.requestSizeLimit : 'auth/register';

            consumer.apply(LimitRequestSizeMiddleware).forRoutes({
                path: registerPath,
                method: RequestMethod.POST,
            });
        }

        if (middleware?.lastActive !== false) {
            consumer.apply(LastActiveMiddleware).forRoutes({
                path: '/{*path}',
                method: RequestMethod.ALL,
            });
        }
    }

    // #endregion
}
