// #region Imports

import { UnauthorizedException } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProblemDetailException } from '@pixel-brewery/archipel-platform-core';
import type { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import type { IMfaSubject } from '../contracts/IMfaSubject.js';
import type { MfaSubjectBase } from '../abstracts/MfaSubjectBase.js';
import { InvalidMfaCodeError } from '../errors/InvalidMfaCodeError.js';
import { MfaCodeRequiredError } from '../errors/MfaCodeRequiredError.js';
import { MfaMethodAlreadyEnabledError } from '../errors/MfaMethodAlreadyEnabledError.js';
import { MfaMethodNotEnabledError } from '../errors/MfaMethodNotEnabledError.js';
import { MfaNotEnabledError } from '../errors/MfaNotEnabledError.js';
import { MfaSubjectNotFoundError } from '../errors/MfaSubjectNotFoundError.js';
import { UnsupportedMfaMethodError } from '../errors/UnsupportedMfaMethodError.js';
import type { IMfaChannel } from './IMfaChannel.js';
import type { MfaEncryptionService } from './MfaEncryptionService.js';
import { MfaService } from './MfaService.js';

// #endregion

// #region Tests

describe('MfaService', () => {
    let mockBcrypt: { hash: ReturnType<typeof vi.fn>; compare: ReturnType<typeof vi.fn> };
    let mockMfaSubject: { findById: ReturnType<typeof vi.fn>; updateMfaState: ReturnType<typeof vi.fn> };
    let mockEncryption: { encrypt: ReturnType<typeof vi.fn>; decrypt: ReturnType<typeof vi.fn> };
    let mockTotpChannel: IMfaChannel;

    function createMfaSubject(overrides?: Partial<IMfaSubject>): IMfaSubject {
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

    function createService(channels: IMfaChannel[] = [mockTotpChannel]): MfaService {
        return new MfaService(
            mockBcrypt as unknown as BcryptService,
            mockMfaSubject as unknown as MfaSubjectBase,
            mockEncryption as unknown as MfaEncryptionService,
            channels,
        );
    }

    async function captureFailure(operation: Promise<unknown>): Promise<unknown> {
        return operation.then(
            () => undefined,
            (error: unknown) => error,
        );
    }

    function expectStableBadRequest(failure: unknown, errorType: new (...args: never[]) => ProblemDetailException, code: string, message: string): void {
        expect(failure).toBeInstanceOf(errorType);
        expect(failure).toMatchObject({ code, message });
        expect((failure as ProblemDetailException).getStatus()).toBe(400);
        expect((failure as ProblemDetailException).getResponse()).toMatchObject({ code, detail: message });
    }

    beforeEach(() => {
        mockBcrypt = {
            hash: vi.fn().mockResolvedValue('hashed-code'),
            compare: vi.fn().mockResolvedValue(false),
        };
        mockMfaSubject = {
            findById: vi.fn().mockResolvedValue(createMfaSubject()),
            updateMfaState: vi.fn().mockResolvedValue(undefined),
        };
        mockEncryption = {
            encrypt: vi.fn().mockReturnValue('encrypted-secret'),
            decrypt: vi.fn().mockReturnValue('decrypted-secret'),
        };
        mockTotpChannel = {
            method: 'totp',
            initSetup: vi.fn().mockResolvedValue({ method: 'totp', secret: 'ABCDEF' }),
            verifySetup: vi.fn().mockResolvedValue(true),
            verifyChallenge: vi.fn().mockResolvedValue(true),
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('registeredMethods', () => {
        it('should return the methods of all registered channels', () => {
            // arrange
            const emailChannel: IMfaChannel = {
                method: 'email',
                initSetup: vi.fn(),
                verifySetup: vi.fn(),
                verifyChallenge: vi.fn(),
            };
            const service = createService([mockTotpChannel, emailChannel]);

            // act
            const methods = service.registeredMethods;

            // assert
            expect(methods).toEqual(['totp', 'email']);
        });
    });

    describe('initSetup', () => {
        it('should call initSetup on the matching channel', async () => {
            // arrange
            const service = createService();

            // act
            const result = await service.initSetup('user-1', 'totp');

            // assert
            expect(mockTotpChannel.initSetup).toHaveBeenCalledWith('user-1', undefined);
            expect(result).toEqual({ method: 'totp', secret: 'ABCDEF' });
        });

        it('should reject a method without a registered channel as unsupported', async () => {
            // arrange
            const service = createService();

            // act
            const failure = await captureFailure(service.initSetup('user-1', 'unknown'));

            // assert
            expectStableBadRequest(failure, UnsupportedMfaMethodError, 'UNSUPPORTED_MFA_METHOD', 'Unsupported MFA method: unknown');
        });

        it('should reject the setup of a method that is already enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaChannels: {
                        channels: { totp: { enabled: true } },
                    },
                }),
            );
            const service = createService();

            // act
            const failure = await captureFailure(service.initSetup('user-1', 'totp'));

            // assert
            expectStableBadRequest(failure, MfaMethodAlreadyEnabledError, 'MFA_METHOD_ALREADY_ENABLED', 'Selected MFA method is already enabled');
            expect(mockTotpChannel.initSetup).not.toHaveBeenCalled();
        });

        it('should reject a person that the MFA subject port does not find', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(null);
            const service = createService();

            // act
            const failure = await captureFailure(service.initSetup('user-1', 'totp'));

            // assert
            expectStableBadRequest(failure, MfaSubjectNotFoundError, 'MFA_SUBJECT_NOT_FOUND', 'User not found');
        });
    });

    describe('verifySetup', () => {
        it('should verify setup and return backup codes', async () => {
            // arrange
            const service = createService();

            // act
            const result = await service.verifySetup('user-1', 'totp', '123456');

            // assert
            expect(mockTotpChannel.verifySetup).toHaveBeenCalledWith('user-1', '123456');
            expect(result.backupCodes).toHaveLength(10);
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });

        it('should reject a blank setup code as missing', async () => {
            // arrange
            const service = createService();

            // act
            const failure = await captureFailure(service.verifySetup('user-1', 'totp', '   '));

            // assert
            expectStableBadRequest(failure, MfaCodeRequiredError, 'MFA_CODE_REQUIRED', 'A verification code is required');
            expect(mockTotpChannel.verifySetup).not.toHaveBeenCalled();
        });

        it('should reject a non-matching setup code as a bad request that keeps the session', async () => {
            // arrange
            (mockTotpChannel.verifySetup as ReturnType<typeof vi.fn>).mockResolvedValue(false);
            const service = createService();

            // act
            const failure = await service.verifySetup('user-1', 'totp', 'wrong').catch((error: unknown) => error);

            // assert
            expect(failure).toBeInstanceOf(InvalidMfaCodeError);
            expect(failure).not.toBeInstanceOf(UnauthorizedException);
            expect((failure as InvalidMfaCodeError).getStatus()).toBe(400);
            expect((failure as InvalidMfaCodeError).getResponse()).toMatchObject({ code: 'INVALID_MFA_CODE' });
            expect(mockMfaSubject.updateMfaState).not.toHaveBeenCalled();
        });
    });

    describe('verifyChallenge', () => {
        it('should verify a challenge via channel when mfa is enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaEnabled: true,
                    mfaChannels: { channels: { totp: { enabled: true } } },
                }),
            );
            const service = createService();

            // act
            const result = await service.verifyChallenge('user-1', 'totp', '123456');

            // assert
            expect(result).toBe(true);
            expect(mockTotpChannel.verifyChallenge).toHaveBeenCalledWith('user-1', '123456');
        });

        it('should reject a challenge of a person without enabled MFA', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createMfaSubject({ mfaEnabled: false }));
            const service = createService();

            // act
            const failure = await captureFailure(service.verifyChallenge('user-1', 'totp', '123456'));

            // assert
            expectStableBadRequest(failure, MfaNotEnabledError, 'MFA_NOT_ENABLED', 'Multi-factor authentication is not enabled');
            expect(mockTotpChannel.verifyChallenge).not.toHaveBeenCalled();
        });

        it('should consume a backup code when method is "backup"', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaEnabled: true,
                    mfaBackupCodes: ['hashed-backup'],
                }),
            );
            mockBcrypt.compare.mockResolvedValue(true);
            const service = createService();

            // act
            const result = await service.verifyChallenge('user-1', 'backup', 'my-backup-code');

            // assert
            expect(result).toBe(true);
            expect(mockBcrypt.compare).toHaveBeenCalledWith('my-backup-code', 'hashed-backup');
        });

        it('should fallback to backup codes when channel verification fails', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaEnabled: true,
                    mfaChannels: { channels: { totp: { enabled: true } } },
                    mfaBackupCodes: ['hashed-backup'],
                }),
            );
            (mockTotpChannel.verifyChallenge as ReturnType<typeof vi.fn>).mockResolvedValue(false);
            mockBcrypt.compare.mockResolvedValue(true);
            const service = createService();

            // act
            const result = await service.verifyChallenge('user-1', 'totp', 'backup-code');

            // assert
            expect(result).toBe(true);
        });

        it('should throw when selected method is not enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaEnabled: true,
                    mfaChannels: { channels: { sms: { enabled: true } } },
                }),
            );
            const service = createService();

            // act & assert
            await expect(service.verifyChallenge('user-1', 'totp', '123456')).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getEnabledMethods', () => {
        it('should return enabled methods from channel state', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaChannels: {
                        channels: {
                            totp: { enabled: true },
                            sms: { enabled: false },
                        },
                    },
                }),
            );
            const service = createService();

            // act
            const result = await service.getEnabledMethods('user-1');

            // assert
            expect(result.methods).toEqual(['totp']);
        });

        it('should migrate legacy mfaSecret to channel-based state', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaSecret: 'legacy-secret',
                    mfaChannels: { channels: {} },
                }),
            );
            const service = createService();

            // act
            const result = await service.getEnabledMethods('user-1');

            // assert
            expect(result.methods).toContain('totp');
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });
    });

    describe('issueChallenges', () => {
        it('should call issueChallenge on channels that support it', async () => {
            // arrange
            const issueFn = vi.fn().mockResolvedValue(undefined);
            const emailChannel: IMfaChannel = {
                method: 'email',
                initSetup: vi.fn(),
                verifySetup: vi.fn(),
                verifyChallenge: vi.fn(),
                issueChallenge: issueFn,
            };
            const service = createService([mockTotpChannel, emailChannel]);

            // act
            await service.issueChallenges('user-1', ['email', 'totp']);

            // assert
            expect(issueFn).toHaveBeenCalledWith('user-1');
        });

        it('should skip channels without issueChallenge', async () => {
            // arrange
            const service = createService();

            // act & assert
            await expect(service.issueChallenges('user-1', ['totp'])).resolves.toBeUndefined();
        });

        it('should deduplicate methods', async () => {
            // arrange
            const issueFn = vi.fn().mockResolvedValue(undefined);
            const emailChannel: IMfaChannel = {
                method: 'email',
                initSetup: vi.fn(),
                verifySetup: vi.fn(),
                verifyChallenge: vi.fn(),
                issueChallenge: issueFn,
            };
            const service = createService([emailChannel]);

            // act
            await service.issueChallenges('user-1', ['email', 'email']);

            // assert
            expect(issueFn).toHaveBeenCalledTimes(1);
        });
    });

    describe('setPreferredMethod', () => {
        it('should update the preferred method when it is enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaChannels: { channels: { totp: { enabled: true } } },
                }),
            );
            const service = createService();

            // act
            await service.setPreferredMethod('user-1', 'totp');

            // assert
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });

        it('should reject a preferred method that is not enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(
                createMfaSubject({
                    mfaChannels: { channels: {} },
                }),
            );
            const service = createService();

            // act
            const failure = await captureFailure(service.setPreferredMethod('user-1', 'sms'));

            // assert
            expectStableBadRequest(failure, MfaMethodNotEnabledError, 'MFA_METHOD_NOT_ENABLED', 'Preferred method must be enabled');
            expect(mockMfaSubject.updateMfaState).not.toHaveBeenCalled();
        });
    });

    describe('regenerateBackupCodes', () => {
        it('should generate new backup codes when MFA is enabled', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createMfaSubject({ mfaEnabled: true }));
            const service = createService();

            // act
            const codes = await service.regenerateBackupCodes('user-1');

            // assert
            expect(codes).toHaveLength(10);
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalled();
        });

        it('should reject regenerating backup codes of a person without enabled MFA', async () => {
            // arrange
            mockMfaSubject.findById.mockResolvedValue(createMfaSubject({ mfaEnabled: false }));
            const service = createService();

            // act
            const failure = await captureFailure(service.regenerateBackupCodes('user-1'));

            // assert
            expectStableBadRequest(failure, MfaNotEnabledError, 'MFA_NOT_ENABLED', 'Multi-factor authentication is not enabled');
            expect(mockMfaSubject.updateMfaState).not.toHaveBeenCalled();
        });
    });

    describe('disable', () => {
        it('should clear all MFA state for the user', async () => {
            // arrange
            const service = createService();

            // act
            await service.disable('user-1');

            // assert
            expect(mockMfaSubject.updateMfaState).toHaveBeenCalledWith(
                'user-1',
                expect.objectContaining({
                    mfaEnabled: false,
                    mfaPreferredMethod: null,
                    mfaBackupCodes: [],
                    mfaSecret: null,
                    mfaVerifiedAt: null,
                }),
            );
        });
    });
});

// #endregion
