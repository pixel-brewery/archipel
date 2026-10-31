// #region Imports

import { type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import {
    AUTH_APPLE_CALLBACK_URL,
    AUTH_APPLE_CLIENT_ID,
    AUTH_APPLE_KEY_ID,
    AUTH_APPLE_PRIVATE_KEY,
    AUTH_APPLE_SCOPE,
    AUTH_APPLE_STATE,
    AUTH_APPLE_TEAM_ID,
} from '../../env.js';

// #endregion

/** Configuration entries required by Apple Sign-In authentication. */
export const APPLE_AUTH_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AUTH_APPLE_PRIVATE_KEY, required: true, description: 'Apple Sign-In private key (PEM).' },
    { key: AUTH_APPLE_CLIENT_ID, required: true, description: 'Apple Sign-In client ID.' },
    { key: AUTH_APPLE_TEAM_ID, required: true, description: 'Apple developer team ID.' },
    { key: AUTH_APPLE_KEY_ID, required: true, description: 'Apple Sign-In key ID.' },
    {
        key: AUTH_APPLE_CALLBACK_URL,
        required: false,
        defaultValue: '/auth/apple/callback',
        description: 'Apple Sign-In callback URL.',
    },
    {
        key: AUTH_APPLE_SCOPE,
        required: false,
        defaultValue: 'name,email',
        description: 'Comma-separated list of Apple Sign-In scopes.',
    },
    {
        key: AUTH_APPLE_STATE,
        required: false,
        defaultValue: 'true',
        description:
            'Enable OAuth state parameter for CSRF protection. Requires a persistent session store. Set to "false" for stateless/serverless environments without a shared session store.',
    },
];
