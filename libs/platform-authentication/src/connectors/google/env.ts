// #region Imports

import { type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { AUTH_GOOGLE_CALLBACK_URL, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_GOOGLE_SCOPE, AUTH_GOOGLE_STATE } from '../../env.js';

// #endregion

/** Configuration entries required by Google OAuth authentication. */
export const GOOGLE_AUTH_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AUTH_GOOGLE_CLIENT_ID, required: true, description: 'Google OAuth2 client ID.' },
    { key: AUTH_GOOGLE_CLIENT_SECRET, required: true, description: 'Google OAuth2 client secret.' },
    {
        key: AUTH_GOOGLE_CALLBACK_URL,
        required: false,
        defaultValue: '/auth/google/callback',
        description: 'Google OAuth2 callback URL.',
    },
    {
        key: AUTH_GOOGLE_SCOPE,
        required: false,
        defaultValue: 'email,profile',
        description: 'Comma-separated list of Google OAuth scopes.',
    },
    {
        key: AUTH_GOOGLE_STATE,
        required: false,
        defaultValue: 'true',
        description:
            'Enable OAuth state parameter for CSRF protection. Requires a persistent session store. Set to "false" for stateless/serverless environments without a shared session store.',
    },
];
