// #region Imports

import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import type { IMfaSubject } from '../contracts/IMfaSubject.js';
import { MfaSubjectBase } from '../abstracts/MfaSubjectBase.js';
import { InvalidMfaCodeError } from '../errors/InvalidMfaCodeError.js';
import { MfaCodeRequiredError } from '../errors/MfaCodeRequiredError.js';
import { MfaMethodAlreadyEnabledError } from '../errors/MfaMethodAlreadyEnabledError.js';
import { MfaMethodNotEnabledError } from '../errors/MfaMethodNotEnabledError.js';
import { MfaNotEnabledError } from '../errors/MfaNotEnabledError.js';
import { MfaSubjectNotFoundError } from '../errors/MfaSubjectNotFoundError.js';
import { UnsupportedMfaMethodError } from '../errors/UnsupportedMfaMethodError.js';
import { IMfaConfirmation, IMfaSetup } from '../models/index.js';
import { IMfaChannel } from './IMfaChannel.js';
import { MfaEncryptionService } from './MfaEncryptionService.js';
import { IMfaSetupContext, resolveMfaState } from './MfaState.js';
import { MFA_CHANNELS } from './tokens/MfaTokens.js';

// #endregion

/**
 * Orchestrates MFA channels, backup codes, and user preferences.
 *
 * @public
 */
@Injectable()
export class MfaService {
    // #region Fields

    private readonly _bcryptService: BcryptService;
    private readonly _mfaSubject: MfaSubjectBase;
    private readonly _channels: Map<string, IMfaChannel>;
    private readonly _backupCodeCount: number;
    private readonly _encryptionService: MfaEncryptionService;

    // #endregion

    // #region Ctor

    public constructor(
        bcryptService: BcryptService,
        mfaSubject: MfaSubjectBase,
        encryptionService: MfaEncryptionService,
        @Inject(MFA_CHANNELS) channels: IMfaChannel[],
    ) {
        this._bcryptService = bcryptService;
        this._mfaSubject = mfaSubject;
        this._channels = new Map(channels.map((channel) => [channel.method, channel]));
        this._backupCodeCount = 10;
        this._encryptionService = encryptionService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes setup for a specific MFA method.
     *
     * @throws {UnsupportedMfaMethodError} With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     * @throws {MfaMethodAlreadyEnabledError} With `400` and `MFA_METHOD_ALREADY_ENABLED` when the method is already enabled.
     */
    public async initSetup(userId: string, method: string, context?: IMfaSetupContext): Promise<IMfaSetup> {
        const channel = this.requireChannel(method);
        const user = await this.getUser(userId);

        const state = resolveMfaState(user.mfaChannels);
        if (state.channels[method]?.enabled) {
            throw new MfaMethodAlreadyEnabledError();
        }

        return channel.initSetup(userId, context);
    }

    /**
     * Verifies the initial code for a method and issues backup codes.
     *
     * @throws {UnsupportedMfaMethodError} With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.
     * @throws {MfaCodeRequiredError} With `400` and `MFA_CODE_REQUIRED` when the code is empty.
     * @throws {InvalidMfaCodeError} With `400` and `INVALID_MFA_CODE` when the code does not match. The person is
     * signed in, so the rejection must not read as an ended session.
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     */
    public async verifySetup(userId: string, method: string, code: string): Promise<IMfaConfirmation> {
        const channel = this.requireChannel(method);

        if (!code?.trim()) {
            throw new MfaCodeRequiredError();
        }

        const isValid = await channel.verifySetup(userId, code.trim());
        if (!isValid) {
            throw new InvalidMfaCodeError();
        }

        const backupCodes = await this.generateBackupCodes(userId);
        const latestUser = await this.getUser(userId);
        const latestState = resolveMfaState(latestUser.mfaChannels);
        await this._mfaSubject.updateMfaState(userId, {
            mfaEnabled: true,
            mfaPreferredMethod: latestState.preferredMethod ?? method,
            mfaBackupCodes: backupCodes.hashed,
            mfaVerifiedAt: new Date(),
            mfaUpdatedAt: new Date(),
            mfaChannels: latestState,
        });

        return { backupCodes: backupCodes.plain };
    }

    /**
     * Verifies a login challenge using the selected method or backup code.
     *
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     * @throws {MfaNotEnabledError} With `400` and `MFA_NOT_ENABLED` when the person has not enabled MFA.
     * @throws {UnsupportedMfaMethodError} With `400` and `UNSUPPORTED_MFA_METHOD` when no channel serves the method.
     */
    public async verifyChallenge(userId: string, method: string, code: string): Promise<boolean> {
        const sanitizedCode = code.trim();
        const user = await this.getUser(userId);
        const state = resolveMfaState(user.mfaChannels);

        if (!user.mfaEnabled) {
            throw new MfaNotEnabledError();
        }

        if (method === 'backup') {
            const success = await this.tryConsumeBackupCode(user, sanitizedCode);
            if (success) {
                await this.touchVerification(userId);
            }
            return success;
        }

        const channel = this.requireChannel(method);
        const enabledMethods = Object.entries(state.channels)
            .filter(([, value]) => value.enabled)
            .map(([key]) => key);

        if (!enabledMethods.includes(method)) {
            throw new UnauthorizedException('Selected method is not enabled');
        }

        const isValid = await channel.verifyChallenge(userId, sanitizedCode);
        if (isValid) {
            await this.touchVerification(userId);
            return true;
        }

        const fallback = await this.tryConsumeBackupCode(user, sanitizedCode);
        if (fallback) {
            await this.touchVerification(userId);
        }

        return fallback;
    }

    /**
     * Returns enabled methods and preferred method for a user.
     *
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     */
    public async getEnabledMethods(userId: string): Promise<{ methods: string[]; preferredMethod?: string }> {
        const user = await this.getUser(userId);
        const state = resolveMfaState(user.mfaChannels);

        const methods = Object.entries(state.channels)
            .filter(([, value]) => value.enabled)
            .map(([key]) => key);

        if (methods.length === 0 && this._channels.has('totp') && user.mfaSecret) {
            state.channels['totp'] = {
                enabled: true,
                secret: this._encryptionService.encrypt(user.mfaSecret),
                verifiedAt: user.mfaVerifiedAt?.toISOString() ?? new Date().toISOString(),
            };
            state.preferredMethod = state.preferredMethod ?? 'totp';

            await this._mfaSubject.updateMfaState(userId, {
                mfaChannels: state,
                mfaPreferredMethod: state.preferredMethod,
                mfaSecret: null,
                mfaUpdatedAt: new Date(),
            });

            methods.push('totp');
        }

        const preferredFromUser = user.mfaPreferredMethod;

        return {
            methods: methods,
            preferredMethod: state.preferredMethod ?? preferredFromUser ?? methods[0],
        };
    }

    /**
     * Issues out-of-band challenge codes for login flows for applicable channels.
     */
    public async issueChallenges(userId: string, methods: ReadonlyArray<string>): Promise<void> {
        const uniqueMethods = Array.from(new Set(methods));

        for (const method of uniqueMethods) {
            const channel = this._channels.get(method);
            if (!channel?.issueChallenge) {
                continue;
            }

            await channel.issueChallenge(userId);
        }
    }

    /**
     * Updates the preferred MFA method.
     *
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     * @throws {MfaMethodNotEnabledError} With `400` and `MFA_METHOD_NOT_ENABLED` when the method is not enabled.
     */
    public async setPreferredMethod(userId: string, method: string): Promise<void> {
        const enabled = await this.getEnabledMethods(userId);
        if (!enabled.methods.includes(method)) {
            throw new MfaMethodNotEnabledError();
        }

        const user = await this.getUser(userId);
        const state = resolveMfaState(user.mfaChannels);
        state.preferredMethod = method;

        await this._mfaSubject.updateMfaState(userId, {
            mfaPreferredMethod: method,
            mfaChannels: state,
            mfaUpdatedAt: new Date(),
        });
    }

    /**
     * Regenerates backup codes.
     *
     * @throws {MfaSubjectNotFoundError} With `400` and `MFA_SUBJECT_NOT_FOUND` when the person does not exist.
     * @throws {MfaNotEnabledError} With `400` and `MFA_NOT_ENABLED` when the person has not enabled MFA.
     */
    public async regenerateBackupCodes(userId: string): Promise<ReadonlyArray<string>> {
        const user = await this.getUser(userId);
        if (!user.mfaEnabled) {
            throw new MfaNotEnabledError();
        }

        const backupCodes = await this.generateBackupCodes(userId);
        await this._mfaSubject.updateMfaState(userId, {
            mfaBackupCodes: backupCodes.hashed,
            mfaUpdatedAt: new Date(),
        });

        return backupCodes.plain;
    }

    /**
     * Disables MFA for a user and clears channel secrets.
     */
    public async disable(userId: string): Promise<void> {
        await this._mfaSubject.updateMfaState(userId, {
            mfaEnabled: false,
            mfaPreferredMethod: null,
            mfaBackupCodes: [],
            mfaChannels: { channels: {}, trustedDevices: [] },
            mfaSecret: null,
            mfaVerifiedAt: null,
            mfaUpdatedAt: new Date(),
        });
    }

    public get registeredMethods(): string[] {
        return Array.from(this._channels.keys());
    }

    private requireChannel(method: string): IMfaChannel {
        const channel = this._channels.get(method);
        if (!channel) {
            throw new UnsupportedMfaMethodError(method);
        }

        return channel;
    }

    private async generateBackupCodes(userId: string): Promise<{ plain: ReadonlyArray<string>; hashed: string[] }> {
        const plain = Array.from({ length: this._backupCodeCount }, () => randomBytes(5).toString('hex'));
        const hashed = await Promise.all(plain.map((value) => this._bcryptService.hash(value)));
        await this._mfaSubject.updateMfaState(userId, {
            mfaBackupCodes: hashed,
            mfaUpdatedAt: new Date(),
        });

        return { plain, hashed };
    }

    private async tryConsumeBackupCode(user: IMfaSubject, code: string): Promise<boolean> {
        const storedBackupCodes = user.mfaBackupCodes ?? [];

        for (const storedBackupCode of storedBackupCodes) {
            const isMatch = await this._bcryptService.compare(code, storedBackupCode);

            if (isMatch) {
                const remainingCodes = storedBackupCodes.filter((value) => value !== storedBackupCode);

                await this._mfaSubject.updateMfaState(user.id, {
                    mfaBackupCodes: remainingCodes,
                    mfaUpdatedAt: new Date(),
                });

                return true;
            }
        }

        return false;
    }

    private async getUser(userId: string): Promise<IMfaSubject> {
        const user = await this._mfaSubject.findById(userId);

        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        return user;
    }

    private async touchVerification(userId: string): Promise<void> {
        await this._mfaSubject.updateMfaState(userId, {
            mfaVerifiedAt: new Date(),
            mfaUpdatedAt: new Date(),
        });
    }

    // #endregion
}
