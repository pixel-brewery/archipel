// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// Core
// ──────────────────────────────────────────────────────────────

/** Sender e-mail address shown in the `From` header. */
export const MAIL_SENDER_EMAIL = createConfigKey<string>('MAIL_SENDER_EMAIL');

/** Template engine format identifier (e.g. `handlebars`). */
export const MAIL_TEMPLATE_ENGINE_FORMAT = createConfigKey<string>('MAIL_TEMPLATE_ENGINE_FORMAT');

// ──────────────────────────────────────────────────────────────
// Postmark
// ──────────────────────────────────────────────────────────────

/** API key for the Postmark delivery service. */
export const MAIL_POSTMARK_API_KEY = createConfigKey<string>('MAIL_POSTMARK_API_KEY');

// ──────────────────────────────────────────────────────────────
// Resend
// ──────────────────────────────────────────────────────────────

/** API key for the Resend delivery service. */
export const MAIL_RESEND_API_KEY = createConfigKey<string>('MAIL_RESEND_API_KEY');

// ──────────────────────────────────────────────────────────────
// SendGrid
// ──────────────────────────────────────────────────────────────

/** API key for the SendGrid delivery service. */
export const MAIL_SENDGRID_API_KEY = createConfigKey<string>('MAIL_SENDGRID_API_KEY');

// ──────────────────────────────────────────────────────────────
// Mailgun
// ──────────────────────────────────────────────────────────────

/** API key for the Mailgun delivery service. */
export const MAIL_MAILGUN_API_KEY = createConfigKey<string>('MAIL_MAILGUN_API_KEY');

/** Mailgun domain (e.g. `mg.example.com`). */
export const MAIL_MAILGUN_DOMAIN = createConfigKey<string>('MAIL_MAILGUN_DOMAIN');

// ──────────────────────────────────────────────────────────────
// SMTP
// ──────────────────────────────────────────────────────────────

/** SMTP server host. */
export const MAIL_SMTP_HOST = createConfigKey<string>('MAIL_SMTP_HOST');

/** SMTP server port. */
export const MAIL_SMTP_PORT = createConfigKey<number>('MAIL_SMTP_PORT');

/** Whether the SMTP connection uses TLS. */
export const MAIL_SMTP_SECURE = createConfigKey<boolean>('MAIL_SMTP_SECURE');

/** SMTP authentication username. */
export const MAIL_SMTP_USER = createConfigKey<string>('MAIL_SMTP_USER');

/** SMTP authentication password. */
export const MAIL_SMTP_PASSWORD = createConfigKey<string>('MAIL_SMTP_PASSWORD');

// ──────────────────────────────────────────────────────────────
// Health Indicator
// ──────────────────────────────────────────────────────────────

/** Mail host checked by the health indicator. */
export const MAIL_HOST = createConfigKey<string>('MAIL_HOST');

/** Mail user checked by the health indicator. */
export const MAIL_USER = createConfigKey<string>('MAIL_USER');

/** Mail port checked by the health indicator. */
export const MAIL_PORT = createConfigKey<number>('MAIL_PORT');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** All configuration entries required by `platform-mailing`. */
export const PLATFORM_MAILING_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    // Core
    { key: MAIL_SENDER_EMAIL, required: true, description: 'Sender e-mail address for the From header.' },
    { key: MAIL_TEMPLATE_ENGINE_FORMAT, required: true, description: 'Template engine format identifier.' },

    // Postmark
    {
        key: MAIL_POSTMARK_API_KEY,
        required: false,
        description: 'Postmark API key (required when delivery strategy is postmark).',
    },

    // Resend
    {
        key: MAIL_RESEND_API_KEY,
        required: false,
        description: 'Resend API key (required when delivery strategy is resend).',
    },

    // SendGrid
    {
        key: MAIL_SENDGRID_API_KEY,
        required: false,
        description: 'SendGrid API key (required when delivery strategy is sendgrid).',
    },

    // Mailgun
    {
        key: MAIL_MAILGUN_API_KEY,
        required: false,
        description: 'Mailgun API key (required when delivery strategy is mailgun).',
    },
    {
        key: MAIL_MAILGUN_DOMAIN,
        required: false,
        description: 'Mailgun domain (required when delivery strategy is mailgun).',
    },

    // SMTP
    { key: MAIL_SMTP_HOST, required: false, defaultValue: 'localhost', description: 'SMTP server host.' },
    { key: MAIL_SMTP_PORT, required: false, defaultValue: 587, description: 'SMTP server port.' },
    { key: MAIL_SMTP_SECURE, required: false, defaultValue: true, description: 'Whether SMTP uses TLS.' },
    { key: MAIL_SMTP_USER, required: false, defaultValue: '', description: 'SMTP authentication username.' },
    { key: MAIL_SMTP_PASSWORD, required: false, defaultValue: '', description: 'SMTP authentication password.' },

    // Health
    { key: MAIL_HOST, required: false, defaultValue: '', description: 'Mail host for health checks.' },
    { key: MAIL_USER, required: false, defaultValue: '', description: 'Mail user for health checks.' },
    { key: MAIL_PORT, required: false, defaultValue: 0, description: 'Mail port for health checks.' },
];
