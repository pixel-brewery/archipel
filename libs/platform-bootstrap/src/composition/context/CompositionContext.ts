// #region Imports

import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import type { INestApplicationContext } from '@nestjs/common';
import type { ICompositionContext } from './ICompositionContext.js';

// #endregion

/**
 * Default implementation of the composition context.
 *
 * Wraps a temporary NestJS application context and provides convenient
 * access to configuration values during module composition.
 *
 * @public
 */
export class CompositionContext implements ICompositionContext {
    // #region Fields

    private readonly _context: INestApplicationContext;
    private readonly _config: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new composition context.
     *
     * @param context - The temporary NestJS application context.
     * @param config - The configuration service instance.
     *
     * @public
     */
    public constructor(context: INestApplicationContext, config: ConfigService) {
        this._context = context;
        this._config = config;
    }

    // #endregion

    // #region Properties

    /**
     * {@inheritDoc ICompositionContext.context}
     */
    public get context(): INestApplicationContext {
        return this._context;
    }

    /**
     * {@inheritDoc ICompositionContext.config}
     */
    public get config(): ConfigService {
        return this._config;
    }

    // #endregion

    // #region Methods

    /**
     * {@inheritDoc ICompositionContext.getConfigValue}
     */
    public getConfigValue<T>(key: IConfigKey<T>): T {
        return this._config.get<T>(key.key);
    }

    /**
     * {@inheritDoc ICompositionContext.tryGetConfigValue}
     */
    public tryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T {
        return this._config.tryGet<T>(key.key, fallback);
    }

    /**
     * {@inheritDoc ICompositionContext.getService}
     */
    public getService<T>(token: abstract new (...args: Array<unknown>) => T): T {
        return this._context.get<T>(token, { strict: false });
    }

    /**
     * {@inheritDoc ICompositionContext.close}
     */
    public async close(): Promise<void> {
        await this._context.close();
    }

    // #endregion
}
