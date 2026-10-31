import { describe, expect, it } from 'vitest';
import {
    MAIL_HOST,
    MAIL_MAILGUN_API_KEY,
    MAIL_MAILGUN_DOMAIN,
    MAIL_PORT,
    MAIL_POSTMARK_API_KEY,
    MAIL_RESEND_API_KEY,
    MAIL_SENDER_EMAIL,
    MAIL_SENDGRID_API_KEY,
    MAIL_SMTP_HOST,
    MAIL_SMTP_PASSWORD,
    MAIL_SMTP_PORT,
    MAIL_SMTP_SECURE,
    MAIL_SMTP_USER,
    MAIL_TEMPLATE_ENGINE_FORMAT,
    MAIL_USER,
    PLATFORM_MAILING_CONFIG_ENTRIES,
} from './env.js';

describe('platform-mailing env', () => {
    describe('config keys', () => {
        it.each([
            ['MAIL_SENDER_EMAIL', MAIL_SENDER_EMAIL],
            ['MAIL_TEMPLATE_ENGINE_FORMAT', MAIL_TEMPLATE_ENGINE_FORMAT],
            ['MAIL_POSTMARK_API_KEY', MAIL_POSTMARK_API_KEY],
            ['MAIL_RESEND_API_KEY', MAIL_RESEND_API_KEY],
            ['MAIL_SENDGRID_API_KEY', MAIL_SENDGRID_API_KEY],
            ['MAIL_MAILGUN_API_KEY', MAIL_MAILGUN_API_KEY],
            ['MAIL_MAILGUN_DOMAIN', MAIL_MAILGUN_DOMAIN],
            ['MAIL_SMTP_HOST', MAIL_SMTP_HOST],
            ['MAIL_SMTP_PORT', MAIL_SMTP_PORT],
            ['MAIL_SMTP_SECURE', MAIL_SMTP_SECURE],
            ['MAIL_SMTP_USER', MAIL_SMTP_USER],
            ['MAIL_SMTP_PASSWORD', MAIL_SMTP_PASSWORD],
            ['MAIL_HOST', MAIL_HOST],
            ['MAIL_USER', MAIL_USER],
            ['MAIL_PORT', MAIL_PORT],
        ])('should resolve %s to the correct key string', (expected, configKey) => {
            // assert
            expect(configKey.key).toBe(expected);
        });
    });

    describe('registry entries', () => {
        it('should contain an entry for every exported config key', () => {
            // arrange
            const expectedKeys = [
                'MAIL_SENDER_EMAIL',
                'MAIL_TEMPLATE_ENGINE_FORMAT',
                'MAIL_POSTMARK_API_KEY',
                'MAIL_RESEND_API_KEY',
                'MAIL_SENDGRID_API_KEY',
                'MAIL_MAILGUN_API_KEY',
                'MAIL_MAILGUN_DOMAIN',
                'MAIL_SMTP_HOST',
                'MAIL_SMTP_PORT',
                'MAIL_SMTP_SECURE',
                'MAIL_SMTP_USER',
                'MAIL_SMTP_PASSWORD',
                'MAIL_HOST',
                'MAIL_USER',
                'MAIL_PORT',
            ];

            // act
            const registeredKeys = PLATFORM_MAILING_CONFIG_ENTRIES.map((e) => e.key.key);

            // assert
            for (const key of expectedKeys) {
                expect(registeredKeys).toContain(key);
            }
            expect(PLATFORM_MAILING_CONFIG_ENTRIES).toHaveLength(expectedKeys.length);
        });

        it('should mark required keys correctly', () => {
            // act
            const requiredKeys = PLATFORM_MAILING_CONFIG_ENTRIES.filter((e) => e.required).map((e) => e.key.key);

            // assert
            expect(requiredKeys).toContain('MAIL_SENDER_EMAIL');
            expect(requiredKeys).toContain('MAIL_TEMPLATE_ENGINE_FORMAT');
            expect(requiredKeys).not.toContain('MAIL_SMTP_HOST');
            expect(requiredKeys).not.toContain('MAIL_POSTMARK_API_KEY');
        });

        it('should provide default values for optional keys where applicable', () => {
            // act
            const optionalWithDefault = PLATFORM_MAILING_CONFIG_ENTRIES.filter((e) => !e.required && e.defaultValue !== undefined);

            // assert
            expect(optionalWithDefault.length).toBeGreaterThan(0);
            const smtpPort = optionalWithDefault.find((e) => e.key.key === 'MAIL_SMTP_PORT');
            expect(smtpPort?.defaultValue).toBe(587);
        });

        it('should include a description for every entry', () => {
            // assert
            for (const entry of PLATFORM_MAILING_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});
