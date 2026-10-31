// #region Imports

import { Inject, Injectable } from '@nestjs/common';
import { ConfigKeyNotFoundError } from '../errors/ConfigKeyNotFoundError.js';
import { ConfigStrategyBase } from '../strategies/abstracts/ConfigStrategyBase.js';

// #endregion

@Injectable()
export class ConfigService {
    // #region Fields

    private readonly _strategy: ConfigStrategyBase;
    private readonly _statics: Record<string, string>;

    // #endregion

    // #region Ctor

    public constructor(@Inject(ConfigStrategyBase) strategy: ConfigStrategyBase, @Inject('CONFIG_STATICS') statics: Record<string, string>) {
        this._strategy = strategy;
        this._statics = statics;
    }

    // #endregion

    // #region Methods

    public initialize(): void {
        this._strategy.initialize();
    }

    /**
     * Retrieves the parsed value of the specified configuration key.
     * Automatically parses strings into numbers, booleans, or null if applicable.
     *
     * @template T - Expected type of the returned value.
     * @param {string} key - The configuration key to retrieve.
     * @returns {T} The parsed configuration value.
     */
    public get<T = string>(key: string): T {
        if (!this.has(key)) {
            throw new ConfigKeyNotFoundError(key, 'config');
        }

        const rawValue = this.resolve<string>(key);
        const parsedValue = this.parseValue<T>(rawValue);

        return parsedValue;
    }

    /**
     * Attempts to retrieve the value of the specified configuration key.
     * If the key does not exist, returns the provided fallback value.
     *
     * @template T - Expected type of the returned value.
     * @param {string} key - The configuration key to retrieve.
     * @param {T} fallback - The fallback value to return if the key is not found.
     * @returns {T} The resolved configuration value or the fallback value.
     */
    public tryGet<T = string>(key: string, fallback: T): T {
        if (!this.has(key)) {
            return fallback;
        }

        return this.tryResolve<T>(key, fallback);
    }

    /**
     * Compares the value of the specified configuration key with the given value.
     *
     * @template T - Expected type of the comparison value.
     * @param {string} key - The configuration key to compare.
     * @param {T} value - The value to compare against.
     * @returns {boolean} True if the resolved value matches; otherwise, false.
     */
    public compare<T = string>(key: string, value: T): boolean {
        const parsedValue = this.get<T>(key);
        return parsedValue === value;
    }

    /**
     * Parses a string value into its appropriate type.
     *
     * - Converts `'true'` and `'false'` to `boolean`.
     * - Returns `null` for empty strings.
     * - Returns the original string for all other cases.
     *
     * Note: numeric coercion was intentionally removed to prevent silent
     * type confusion (e.g. a abstract base string `"8080"` being read as a number
     * without the caller expecting it). Callers that need a numeric value
     * should declare their config key as `IConfigKey<number>` and parse
     * explicitly via `Number(configService.get(key))`.
     *
     * @private
     * @template T - The expected type of the parsed value.
     * @param {string | null} value - The value to parse.
     * @returns {T} The parsed value.
     */
    private parseValue<T>(value: string | null): T {
        if (value === null || value.trim() === '') {
            return null as unknown as T;
        }

        if (value.toLowerCase() === 'true') {
            return true as unknown as T;
        }

        if (value.toLowerCase() === 'false') {
            return false as unknown as T;
        }

        return value as unknown as T;
    }

    /**
     * Checks if the specified configuration key exists, checking statics first.
     *
     * @param key The configuration key.
     * @returns True if the key exists; otherwise, false.
     */
    private has(key: string): boolean {
        if (this._statics[key] !== undefined) {
            return true;
        }

        return this._strategy.has(key);
    }

    /**
     * Resolves the value for the given key, checking statics first.
     *
     * @param key The configuration key.
     * @returns The resolved configuration value.
     */
    private resolve<T>(key: string): T {
        if (this._statics[key] !== undefined) {
            return this._statics[key] as unknown as T;
        }

        return this._strategy.resolve<T>(key);
    }

    /**
     * Attempts to resolve the value for the given key, checking statics first.
     * If not found, returns the provided fallback value.
     *
     * @param key The configuration key.
     * @param fallback The fallback value.
     * @returns The resolved configuration value or the fallback.
     */
    private tryResolve<T>(key: string, fallback: T): T {
        if (this._statics[key] !== undefined) {
            return this._statics[key] as unknown as T;
        }

        return this._strategy.tryResolve<T>(key, fallback);
    }

    // #endregion
}
