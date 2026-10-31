// #region Imports

import { IConfigKey } from './ConfigKey.js';

// #endregion

/**
 * Describes a registered configuration entry, including its source module and
 * whether the entry is required or optional (with a default value).
 *
 * @public
 */
export interface IConfigRegistryEntry<TType = unknown> {
    /**
     * The typed configuration key.
     */
    readonly key: IConfigKey<TType>;

    /**
     * The name of the module that registered this key (e.g. `'platform-authentication'`).
     */
    readonly module: string;

    /**
     * Whether the configuration value is required at startup.
     * If `true`, the application should fail fast when the value is missing.
     */
    readonly required: boolean;

    /**
     * An optional default value used when the key is not set.
     * Only meaningful when `required` is `false`.
     */
    readonly defaultValue?: TType;

    /**
     * An optional human-readable description of the configuration entry.
     */
    readonly description?: string;
}

/**
 * A static, global registry that collects all configuration keys registered by
 * platform libraries. This enables a central overview of every environment
 * variable the application depends on, grouped by source module.
 *
 * Libraries register their keys during module initialisation via
 * {@link ConfigModule.register} or by calling {@link ConfigRegistry.register}
 * directly.
 *
 * @public
 */
export class ConfigRegistry {
    // #region Fields

    private static readonly _entries: Map<string, IConfigRegistryEntry> = new Map();

    // #endregion

    // #region Methods

    /**
     * Registers one or more configuration entries.
     *
     * @param module - The logical module name (e.g. `'platform-mailing'`).
     * @param entries - The configuration entries to register.
     */
    public static register(module: string, entries: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>): void {
        for (const entry of entries) {
            const compositeKey = `${module}::${entry.key.key}`;
            this._entries.set(compositeKey, { ...entry, module });
        }
    }

    /**
     * Returns all registered configuration entries as a flat array.
     */
    public static getAll(): ReadonlyArray<IConfigRegistryEntry> {
        return Array.from(this._entries.values());
    }

    /**
     * Returns all registered entries grouped by their source module.
     */
    public static getByModule(): ReadonlyMap<string, ReadonlyArray<IConfigRegistryEntry>> {
        const grouped = new Map<string, Array<IConfigRegistryEntry>>();

        for (const entry of this._entries.values()) {
            let list = grouped.get(entry.module);
            if (!list) {
                list = [];
                grouped.set(entry.module, list);
            }
            list.push(entry);
        }

        return grouped;
    }

    /**
     * Returns all registered entries whose `required` flag is `true`.
     */
    public static getRequired(): ReadonlyArray<IConfigRegistryEntry> {
        return this.getAll().filter((e) => e.required);
    }

    /**
     * Returns all unique module names that have registered keys.
     */
    public static getModules(): ReadonlyArray<string> {
        const modules = new Set<string>();
        for (const entry of this._entries.values()) {
            modules.add(entry.module);
        }

        return Array.from(modules);
    }

    /**
     * Resets the registry. Intended for testing purposes only.
     *
     * @internal
     */
    public static clear(): void {
        this._entries.clear();
    }

    // #endregion
}
