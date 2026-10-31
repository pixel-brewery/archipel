// #region Imports

import { createConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Application
// ──────────────────────────────────────────────────────────────

/** Base URL the application is served from (e.g. `https://example.com`). */
export const APP_URL = createConfigKey<string>('APP_URL');

/** HTTP port the application listens on. */
export const APP_PORT = createConfigKey<number>('APP_PORT');

/** Semantic version of the running application (e.g. `1.2.3`). */
export const APP_VERSION = createConfigKey<string>('APP_VERSION');

/** Human-readable name of the application. */
export const APP_NAME = createConfigKey<string>('APP_NAME');

/** The current Node.js environment (`development`, `production`, etc.). */
export const NODE_ENV = createConfigKey<string>('NODE_ENV');

/** Git commit SHA of the current build. */
export const GIT_COMMIT = createConfigKey<string>('GIT_COMMIT');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-core`. */
export const PLATFORM_CORE_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: APP_URL, required: true, description: 'Base URL the application is served from.' },
    { key: APP_PORT, required: true, description: 'HTTP port the application listens on.' },
    { key: APP_VERSION, required: true, description: 'Semantic version of the running application.' },
    { key: APP_NAME, required: true, description: 'Human-readable name of the application.' },
    { key: NODE_ENV, required: false, defaultValue: 'development', description: 'The current Node.js environment.' },
    { key: GIT_COMMIT, required: false, defaultValue: 'unknown', description: 'Git commit SHA of the current build.' },
];
