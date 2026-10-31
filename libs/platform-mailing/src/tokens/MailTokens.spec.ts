// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IMailTemplateVariants } from '../models/IMailTemplateVariants.js';
import type { MailTemplateFormat } from '../models/MailTemplateFormat.js';
import { MAIL_DELIVERY_STRATEGY_TOKEN, MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN, MAIL_TEMPLATE_NAMES_TOKEN } from './MailTokens.js';

// #endregion

// #region Tests

describe('MailTokens', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should export MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN as a symbol', () => {
        // arrange / act / assert
        expect(typeof MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN).toBe('symbol');
    });

    it('should export MAIL_DELIVERY_STRATEGY_TOKEN as a symbol', () => {
        // arrange / act / assert
        expect(typeof MAIL_DELIVERY_STRATEGY_TOKEN).toBe('symbol');
    });

    it('should have unique symbols for each token', () => {
        // arrange / act / assert
        expect(MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN).not.toBe(MAIL_DELIVERY_STRATEGY_TOKEN);
        expect(MAIL_TEMPLATE_NAMES_TOKEN).not.toBe(MAIL_TEMPLATE_FETCH_STRATEGY_TOKEN);
        expect(MAIL_TEMPLATE_NAMES_TOKEN).not.toBe(MAIL_DELIVERY_STRATEGY_TOKEN);
    });

    it('should export MAIL_TEMPLATE_NAMES_TOKEN as a symbol', () => {
        // arrange / act / assert
        expect(typeof MAIL_TEMPLATE_NAMES_TOKEN).toBe('symbol');
    });

    it('should allow MailTemplateFormat to be html or txt', () => {
        // arrange / act
        const html: MailTemplateFormat = 'html';
        const txt: MailTemplateFormat = 'txt';

        // assert
        expect(html).toBe('html');
        expect(txt).toBe('txt');
    });

    it('should allow IMailTemplateVariants with optional html and txt', () => {
        // arrange / act
        const variants: IMailTemplateVariants = { html: '<p>Hello</p>', txt: 'Hello' };
        const htmlOnly: IMailTemplateVariants = { html: '<p>Hello</p>' };
        const empty: IMailTemplateVariants = {};

        // assert
        expect(variants.html).toBe('<p>Hello</p>');
        expect(variants.txt).toBe('Hello');
        expect(htmlOnly.txt).toBeUndefined();
        expect(empty.html).toBeUndefined();
    });
});

// #endregion
