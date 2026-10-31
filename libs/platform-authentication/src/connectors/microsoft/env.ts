// #region Imports

import { type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import {
    AUTH_MICROSOFT_CALLBACK_URL,
    AUTH_MICROSOFT_CLIENT_ID,
    AUTH_MICROSOFT_CLIENT_SECRET,
    AUTH_MICROSOFT_SCOPE,
    AUTH_MICROSOFT_STATE,
    AUTH_MICROSOFT_TENANT,
} from '../../env.js';

// #endregion

/** Configuration entries required by Microsoft OAuth authentication. */
export const MICROSOFT_AUTH_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AUTH_MICROSOFT_CLIENT_ID, required: true, description: 'Microsoft OAuth2 client ID.' },
    { key: AUTH_MICROSOFT_CLIENT_SECRET, required: true, description: 'Microsoft OAuth2 client secret.' },
    {
        key: AUTH_MICROSOFT_CALLBACK_URL,
        required: false,
        defaultValue: '/auth/microsoft/callback',
        description: 'Microsoft OAuth2 callback URL.',
    },
    { key: AUTH_MICROSOFT_TENANT, required: false, defaultValue: 'common', description: 'Microsoft tenant ID.' },
    {
        key: AUTH_MICROSOFT_SCOPE,
        required: false,
        defaultValue: 'user.read',
        description: 'Comma-separated list of Microsoft OAuth scopes.',
    },
    {
        key: AUTH_MICROSOFT_STATE,
        required: false,
        defaultValue: 'true',
        description:
            'Enable OAuth state parameter for CSRF protection. Requires a persistent session store. Set to "false" for stateless/serverless environments without a shared session store.',
    },
];
