// #region Imports

import { ConfigRegistry, createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Swagger / OpenAPI
// ──────────────────────────────────────────────────────────────

/** Application version shown in the Swagger document. */
export const APP_VERSION = createConfigKey<string>('APP_VERSION');

/** Contact name displayed in the Swagger document. */
export const SWAGGER_CONTACT_NAME = createConfigKey<string>('SWAGGER_CONTACT_NAME');

/** Contact URL displayed in the Swagger document. */
export const SWAGGER_CONTACT_URL = createConfigKey<string>('SWAGGER_CONTACT_URL');

/** Contact e-mail displayed in the Swagger document. */
export const SWAGGER_CONTACT_EMAIL = createConfigKey<string>('SWAGGER_CONTACT_EMAIL');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-openapi`. */
export const PLATFORM_OPENAPI_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: APP_VERSION, required: true, description: 'Application version for the Swagger document.' },
    { key: SWAGGER_CONTACT_NAME, required: true, description: 'Contact name in Swagger docs.' },
    { key: SWAGGER_CONTACT_URL, required: true, description: 'Contact URL in Swagger docs.' },
    { key: SWAGGER_CONTACT_EMAIL, required: true, description: 'Contact e-mail in Swagger docs.' },
];

// Self-register (platform-openapi has no dedicated NestJS module)
ConfigRegistry.register('platform-openapi', PLATFORM_OPENAPI_CONFIG_ENTRIES);
