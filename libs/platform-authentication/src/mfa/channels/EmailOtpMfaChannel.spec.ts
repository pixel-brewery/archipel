// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import type { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import type { IMfaSubject } from '../../contracts/IMfaSubject.js';
import type { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { MfaChannelNotEnabledError } from '../../errors/MfaChannelNotEnabledError.js';
import { MfaCodeExpiredError } from '../../errors/MfaCodeExpiredError.js';
import { MfaCodeNotIssuedError } from '../../errors/MfaCodeNotIssuedError.js';
import { MfaCodeRecentlySentError } from '../../errors/MfaCodeRecentlySentError.js';
import { MfaEmailRequiredError } from '../../errors/MfaEmailRequiredError.js';
import { MfaSetupExpiredError } from '../../errors/MfaSetupExpiredError.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import { EmailOtpMfaChannel } from './EmailOtpMfaChannel.js';

// #endregion

// #region Tests

describe('EmailOtpMfaChannel', () => {
    let mockMfaSubject: { findById: ReturnType<typeof vi.fn>; updateMfaState: ReturnType<typeof vi.fn> };
    let mockConfigService: { tryGet: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> };
    let mockBcrypt: { hash: ReturnType<typeof vi.fn>; compare: ReturnType<typeof vi.fn> };

    function createUser(overrides?: Partial<IMfaSubject>): IMfaSubject {
        return {
            id: 'user-1',
            email: 'test@example.com',
            userName: 'testuser',
            mfaEnabled: false,
            mfaSecret: null,
            mfaBackupCodes: [],
            mfaPreferredMethod: null,
            mfaVerifiedAt: null,
            mfaChannels: { channels: {}, trustedDevices: [] },
            phoneNumber: null,
            ...overrides,
        };
    }

    function createChannel(): EmailOtpMfaChannel {
        return new EmailOtpMfaChannel(
            mockMfaSubject as unknown as MfaSubjectBase,
            mockConfigService as unknown as ConfigService,
            mockBcrypt as unknown as BcryptService,
        );
    }

    async function captureFailure(operation: Promise<unknown>): Promise<unknown> {
        return operation.then(
            () => undefined,
            (error: unknown) => error,
        );
    }

    function expectProblem(failure: unknown, errorType: new (...args: never[]) => ProblemDetailException, status: number, code: string, message: string): void {
        expect(failure).toBeInstanceOf(errorType);
        expect(failure).toMatchObject({ code, message });
        expect((failure as ProblemDetailException).getStatus()).toBe(status);
        expect((failure as ProblemDetailException).getResponse()).toMatchObject({ code, detail: message });
    }

    beforeEach(() => {
        mockMfaSubject = {
            findById: vi.fn().mockResolvedValue(createUser()),
            updateMfaState: vi.fn().mockResolvedValue(undefined),
        };
        mockConfigService = {
            tryGet: vi.fn().mockReturnValue('10m'),
            get: vi.fn().mockReturnValue('test-value'),
        };
        mockBcrypt = {
            hash: vi.fn().mockResolvedValue('hashed-code'),
            compare: vi.fn().mockResolvedValue(true),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have method "email"', () => {
        // arrange
        const channel = createChannel();

        // assert
        expect(channel.method).toBe('email');
    });

    describe('initSetup', () => {
        it('should initialize setup and update MFA state', async () => {
            // arrange
            const channel = createChannel();

            // act
            const result = await channel.initSetup('user-1');

            // assert
            expect(result.method).toBe('email');
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });

        it('should use email from context when provided', async () => {
            // arrange
            const channel = createChannel();

            // act
            await channel.initSetup('user-1', { email: 'custom@example.com' });

            // assert
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalledWith(
                'user-1',
                expect.objectContaining({
                    mfaChannels: expect.objectContaining({
                        channels: expect.objectContaining({
                            email: expect.objectContaining({ email: 'custom@example.com' }),
                        }),
                    }),
                }),
            );
        });

        it('should reject the setup of a person that the MFA subject port does not find', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(null);
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.initSetup('user-1'));

            // assert
            expectProblem(failure, MfaSubjectNotFoundError, 400, 'MFA_SUBJECT_NOT_FOUND', 'User not found');
        });

        it('should reject the setup without an email address', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createUser({ email: null }));
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.initSetup('user-1'));

            // assert
            expectProblem(failure, MfaEmailRequiredError, 400, 'MFA_EMAIL_REQUIRED', 'Email is required for email MFA');
        });

        it('should reject a new setup code while the previous one was sent recently', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: false,
                                lastSentAt: new Date().toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.initSetup('user-1'));

            // assert
            expectProblem(failure, MfaCodeRecentlySentError, 400, 'MFA_CODE_RECENTLY_SENT', 'OTP recently sent. Please wait before requesting another code.');
            expect(mockMfaSubject.updateMfaState).not.toHaveBeenCalled();
        });
    });

    describe('verifySetup', () => {
        it('should return true and enable channel for valid code', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: false,
                                codeHash: 'hashed',
                                codeExpiresAt: new Date(Date.now() + 60_000).toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifySetup('user-1', '12345678');

            // assert
            expect(result).toBe(true);
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalledWith('user-1', expect.objectContaining({ mfaEnabled: true }));
        });

        it('should return false for invalid code', async () => {
            // arrange
            mockBcrypt.compare.mockResolvedValue(false);
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: false,
                                codeHash: 'hashed',
                                codeExpiresAt: new Date(Date.now() + 60_000).toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifySetup('user-1', 'wrong');

            // assert
            expect(result).toBe(false);
        });

        it('should reject an expired setup code without ending the session', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: false,
                                codeHash: 'hashed',
                                codeExpiresAt: new Date(Date.now() - 60_000).toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifySetup('user-1', '12345678'));

            // assert
            expectProblem(failure, MfaSetupExpiredError, 400, 'MFA_SETUP_EXPIRED', 'Email code expired');
        });

        it('should reject a setup confirmation before the setup was started', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: { enabled: false },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifySetup('user-1', '12345678'));

            // assert
            expectProblem(failure, MfaSetupNotInitializedError, 400, 'MFA_SETUP_NOT_INITIALIZED', 'Email setup not initialized');
        });
    });

    describe('verifyChallenge', () => {
        it('should return true for valid challenge code without enabling', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: true,
                                codeHash: 'hashed',
                                codeExpiresAt: new Date(Date.now() + 60_000).toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifyChallenge('user-1', '12345678');

            // assert
            expect(result).toBe(true);
        });

        it('should reject an expired sign-in code as unauthorized', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: {
                                enabled: true,
                                codeHash: 'hashed',
                                codeExpiresAt: new Date(Date.now() - 60_000).toISOString(),
                            },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifyChallenge('user-1', '12345678'));

            // assert
            expectProblem(failure, MfaCodeExpiredError, 401, 'MFA_CODE_EXPIRED', 'Email code expired');
        });

        it('should reject a sign-in code when none was issued as unauthorized', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: { enabled: true },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifyChallenge('user-1', '12345678'));

            // assert
            expectProblem(failure, MfaCodeNotIssuedError, 401, 'MFA_CODE_NOT_ISSUED', 'Email code not issued');
        });
    });

    describe('issueChallenge', () => {
        it('should issue a new challenge code for an enabled channel', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: { enabled: true, email: 'test@example.com' },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            await channel.issueChallenge('user-1');

            // assert
            expect(mockBcrypt.hash).toHaveBeenCalled();
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });

        it('should reject a sign-in challenge for a channel that is not enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            email: { enabled: false },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.issueChallenge('user-1'));

            // assert
            expectProblem(failure, MfaChannelNotEnabledError, 401, 'MFA_CHANNEL_NOT_ENABLED', 'Email MFA is not enabled');
        });

        it('should reject a sign-in challenge of a person that the MFA subject port does not find', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(null);
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.issueChallenge('user-1'));

            // assert
            expectProblem(failure, MfaSubjectNotFoundError, 400, 'MFA_SUBJECT_NOT_FOUND', 'User not found');
        });
    });
});

// #endregion
