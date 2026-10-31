import { describe, expect, it } from 'vitest';
import {
    AUTH_APPLE_CALLBACK_URL,
    AUTH_APPLE_CLIENT_ID,
    AUTH_APPLE_KEY_ID,
    AUTH_APPLE_PRIVATE_KEY,
    AUTH_APPLE_TEAM_ID,
    AUTH_GITHUB_CLIENT_ID,
    AUTH_GITHUB_CLIENT_SECRET,
    AUTH_GOOGLE_CALLBACK_URL,
    AUTH_GOOGLE_CLIENT_ID,
    AUTH_GOOGLE_CLIENT_SECRET,
    AUTH_JWT_EXPIRES_IN,
    AUTH_JWT_SECRET,
    AUTH_MFA_CHALLENGE_EXPIRES_IN,
    AUTH_MFA_EMAIL_CODE_TTL,
    AUTH_MFA_EMAIL_MIN_RESEND,
    AUTH_MFA_ENCRYPTION_KEY,
    AUTH_MFA_ISSUER,
    AUTH_MFA_MAX_ATTEMPTS,
    AUTH_MFA_PUSH_CODE_TTL,
    AUTH_MFA_PUSH_MIN_RESEND,
    AUTH_MFA_SMS_CODE_TTL,
    AUTH_MFA_SMS_MIN_RESEND,
    AUTH_MICROSOFT_CALLBACK_URL,
    AUTH_MICROSOFT_CLIENT_ID,
    AUTH_MICROSOFT_CLIENT_SECRET,
    AUTH_MICROSOFT_TENANT,
    AUTH_VERIFY_JWT_EXPIRES_IN,
    PLATFORM_AUTHENTICATION_CONFIG_ENTRIES,
    SEED_ANONYMOUS_USERNAME,
} from './env.js';

describe('platform-authentication env', () => {
    describe('config keys', () => {
        it.each([
            ['AUTH_JWT_SECRET', AUTH_JWT_SECRET],
            ['AUTH_JWT_EXPIRES_IN', AUTH_JWT_EXPIRES_IN],
            ['AUTH_VERIFY_JWT_EXPIRES_IN', AUTH_VERIFY_JWT_EXPIRES_IN],
            ['AUTH_MFA_ENCRYPTION_KEY', AUTH_MFA_ENCRYPTION_KEY],
            ['AUTH_MFA_CHALLENGE_EXPIRES_IN', AUTH_MFA_CHALLENGE_EXPIRES_IN],
            ['AUTH_MFA_MAX_ATTEMPTS', AUTH_MFA_MAX_ATTEMPTS],
            ['AUTH_MFA_ISSUER', AUTH_MFA_ISSUER],
            ['AUTH_MFA_SMS_CODE_TTL', AUTH_MFA_SMS_CODE_TTL],
            ['AUTH_MFA_SMS_MIN_RESEND', AUTH_MFA_SMS_MIN_RESEND],
            ['AUTH_MFA_EMAIL_CODE_TTL', AUTH_MFA_EMAIL_CODE_TTL],
            ['AUTH_MFA_EMAIL_MIN_RESEND', AUTH_MFA_EMAIL_MIN_RESEND],
            ['AUTH_MFA_PUSH_CODE_TTL', AUTH_MFA_PUSH_CODE_TTL],
            ['AUTH_MFA_PUSH_MIN_RESEND', AUTH_MFA_PUSH_MIN_RESEND],
            ['AUTH_GOOGLE_CLIENT_ID', AUTH_GOOGLE_CLIENT_ID],
            ['AUTH_GOOGLE_CLIENT_SECRET', AUTH_GOOGLE_CLIENT_SECRET],
            ['AUTH_GOOGLE_CALLBACK_URL', AUTH_GOOGLE_CALLBACK_URL],
            ['AUTH_MICROSOFT_CLIENT_ID', AUTH_MICROSOFT_CLIENT_ID],
            ['AUTH_MICROSOFT_CLIENT_SECRET', AUTH_MICROSOFT_CLIENT_SECRET],
            ['AUTH_MICROSOFT_CALLBACK_URL', AUTH_MICROSOFT_CALLBACK_URL],
            ['AUTH_MICROSOFT_TENANT', AUTH_MICROSOFT_TENANT],
            ['AUTH_APPLE_PRIVATE_KEY', AUTH_APPLE_PRIVATE_KEY],
            ['AUTH_APPLE_CLIENT_ID', AUTH_APPLE_CLIENT_ID],
            ['AUTH_APPLE_TEAM_ID', AUTH_APPLE_TEAM_ID],
            ['AUTH_APPLE_KEY_ID', AUTH_APPLE_KEY_ID],
            ['AUTH_APPLE_CALLBACK_URL', AUTH_APPLE_CALLBACK_URL],
            ['AUTH_GITHUB_CLIENT_ID', AUTH_GITHUB_CLIENT_ID],
            ['AUTH_GITHUB_CLIENT_SECRET', AUTH_GITHUB_CLIENT_SECRET],
            ['SEED_ANONYMOUS_USERNAME', SEED_ANONYMOUS_USERNAME],
        ])('should resolve %s to the correct key string', (expected, configKey) => {
            // assert
            expect(configKey.key).toBe(expected);
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = [
                'AUTH_JWT_SECRET',
                'AUTH_JWT_EXPIRES_IN',
                'AUTH_VERIFY_JWT_EXPIRES_IN',
                'AUTH_MFA_ENCRYPTION_KEY',
                'AUTH_MFA_CHALLENGE_EXPIRES_IN',
                'AUTH_MFA_MAX_ATTEMPTS',
                'AUTH_MFA_ISSUER',
                'AUTH_MFA_SMS_CODE_TTL',
                'AUTH_MFA_SMS_MIN_RESEND',
                'AUTH_MFA_EMAIL_CODE_TTL',
                'AUTH_MFA_EMAIL_MIN_RESEND',
                'AUTH_MFA_PUSH_CODE_TTL',
                'AUTH_MFA_PUSH_MIN_RESEND',
                'SEED_ANONYMOUS_USERNAME',
            ];

            // act
            const registeredKeys = PLATFORM_AUTHENTICATION_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_AUTHENTICATION_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark required keys correctly', () => {
            // act
            const requiredKeys = PLATFORM_AUTHENTICATION_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('AUTH_JWT_SECRET');
            expect(requiredKeys).toContain('AUTH_JWT_EXPIRES_IN');
            expect(requiredKeys).toContain('AUTH_VERIFY_JWT_EXPIRES_IN');
            expect(requiredKeys).toContain('SEED_ANONYMOUS_USERNAME');
            expect(requiredKeys).not.toContain('AUTH_MFA_CHALLENGE_EXPIRES_IN');
        });

        it('should provide default values for optional keys', () => {
            // act
            const optionalEntries = PLATFORM_AUTHENTICATION_CONFIG_ENTRIES.filter((e) => !e.required);

            // assert
            for (const entry of optionalEntries) {
                expect(entry.defaultValue).toBeDefined();
            }
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_AUTHENTICATION_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
