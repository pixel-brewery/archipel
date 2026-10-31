import { createConfigKey, type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

/** New Relic ingest license key. Missing credentials disable export; hosts may require the key outside local development. */
export const NEW_RELIC_LICENSE_KEY = createConfigKey<string>('NEW_RELIC_LICENSE_KEY');

/** Register these entries with the host's ConfigModule before selecting the New Relic measurement sink. */
export const NEW_RELIC_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    {
        key: NEW_RELIC_LICENSE_KEY,
        required: false,
        defaultValue: '',
        description: 'New Relic Metric and Log API ingest license key for the explicitly configured account region.',
    },
];
