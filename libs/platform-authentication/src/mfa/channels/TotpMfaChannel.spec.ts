// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import type { IOtpService } from '@pixel-brewery/archipel-platform-cryptography/otp';
import type { IMfaSubject } from '../../contracts/IMfaSubject.js';
import type { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import type { MfaEncryptionService } from '../MfaEncryptionService.js';
import { TotpMfaChannel } from './TotpMfaChannel.js';

// #endregion

// #region Tests

describe('TotpMfaChannel', () => {
    let mockMfaSubject: { findById: ReturnType<typeof vi.fn>; updateMfaState: ReturnType<typeof vi.fn> };
    let mockConfigService: { tryGet: ReturnType<typeof vi.fn>; get: ReturnType<typeof vi.fn> };
    let mockEncryptionService: { encrypt: ReturnType<typeof vi.fn>; decrypt: ReturnType<typeof vi.fn> };
    let mockOtpService: IOtpService;

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

    function createChannel(): TotpMfaChannel {
        return new TotpMfaChannel(
            mockMfaSubject as unknown as MfaSubjectBase,
            mockConfigService as unknown as ConfigService,
            mockEncryptionService as unknown as MfaEncryptionService,
            mockOtpService,
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
            get: vi.fn().mockReturnValue('TestApp'),
        };
        mockEncryptionService = {
            encrypt: vi.fn().mockReturnValue('encrypted-secret'),
            decrypt: vi.fn().mockReturnValue('decrypted-secret'),
        };
        mockOtpService = {
            generateSecret: vi.fn().mockReturnValue('JBSWY3DPEHPK3PXP'),
            verify: vi.fn().mockReturnValue(true),
            generateUri: vi.fn().mockReturnValue('otpauth://totp/TestApp:test@example.com?secret=JBSWY3DPEHPK3PXP'),
        } as unknown as IOtpService;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have method "totp"', () => {
        // arrange
        const channel = createChannel();

        // assert
        expect(channel.method).toBe('totp');
    });

    describe('initSetup', () => {
        it('should generate secret and return setup data', async () => {
            // arrange
            const channel = createChannel();

            // act
            const result = await channel.initSetup('user-1');

            // assert
            expect(result.method).toBe('totp');
            expect(result.secret).toBe('JBSWY3DPEHPK3PXP');
            expect(result.otpauthUrl).toContain('otpauth://totp/');
            expect(mockOtpService.generateSecret).toHaveBeenCalled();
            expect(mockEncryptionService.encrypt).toHaveBeenCalledWith('JBSWY3DPEHPK3PXP');
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
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

        it('should use email as account label', async () => {
            // arrange
            const channel = createChannel();

            // act
            await channel.initSetup('user-1');

            // assert
            expect(mockOtpService.generateUri).toHaveBeenCalledWith(
                expect.objectContaining({
                    label: 'test@example.com',
                    issuer: 'TestApp',
                    secret: 'JBSWY3DPEHPK3PXP',
                }),
            );
        });

        it('should fall back to userName when email is null', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createUser({ email: null, userName: 'johndoe' }));
            const channel = createChannel();

            // act
            await channel.initSetup('user-1');

            // assert
            expect(mockOtpService.generateUri).toHaveBeenCalledWith(expect.objectContaining({ label: 'johndoe' }));
        });

        it('should fall back to id when both email and userName are null', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createUser({ email: null, userName: null }));
            const channel = createChannel();

            // act
            await channel.initSetup('user-1');

            // assert
            expect(mockOtpService.generateUri).toHaveBeenCalledWith(expect.objectContaining({ label: 'user-1' }));
        });
    });

    describe('verifySetup', () => {
        it('should return true and enable channel for valid TOTP code', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: false, secret: 'encrypted-secret' },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifySetup('user-1', '123456');

            // assert
            expect(result).toBe(true);
            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('encrypted-secret');
            expect(mockOtpService.verify).toHaveBeenCalledWith('123456', 'decrypted-secret');
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalledWith('user-1', expect.objectContaining({ mfaEnabled: true }));
        });

        it('should return false for invalid TOTP code', async () => {
            // arrange
            (mockOtpService.verify as ReturnType<typeof vi.fn>).mockReturnValue(false);
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: false, secret: 'encrypted-secret' },
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

        it('should reject a setup confirmation before the setup was started', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: { channels: {} },
                }),
            );
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifySetup('user-1', '123456'));

            // assert
            expectProblem(failure, MfaSetupNotInitializedError, 400, 'MFA_SETUP_NOT_INITIALIZED', 'TOTP setup not initialized');
            expect(mockMfaSubject.updateMfaState).not.toHaveBeenCalled();
        });

        it('should reject a setup confirmation of a person that the MFA subject port does not find', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(null);
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifySetup('user-1', '123456'));

            // assert
            expectProblem(failure, MfaSubjectNotFoundError, 400, 'MFA_SUBJECT_NOT_FOUND', 'User not found');
        });
    });

    describe('verifyChallenge', () => {
        it('should return true for valid TOTP challenge code', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: true, secret: 'encrypted-secret' },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifyChallenge('user-1', '123456');

            // assert
            expect(result).toBe(true);
            expect(mockEncryptionService.decrypt).toHaveBeenCalledWith('encrypted-secret');
        });

        it('should return false when channel is not enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: false, secret: 'encrypted-secret' },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifyChallenge('user-1', '123456');

            // assert
            expect(result).toBe(false);
        });

        it('should return false when no secret is stored', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createUser({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: true },
                        },
                    },
                }),
            );
            const channel = createChannel();

            // act
            const result = await channel.verifyChallenge('user-1', '123456');

            // assert
            expect(result).toBe(false);
        });

        it('should reject a challenge of a person that the MFA subject port does not find', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(null);
            const channel = createChannel();

            // act
            const failure = await captureFailure(channel.verifyChallenge('user-1', '123456'));

            // assert
            expectProblem(failure, MfaSubjectNotFoundError, 400, 'MFA_SUBJECT_NOT_FOUND', 'User not found');
        });
    });
});

// #endregion
