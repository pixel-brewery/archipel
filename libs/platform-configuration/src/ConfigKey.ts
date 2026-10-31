/**
 * A type-safe config key that encodes both the config key and the type of its value.
 *
 * **Why this exists**: In large codebases it is common for configuration values
 * (environment variables, feature flags, constants) to be accessed directly via
 * raw strings or via `process.env['SOME_KEY']`. This leads to several issues:
 *   • scattered literal strings making refactoring and discovery difficult,
 *   • lack of compile-time checking for correct key names,
 *   • no guarantee about the type of the value retrieved (string, number, boolean, etc),
 *   • difficulty enforcing a consistent mechanism for configuration access.
 *
 * To address these, we introduce a **typed config-key abstraction**:
 *   – each config key is defined once (via createConfigKey),
 *   – the `IConfigKey<TType>` carries at compile time the expected type of its value,
 *   – the runtime shape remains minimal (just a `key: string`),
 *   – developers are encouraged to use a central `ConfigService` to fetch values,
 *     rather than scattering `process.env[...]` everywhere.
 *
 * This improves:
 *   – discoverability (IDE autocomplete, "find usages" works),
 *   – safety (correct key names, correct value types),
 *   – maintainability (single source of truth for config keys),
 *   – clarity (developers see intent: "this key returns a number", "this key returns a boolean").
 *
 * @public
 */
export interface IConfigKey<TType = unknown> {
    /**
     * Phantom generic to encode the expected value type. This property
     * is never intended to be used at runtime.
     */
    readonly _type?: TType;

    /**
     * The unique string identifier for the configuration entry.
     * This typically corresponds to an environment variable name or config store key.
     */
    readonly key: string;
}

/**
 * Creates a type-safe config key.
 *
 * Use this factory function to define all configuration keys in your application.
 * This ensures you don't scatter raw strings and you assign a type to each key.
 *
 * @public
 * @param key – The unique string identifier for the config entry.
 *              For example: `'DATABASE_URL'`, `'featureX.enabled'`, `'timeout.ms'`.
 * @returns A branded config key of type `IConfigKey<TType>` where `TType` is
 *          inferred (or specified) as the expected type of the value.
 *
 * @example
 * ```typescript
 * // In some config-keys file
 * export const DATABASE_URL = createConfigKey<string>('DATABASE_URL');
 * export const MAX_TIMEOUT_MS = createConfigKey<number>('MAX_TIMEOUT_MS');
 * export const FEATURE_X_ENABLED = createConfigKey<boolean>('FEATURE_X_ENABLED');
 * ```
 *
 * Then, when fetching:
 * ```ts
 * const url = configService.get(DATABASE_URL);       // typed as string
 * const timeout = configService.get(MAX_TIMEOUT_MS); // typed as number
 * const enabled = configService.get(FEATURE_X_ENABLED); // typed as boolean
 * ```
 *
 * @remarks
 * At runtime the returned object is minimal (just `{ key: string }`) so there is
 * virtually no overhead. The generic `TType` is only used by TypeScript for stronger
 * compile-time checking - enabling you to avoid magic strings and untyped fetches.
 */
export function createConfigKey<TType = unknown>(key: string): IConfigKey<TType> {
    return { key } as IConfigKey<TType>;
}
