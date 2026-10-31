// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils } from '@pixel-brewery/archipel-platform-core';
import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import { Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { AUTH_MFA_PUSH_CODE_TTL, AUTH_MFA_PUSH_MIN_RESEND } from '../../env.js';
import { MfaChannelNotEnabledError } from '../../errors/MfaChannelNotEnabledError.js';
import { MfaCodeExpiredError } from '../../errors/MfaCodeExpiredError.js';
import { MfaCodeNotIssuedError } from '../../errors/MfaCodeNotIssuedError.js';
import { MfaCodeRecentlySentError } from '../../errors/MfaCodeRecentlySentError.js';
import { MfaSetupExpiredError } from '../../errors/MfaSetupExpiredError.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import { IMfaSetup } from '../../models/index.js';
import { IMfaChannel } from '../IMfaChannel.js';
import { IMfaSetupContext, resolveMfaState } from '../MfaState.js';

// #endregion

/**
 * Push-style MFA channel that simulates a device approval code.
 *
 * **Stub implementation:** Approval delivery is logged but not actually sent.
 * Replace the `_logger.log` calls with a real push notification provider
 * before production use.
 *
 * @public
 */
@Injectable()
export class PushMfaChannel implements IMfaChannel {
    // #region Fields

    public readonly method = 'push';

    private readonly _mfaSubject: MfaSubjectBase;
    private readonly _configService: ConfigService;
    private readonly _bcryptService: BcryptService;
    private readonly _logger = new Logger(PushMfaChannel.name);
    private readonly _ttlMilliseconds: number;
    private readonly _minResendMilliseconds: number;

    // #endregion

    // #region Ctor

    public constructor(mfaSubject: MfaSubjectBase, configService: ConfigService, bcryptService: BcryptService) {
        this._mfaSubject = mfaSubject;
        this._configService = configService;
        this._bcryptService = bcryptService;
        this._ttlMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_PUSH_CODE_TTL.key, '10m'));
        this._minResendMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_PUSH_MIN_RESEND.key, '30s'));
    }

    // #endregion

    // #region Methods

    public async initSetup(userId: string, _context?: IMfaSetupContext): Promise<IMfaSetup> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method] ?? { enabled: false };

        const now = Date.now();
        if (channel.lastSentAt && now - Date.parse(channel.lastSentAt) < this._minResendMilliseconds) {
            throw new MfaCodeRecentlySentError('Approval request');
        }

        const code = this.generateCode();
        const hashed = await this._bcryptService.hash(code);

        state.channels[this.method] = {
            enabled: false,
            codeHash: hashed,
            codeExpiresAt: new Date(now + this._ttlMilliseconds).toISOString(),
            lastSentAt: new Date(now).toISOString(),
        };
        state.preferredMethod = state.preferredMethod ?? this.method;

        await this._mfaSubject.updateMfaState(userId, {
            mfaChannels: state,
            mfaPreferredMethod: state.preferredMethod,
            mfaUpdatedAt: new Date(),
        });

        // Replace with actual push notification send once available.
        this._logger.log(`Simulating push approval code for user ${user.id}`);

        return { method: this.method };
    }

    public async verifySetup(userId: string, code: string): Promise<boolean> {
        return this.verifyCodeAndMaybeEnable(userId, code, true);
    }

    public async verifyChallenge(userId: string, code: string): Promise<boolean> {
        return this.verifyCodeAndMaybeEnable(userId, code, false);
    }

    public async issueChallenge(userId: string): Promise<void> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method];
        if (!channel?.enabled) {
            throw new MfaChannelNotEnabledError('Push');
        }

        const now = Date.now();
        if (channel.lastSentAt && now - Date.parse(channel.lastSentAt) < this._minResendMilliseconds) {
            throw new MfaCodeRecentlySentError('Approval request');
        }

        const code = this.generateCode();
        const hashed = await this._bcryptService.hash(code);

        state.channels[this.method] = {
            ...channel,
            codeHash: hashed,
            codeExpiresAt: new Date(now + this._ttlMilliseconds).toISOString(),
            lastSentAt: new Date(now).toISOString(),
        };

        await this._mfaSubject.updateMfaState(userId, {
            mfaChannels: state,
            mfaUpdatedAt: new Date(),
        });

        this._logger.log(`Simulating push approval for user ${user.id}`);
    }

    private async verifyCodeAndMaybeEnable(userId: string, code: string, enable: boolean): Promise<boolean> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method];
        if (!channel?.codeHash || !channel.codeExpiresAt) {
            throw enable ? new MfaSetupNotInitializedError('Push') : new MfaCodeNotIssuedError('Push approval');
        }

        if (Date.parse(channel.codeExpiresAt) < Date.now()) {
            throw enable ? new MfaSetupExpiredError('Push approval') : new MfaCodeExpiredError('Push approval');
        }

        const isValid = await this._bcryptService.compare(code, channel.codeHash);
        if (!isValid) {
            return false;
        }

        if (enable) {
            state.channels[this.method] = {
                ...channel,
                enabled: true,
                verifiedAt: new Date().toISOString(),
                codeHash: undefined,
                codeExpiresAt: undefined,
            };

            await this._mfaSubject.updateMfaState(userId, {
                mfaChannels: state,
                mfaEnabled: true,
                mfaPreferredMethod: state.preferredMethod ?? this.method,
                mfaVerifiedAt: new Date(),
                mfaUpdatedAt: new Date(),
            });
        } else {
            state.channels[this.method] = {
                ...channel,
                codeHash: undefined,
                codeExpiresAt: undefined,
            };

            await this._mfaSubject.updateMfaState(userId, {
                mfaChannels: state,
                mfaUpdatedAt: new Date(),
            });
        }

        return true;
    }

    private generateCode(): string {
        return randomInt(10000000, 99999999).toString();
    }

    // #endregion
}
