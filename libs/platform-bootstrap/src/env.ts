import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

/** HTTP port exposed by serverless hosts such as Vercel. */
export const PORT = createConfigKey<number>('PORT');

/** Comma-separated list of allowed CORS origins. */
export const APP_CORS_ORIGIN = createConfigKey<string>('APP_CORS_ORIGIN');

/** Rate-limit window in milliseconds. */
export const APP_RATE_LIMIT_WINDOW_MS = createConfigKey<number>('APP_RATE_LIMIT_WINDOW_MS');

/** Maximum requests accepted within the rate-limit window. */
export const APP_RATE_LIMIT_MAX_REQUESTS = createConfigKey<number>('APP_RATE_LIMIT_MAX_REQUESTS');

/** Secret used by Express-compatible session middleware. */
export const AUTH_SESSION_SECRET = createConfigKey<string>('AUTH_SESSION_SECRET');

/** Whether session cookies should be marked secure. */
export const AUTH_SESSION_SECURE = createConfigKey<boolean>('AUTH_SESSION_SECURE');

/** Session cookie lifetime, for example `30d` or `86400000`. */
export const AUTH_SESSION_MAX_AGE = createConfigKey<string>('AUTH_SESSION_MAX_AGE');

/** Server bootstrap configuration entries provided by `platform-bootstrap`. */
export const PLATFORM_SERVER_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: PORT, required: false, description: 'HTTP port provided by serverless hosts such as Vercel.' },
];

/** Security step configuration entries provided by `platform-bootstrap/security`. */
export const PLATFORM_SECURITY_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: APP_CORS_ORIGIN, required: false, description: 'Comma-separated list of allowed CORS origins.' },
    { key: APP_RATE_LIMIT_WINDOW_MS, required: false, defaultValue: '60000', description: 'Rate-limit window in milliseconds.' },
    { key: APP_RATE_LIMIT_MAX_REQUESTS, required: false, defaultValue: '100', description: 'Maximum requests accepted within the rate-limit window.' },
];

/** Session step configuration entries provided by `platform-bootstrap/session`. */
export const PLATFORM_SESSION_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AUTH_SESSION_SECRET, required: true, description: 'Secret used by Express-compatible session middleware.' },
    { key: AUTH_SESSION_SECURE, required: false, defaultValue: 'false', description: 'Whether session cookies should be marked secure.' },
    { key: AUTH_SESSION_MAX_AGE, required: false, defaultValue: '1d', description: 'Session cookie lifetime.' },
];
