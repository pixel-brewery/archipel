// #region Imports

import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

/** Whether to skip the automatic database connection on module init. */
export const DB_AUTO_CONNECTION = createConfigKey<boolean>('DB_AUTO_CONNECTION');

/** Core configuration entries required by `platform-database`. */
export const PLATFORM_DATABASE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: DB_AUTO_CONNECTION,
        required: false,
        defaultValue: true,
        description: 'Whether to skip the automatic database connection on module init.',
    },
];
