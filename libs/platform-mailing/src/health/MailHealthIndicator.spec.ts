// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MailHealthIndicator } from './MailHealthIndicator.js';

// #endregion

// #region Tests

describe('MailHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have key set to mail', () => {
        // arrange
        const configService = { tryGet: vi.fn() } as never;

        // act
        const indicator = new MailHealthIndicator(configService);

        // assert
        expect(indicator.key).toBe('mail');
    });

    it('should return up when all config values are valid', () => {
        // arrange
        const configService = {
            tryGet: vi.fn((key: string, fallback: unknown) => {
                const values: Record<string, unknown> = {
                    MAIL_HOST: 'smtp.example.com',
                    MAIL_USER: 'user@example.com',
                    MAIL_PORT: 587,
                };
                return values[key] ?? fallback;
            }),
        } as never;
        const indicator = new MailHealthIndicator(configService);

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({
            mail: {
                status: 'up',
            },
        });
    });

    it('should return down when MAIL_HOST is empty', () => {
        // arrange
        const configService = {
            tryGet: vi.fn((key: string, fallback: unknown) => {
                const values: Record<string, unknown> = {
                    MAIL_HOST: '',
                    MAIL_USER: 'user@example.com',
                    MAIL_PORT: 587,
                };
                return values[key] ?? fallback;
            }),
        } as never;
        const indicator = new MailHealthIndicator(configService);

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({
            mail: {
                status: 'down',
                message: 'Mail configuration is invalid',
            },
        });
    });

    it('should return down when MAIL_USER is empty', () => {
        // arrange
        const configService = {
            tryGet: vi.fn((key: string, fallback: unknown) => {
                const values: Record<string, unknown> = {
                    MAIL_HOST: 'smtp.example.com',
                    MAIL_USER: '',
                    MAIL_PORT: 587,
                };
                return values[key] ?? fallback;
            }),
        } as never;
        const indicator = new MailHealthIndicator(configService);

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({
            mail: {
                status: 'down',
                message: 'Mail configuration is invalid',
            },
        });
    });

    it('should return down when MAIL_PORT is zero', () => {
        // arrange
        const configService = {
            tryGet: vi.fn((key: string, fallback: unknown) => {
                const values: Record<string, unknown> = {
                    MAIL_HOST: 'smtp.example.com',
                    MAIL_USER: 'user@example.com',
                    MAIL_PORT: 0,
                };
                return values[key] ?? fallback;
            }),
        } as never;
        const indicator = new MailHealthIndicator(configService);

        // act
        const result = indicator.check();

        // assert
        expect(result).toEqual({
            mail: {
                status: 'down',
                message: 'Mail configuration is invalid',
            },
        });
    });
});

// #endregion
