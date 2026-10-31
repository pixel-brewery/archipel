// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MAILGUN_API_KEY, MAILGUN_CONFIG_ENTRIES, MAILGUN_DOMAIN } from './delivering/strategies/mailgun/env.js';
import { POSTMARK_API_KEY, POSTMARK_CONFIG_ENTRIES } from './delivering/strategies/postmark/env.js';
import { RESEND_API_KEY, RESEND_CONFIG_ENTRIES } from './delivering/strategies/resend/env.js';
import { SENDGRID_API_KEY, SENDGRID_CONFIG_ENTRIES } from './delivering/strategies/sendgrid/env.js';
import { SMTP_CONFIG_ENTRIES, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_SECURE, SMTP_USER } from './delivering/strategies/smtp/env.js';

// #endregion

// #region Tests

describe('Mailing Provider Env Files', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Resend env', () => {
        it('should have correct key string', () => {
            // arrange / act / assert
            expect(RESEND_API_KEY.key).toBe('MAIL_RESEND_API_KEY');
        });

        it('should have 1 required config entry', () => {
            // arrange / act / assert
            expect(RESEND_CONFIG_ENTRIES).toHaveLength(1);
            expect(RESEND_CONFIG_ENTRIES[0].required).toBe(true);
        });
    });

    describe('Mailgun env', () => {
        it('should have correct key strings', () => {
            // arrange / act / assert
            expect(MAILGUN_API_KEY.key).toBe('MAIL_MAILGUN_API_KEY');
            expect(MAILGUN_DOMAIN.key).toBe('MAIL_MAILGUN_DOMAIN');
        });

        it('should have 2 required config entries', () => {
            // arrange / act / assert
            expect(MAILGUN_CONFIG_ENTRIES).toHaveLength(2);
            expect(MAILGUN_CONFIG_ENTRIES[0].required).toBe(true);
            expect(MAILGUN_CONFIG_ENTRIES[1].required).toBe(true);
        });
    });

    describe('SMTP env', () => {
        it('should have correct key strings', () => {
            // arrange / act / assert
            expect(SMTP_HOST.key).toBe('MAIL_SMTP_HOST');
            expect(SMTP_PORT.key).toBe('MAIL_SMTP_PORT');
            expect(SMTP_SECURE.key).toBe('MAIL_SMTP_SECURE');
            expect(SMTP_USER.key).toBe('MAIL_SMTP_USER');
            expect(SMTP_PASSWORD.key).toBe('MAIL_SMTP_PASSWORD');
        });

        it('should have 5 config entries', () => {
            // arrange / act / assert
            expect(SMTP_CONFIG_ENTRIES).toHaveLength(5);
        });

        it('should provide default values', () => {
            // arrange
            const hostEntry = SMTP_CONFIG_ENTRIES.find((e) => e.key.key === 'MAIL_SMTP_HOST');
            const portEntry = SMTP_CONFIG_ENTRIES.find((e) => e.key.key === 'MAIL_SMTP_PORT');

            // act / assert
            expect(hostEntry!.defaultValue).toBe('localhost');
            expect(portEntry!.defaultValue).toBe(587);
        });
    });

    describe('SendGrid env', () => {
        it('should have correct key string', () => {
            // arrange / act / assert
            expect(SENDGRID_API_KEY.key).toBe('MAIL_SENDGRID_API_KEY');
        });

        it('should have 1 required config entry', () => {
            // arrange / act / assert
            expect(SENDGRID_CONFIG_ENTRIES).toHaveLength(1);
            expect(SENDGRID_CONFIG_ENTRIES[0].required).toBe(true);
        });
    });

    describe('Postmark env', () => {
        it('should have correct key string', () => {
            // arrange / act / assert
            expect(POSTMARK_API_KEY.key).toBe('MAIL_POSTMARK_API_KEY');
        });

        it('should have 1 required config entry', () => {
            // arrange / act / assert
            expect(POSTMARK_CONFIG_ENTRIES).toHaveLength(1);
            expect(POSTMARK_CONFIG_ENTRIES[0].required).toBe(true);
        });
    });
});

// #endregion
