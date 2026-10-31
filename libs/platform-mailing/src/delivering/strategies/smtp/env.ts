// #region Imports

import { createConfigKey, IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';

// #endregion

// ──────────────────────────────────────────────────────────────
// SMTP
// ──────────────────────────────────────────────────────────────

/** SMTP server host. */
export const SMTP_HOST = createConfigKey<string>('MAIL_SMTP_HOST');

/** SMTP server port. */
export const SMTP_PORT = createConfigKey<number>('MAIL_SMTP_PORT');

/** Whether the SMTP connection uses TLS. */
export const SMTP_SECURE = createConfigKey<boolean>('MAIL_SMTP_SECURE');

/** SMTP authentication username. */
export const SMTP_USER = createConfigKey<string>('MAIL_SMTP_USER');

/** SMTP authentication password. */
export const SMTP_PASSWORD = createConfigKey<string>('MAIL_SMTP_PASSWORD');

// ──────────────────────────────────────────────────────────────
// Registry entries
// ──────────────────────────────────────────────────────────────

/** Configuration entries required by the SMTP delivery provider. */
export const SMTP_CONFIG_ENTRIES: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [
    { key: SMTP_HOST, required: true, defaultValue: 'localhost', description: 'SMTP server host.' },
    { key: SMTP_PORT, required: true, defaultValue: 587, description: 'SMTP server port.' },
    { key: SMTP_SECURE, required: false, defaultValue: true, description: 'Whether SMTP uses TLS.' },
    { key: SMTP_USER, required: false, defaultValue: '', description: 'SMTP authentication username.' },
    { key: SMTP_PASSWORD, required: false, defaultValue: '', description: 'SMTP authentication password.' },
];
