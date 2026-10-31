// #region Imports

import { type IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import { AUTH_GITHUB_CALLBACK_URL, AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, AUTH_GITHUB_SCOPE, AUTH_GITHUB_STATE } from '../../env.js';

// #endregion

/** Configuration entries required by GitHub OAuth authentication. */
export const GITHUB_AUTH_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: AUTH_GITHUB_CLIENT_ID, required: true, description: 'GitHub OAuth client ID.' },
    { key: AUTH_GITHUB_CLIENT_SECRET, required: true, description: 'GitHub OAuth client secret.' },
    {
        key: AUTH_GITHUB_CALLBACK_URL,
        required: false,
        defaultValue: '/auth/github/callback',
        description: 'GitHub OAuth callback URL.',
    },
    {
        key: AUTH_GITHUB_SCOPE,
        required: false,
        defaultValue: 'user:email',
        description: 'Comma-separated list of GitHub OAuth scopes.',
    },
    {
        key: AUTH_GITHUB_STATE,
        required: false,
        defaultValue: 'true',
        description:
            'Enable OAuth state parameter for CSRF protection. Requires a persistent session store. Set to "false" for stateless/serverless environments without a shared session store.',
    },
];
