// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { ConfigKeyNotFoundError } from '../errors/ConfigKeyNotFoundError.js';
import { ConfigStrategyBase } from './abstracts/ConfigStrategyBase.js';

// #endregion

/**
 * The `FileConfigStrategy` class.
 *
 * @public
 */
@Injectable()
export class FileConfigStrategy extends ConfigStrategyBase {
    // #region Fields

    private readonly _envFile: string;
    private _envConfig: Record<string, string>;

    // #endregion

    // #region Ctor

    public constructor(envFile: string) {
        super();
        this._envFile = envFile;
        this._envConfig = {};
    }

    // #endregion

    // #region Methods

    public initialize(): void {
        if (existsSync(this._envFile)) {
            this._envConfig = dotenv.parse(readFileSync(this._envFile));
        }
    }

    public resolve<T>(key: string): T {
        const value = this._envConfig[key] as T | undefined;

        if (value === undefined) {
            throw new ConfigKeyNotFoundError(key, `env file: ${this._envFile}`);
        }

        return value;
    }

    public tryResolve<T>(key: string, fallback: T): T {
        const value = this._envConfig[key] as T | undefined;

        if (value === undefined) {
            Logger.warn(`Config key: ${key} not found in env file: ${this._envFile}, returning fallback value.`, 'FileConfigStrategy');
            return fallback;
        }

        return value;
    }

    public has(key: string): boolean {
        return this._envConfig[key] !== undefined;
    }

    // #endregion
}
