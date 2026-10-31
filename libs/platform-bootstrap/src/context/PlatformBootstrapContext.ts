import { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { INestApplication, Type } from '@nestjs/common';

/**
 * Runtime context shared by platform bootstrap steps.
 *
 * @public
 */
export class PlatformBootstrapContext<TApplication extends INestApplication = INestApplication> {
    // #region Fields

    private readonly _app: TApplication;
    private readonly _configService: ConfigService | undefined;

    // #endregion

    // #region Ctor

    public constructor(app: TApplication, configService?: ConfigService) {
        this._app = app;
        this._configService = configService;
    }

    // #endregion

    // #region Properties

    /**
     * The wrapped NestJS application.
     *
     * @public
     */
    public get app(): TApplication {
        return this._app;
    }

    /**
     * The Archipel configuration service resolved from the app or builder options.
     *
     * @public
     */
    public get config(): ConfigService {
        return this._configService ?? this.getService(ConfigService);
    }

    // #endregion

    // #region Methods

    /**
     * Resolves a provider from the NestJS application container.
     *
     * @public
     * @param token - The provider token.
     * @returns The resolved provider instance.
     */
    public getService<TService>(token: Type<TService> | string | symbol): TService {
        return this._app.get<TService>(token, { strict: false });
    }

    /**
     * Reads a required value from the configuration service.
     *
     * @public
     * @param key - The typed configuration key.
     * @returns The typed configuration value.
     */
    public getConfigValue<TValue>(key: IConfigKey<TValue>): TValue {
        return this.config.get<TValue>(key.key);
    }

    /**
     * Reads an optional value from the configuration service.
     *
     * @public
     * @param key - The typed configuration key.
     * @param fallback - The fallback value when the key is absent.
     * @returns The typed configuration value or fallback.
     */
    public tryGetConfigValue<TValue>(key: IConfigKey<TValue>, fallback: TValue): TValue {
        return this.config.tryGet<TValue>(key.key, fallback);
    }

    // #endregion
}
