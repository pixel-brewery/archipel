// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

/** Secret used to sign JWTs. */
export const AUTH_JWT_SECRET = createConfigKey<string>('AUTH_JWT_SECRET');

/** Lifetime of access tokens (e.g. `'15m'`, `'1h'`). */
export const AUTH_JWT_EXPIRES_IN = createConfigKey<string>('AUTH_JWT_EXPIRES_IN');

/** Lifetime of email-verification JWTs. */
export const AUTH_VERIFY_JWT_EXPIRES_IN = createConfigKey<string>('AUTH_VERIFY_JWT_EXPIRES_IN');

/** AES encryption key used to encrypt MFA secrets at rest. */
export const AUTH_MFA_ENCRYPTION_KEY = createConfigKey<string>('AUTH_MFA_ENCRYPTION_KEY');

/** How long an MFA challenge stays valid (e.g. `'5m'`). */
export const AUTH_MFA_CHALLENGE_EXPIRES_IN = createConfigKey<string>('AUTH_MFA_CHALLENGE_EXPIRES_IN');

/** Maximum number of failed MFA attempts before lockout. */
export const AUTH_MFA_MAX_ATTEMPTS = createConfigKey<string>('AUTH_MFA_MAX_ATTEMPTS');

/** Issuer name shown in authenticator apps for TOTP MFA. */
export const AUTH_MFA_ISSUER = createConfigKey<string>('AUTH_MFA_ISSUER');

/** Time-to-live for SMS OTP codes (e.g. `'10m'`). */
export const AUTH_MFA_SMS_CODE_TTL = createConfigKey<string>('AUTH_MFA_SMS_CODE_TTL');

/** Minimum interval between SMS resend requests (e.g. `'30s'`). */
export const AUTH_MFA_SMS_MIN_RESEND = createConfigKey<string>('AUTH_MFA_SMS_MIN_RESEND');

/** Time-to-live for email OTP codes (e.g. `'10m'`). */
export const AUTH_MFA_EMAIL_CODE_TTL = createConfigKey<string>('AUTH_MFA_EMAIL_CODE_TTL');

/** Minimum interval between email OTP resend requests (e.g. `'30s'`). */
export const AUTH_MFA_EMAIL_MIN_RESEND = createConfigKey<string>('AUTH_MFA_EMAIL_MIN_RESEND');

/** Time-to-live for push OTP codes (e.g. `'10m'`). */
export const AUTH_MFA_PUSH_CODE_TTL = createConfigKey<string>('AUTH_MFA_PUSH_CODE_TTL');

/** Minimum interval between push OTP resend requests (e.g. `'30s'`). */
export const AUTH_MFA_PUSH_MIN_RESEND = createConfigKey<string>('AUTH_MFA_PUSH_MIN_RESEND');

/** Google OAuth2 client ID. */
export const AUTH_GOOGLE_CLIENT_ID = createConfigKey<string>('AUTH_GOOGLE_CLIENT_ID');

/** Google OAuth2 client secret. */
export const AUTH_GOOGLE_CLIENT_SECRET = createConfigKey<string>('AUTH_GOOGLE_CLIENT_SECRET');

/** Google OAuth2 callback URL. */
export const AUTH_GOOGLE_CALLBACK_URL = createConfigKey<string>('AUTH_GOOGLE_CALLBACK_URL');

/** Comma-separated list of Google OAuth scopes (e.g. `'email,profile'`). */
export const AUTH_GOOGLE_SCOPE = createConfigKey<string>('AUTH_GOOGLE_SCOPE');

/**
 * Whether to enable the OAuth `state` parameter for CSRF protection on the Google connector.
 * Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
 * (`'false'`) for stateless / serverless environments without a shared session store.
 */
export const AUTH_GOOGLE_STATE = createConfigKey<string>('AUTH_GOOGLE_STATE');

/** Microsoft OAuth2 client ID. */
export const AUTH_MICROSOFT_CLIENT_ID = createConfigKey<string>('AUTH_MICROSOFT_CLIENT_ID');

/** Microsoft OAuth2 client secret. */
export const AUTH_MICROSOFT_CLIENT_SECRET = createConfigKey<string>('AUTH_MICROSOFT_CLIENT_SECRET');

/** Microsoft OAuth2 callback URL. */
export const AUTH_MICROSOFT_CALLBACK_URL = createConfigKey<string>('AUTH_MICROSOFT_CALLBACK_URL');

/** Microsoft tenant ID or `'common'` for multi-tenant. */
export const AUTH_MICROSOFT_TENANT = createConfigKey<string>('AUTH_MICROSOFT_TENANT');

/** Comma-separated list of Microsoft OAuth scopes (e.g. `'user.read,mail.read'`). */
export const AUTH_MICROSOFT_SCOPE = createConfigKey<string>('AUTH_MICROSOFT_SCOPE');

/**
 * Whether to enable the OAuth `state` parameter for CSRF protection on the Microsoft connector.
 * Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
 * (`'false'`) for stateless / serverless environments without a shared session store.
 */
export const AUTH_MICROSOFT_STATE = createConfigKey<string>('AUTH_MICROSOFT_STATE');

/** Apple Sign-In private key (PEM string). */
export const AUTH_APPLE_PRIVATE_KEY = createConfigKey<string>('AUTH_APPLE_PRIVATE_KEY');

/** Apple Sign-In client (service) ID. */
export const AUTH_APPLE_CLIENT_ID = createConfigKey<string>('AUTH_APPLE_CLIENT_ID');

/** Apple developer team ID. */
export const AUTH_APPLE_TEAM_ID = createConfigKey<string>('AUTH_APPLE_TEAM_ID');

/** Apple Sign-In key ID. */
export const AUTH_APPLE_KEY_ID = createConfigKey<string>('AUTH_APPLE_KEY_ID');

/** Apple Sign-In callback URL. */
export const AUTH_APPLE_CALLBACK_URL = createConfigKey<string>('AUTH_APPLE_CALLBACK_URL');

/** Comma-separated list of Apple Sign-In scopes (e.g. `'name,email'`). */
export const AUTH_APPLE_SCOPE = createConfigKey<string>('AUTH_APPLE_SCOPE');

/**
 * Whether to enable the OAuth `state` parameter for CSRF protection on the Apple connector.
 * Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
 * (`'false'`) for stateless / serverless environments without a shared session store.
 */
export const AUTH_APPLE_STATE = createConfigKey<string>('AUTH_APPLE_STATE');

/** GitHub OAuth client ID. */
export const AUTH_GITHUB_CLIENT_ID = createConfigKey<string>('AUTH_GITHUB_CLIENT_ID');

/** GitHub OAuth client secret. */
export const AUTH_GITHUB_CLIENT_SECRET = createConfigKey<string>('AUTH_GITHUB_CLIENT_SECRET');

/** GitHub OAuth callback URL. */
export const AUTH_GITHUB_CALLBACK_URL = createConfigKey<string>('AUTH_GITHUB_CALLBACK_URL');

/** Comma-separated list of GitHub OAuth scopes (e.g. `'user:email,read:user'`). */
export const AUTH_GITHUB_SCOPE = createConfigKey<string>('AUTH_GITHUB_SCOPE');

/**
 * Whether to enable the OAuth `state` parameter for CSRF protection on the GitHub connector.
 * Requires a persistent session store (e.g. Redis) to verify state on callback. Disable
 * (`'false'`) for stateless / serverless environments without a shared session store.
 */
export const AUTH_GITHUB_STATE = createConfigKey<string>('AUTH_GITHUB_STATE');

/** Username used for the anonymous seed user. */
export const SEED_ANONYMOUS_USERNAME = createConfigKey<string>('SEED_ANONYMOUS_USERNAME');

/** Core configuration entries required by `platform-authentication`. */
export const PLATFORM_AUTHENTICATION_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    // JWT & Session
    {
        key: AUTH_JWT_SECRET,
        required: true,
        description: 'Secret used to sign JWTs.',
    },
    {
        key: AUTH_JWT_EXPIRES_IN,
        required: true,
        description: 'Lifetime of access tokens.',
    },
    {
        key: AUTH_VERIFY_JWT_EXPIRES_IN,
        required: true,
        description: 'Lifetime of email-verification JWTs.',
    },
    // MFA - General
    {
        key: AUTH_MFA_ENCRYPTION_KEY,
        required: true,
        description: 'AES encryption key for MFA secrets.',
    },
    {
        key: AUTH_MFA_CHALLENGE_EXPIRES_IN,
        required: false,
        defaultValue: '5m',
        description: 'MFA challenge validity period.',
    },
    {
        key: AUTH_MFA_MAX_ATTEMPTS,
        required: false,
        defaultValue: '5',
        description: 'Max failed MFA attempts before lockout.',
    },
    {
        key: AUTH_MFA_ISSUER,
        required: true,
        description: 'Issuer name shown in authenticator apps for TOTP MFA.',
    },
    // MFA - SMS
    {
        key: AUTH_MFA_SMS_CODE_TTL,
        required: false,
        defaultValue: '10m',
        description: 'TTL for SMS OTP codes.',
    },
    {
        key: AUTH_MFA_SMS_MIN_RESEND,
        required: false,
        defaultValue: '30s',
        description: 'Min interval between SMS resends.',
    },
    // MFA - Email
    {
        key: AUTH_MFA_EMAIL_CODE_TTL,
        required: false,
        defaultValue: '10m',
        description: 'TTL for email OTP codes.',
    },
    {
        key: AUTH_MFA_EMAIL_MIN_RESEND,
        required: false,
        defaultValue: '30s',
        description: 'Min interval between email resends.',
    },
    // MFA - Push
    {
        key: AUTH_MFA_PUSH_CODE_TTL,
        required: false,
        defaultValue: '10m',
        description: 'TTL for push OTP codes.',
    },
    {
        key: AUTH_MFA_PUSH_MIN_RESEND,
        required: false,
        defaultValue: '30s',
        description: 'Min interval between push resends.',
    },

    // Seed / Misc
    {
        key: SEED_ANONYMOUS_USERNAME,
        required: true,
        description: 'Username for the anonymous seed user.',
    },
];
