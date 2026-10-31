// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { ConfigKeyNotFoundError } from '../errors/ConfigKeyNotFoundError.js';
import { ConfigStrategyBase } from './abstracts/ConfigStrategyBase.js';

// #endregion

/**
 * The `EnvironmentConfigStrategy` class.
 *
 * @public
 */
@Injectable()
export class EnvironmentConfigStrategy extends ConfigStrategyBase {
    // #region Fields

    private _envConfig: NodeJS.Dict<string>;

    // #endregion

    // #region Ctor

    public constructor() {
        super();
        this._envConfig = {};
    }

    // #endregion

    // #region Methods

    public initialize(): void {
        this._envConfig = process.env;
    }

    public resolve<T>(key: string): T {
        const value = this._envConfig[key] as T | undefined;

        if (value === undefined) {
            throw new ConfigKeyNotFoundError(key, 'process.env');
        }

        return value;
    }

    public tryResolve<T>(key: string, fallback: T): T {
        const value = this._envConfig[key] as T | undefined;

        if (value === undefined) {
            Logger.warn(`Config key: ${key} not found in process.env, returning fallback value.`, 'EnvironmentConfigStrategy');
            return fallback;
        }

        return value;
    }

    public has(key: string): boolean {
        return this._envConfig[key] !== undefined;
    }

    // #endregion
}
