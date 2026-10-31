// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    ADOBE_SIGN_BASE_URL,
    ADOBE_SIGN_CLIENT_SECRET,
    ADOBE_SIGN_CONFIG_ENTRIES,
    ADOBE_SIGN_INTEGRATION_KEY,
    ADOBE_SIGN_WEBHOOK_CLIENT_ID,
} from './adobe-sign/env.js';
import {
    DOCUSIGN_ACCOUNT_ID,
    DOCUSIGN_BASE_URL,
    DOCUSIGN_CONFIG_ENTRIES,
    DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_SECRET_KEY,
    DOCUSIGN_WEBHOOK_HMAC_KEY,
} from './docusign/env.js';
import { DROPBOX_SIGN_API_KEY, DROPBOX_SIGN_CLIENT_ID, DROPBOX_SIGN_CONFIG_ENTRIES, DROPBOX_SIGN_WEBHOOK_SECRET } from './dropbox-sign/env.js';

// #endregion

// #region Tests

describe('esigning env config entries', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Adobe Sign', () => {
        it('should expose correct config key strings', () => {
            // arrange / act / assert
            expect(ADOBE_SIGN_INTEGRATION_KEY.key).toBe('ADOBE_SIGN_INTEGRATION_KEY');
            expect(ADOBE_SIGN_CLIENT_SECRET.key).toBe('ADOBE_SIGN_CLIENT_SECRET');
            expect(ADOBE_SIGN_BASE_URL.key).toBe('ADOBE_SIGN_BASE_URL');
            expect(ADOBE_SIGN_WEBHOOK_CLIENT_ID.key).toBe('ADOBE_SIGN_WEBHOOK_CLIENT_ID');
        });

        it('should have 4 config entries all marked required', () => {
            // arrange / act / assert
            expect(ADOBE_SIGN_CONFIG_ENTRIES).toHaveLength(4);
            for (const entry of ADOBE_SIGN_CONFIG_ENTRIES) {
                expect(entry.required).toBe(true);
                expect(entry.description).toBeTruthy();
            }
        });
    });

    describe('DocuSign', () => {
        it('should expose correct config key strings', () => {
            // arrange / act / assert
            expect(DOCUSIGN_INTEGRATION_KEY.key).toBe('DOCUSIGN_INTEGRATION_KEY');
            expect(DOCUSIGN_SECRET_KEY.key).toBe('DOCUSIGN_SECRET_KEY');
            expect(DOCUSIGN_ACCOUNT_ID.key).toBe('DOCUSIGN_ACCOUNT_ID');
            expect(DOCUSIGN_BASE_URL.key).toBe('DOCUSIGN_BASE_URL');
            expect(DOCUSIGN_WEBHOOK_HMAC_KEY.key).toBe('DOCUSIGN_WEBHOOK_HMAC_KEY');
        });

        it('should have 5 config entries with correct required flags', () => {
            // arrange / act / assert
            expect(DOCUSIGN_CONFIG_ENTRIES).toHaveLength(5);
            const hmacEntry = DOCUSIGN_CONFIG_ENTRIES.find((e) => e.key.key === 'DOCUSIGN_WEBHOOK_HMAC_KEY');
            expect(hmacEntry!.required).toBe(false);
        });

        it('should include a description for every entry', () => {
            // arrange / act / assert
            for (const entry of DOCUSIGN_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });

    describe('Dropbox Sign', () => {
        it('should expose correct config key strings', () => {
            // arrange / act / assert
            expect(DROPBOX_SIGN_API_KEY.key).toBe('DROPBOX_SIGN_API_KEY');
            expect(DROPBOX_SIGN_CLIENT_ID.key).toBe('DROPBOX_SIGN_CLIENT_ID');
            expect(DROPBOX_SIGN_WEBHOOK_SECRET.key).toBe('DROPBOX_SIGN_WEBHOOK_SECRET');
        });

        it('should have 3 config entries with correct required flags', () => {
            // arrange / act / assert
            expect(DROPBOX_SIGN_CONFIG_ENTRIES).toHaveLength(3);
            const webhookEntry = DROPBOX_SIGN_CONFIG_ENTRIES.find((e) => e.key.key === 'DROPBOX_SIGN_WEBHOOK_SECRET');
            expect(webhookEntry!.required).toBe(false);
        });

        it('should include a description for every entry', () => {
            // arrange / act / assert
            for (const entry of DROPBOX_SIGN_CONFIG_ENTRIES) {
                expect(entry.description).toBeTruthy();
            }
        });
    });
});

// #endregion
