// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils } from '@pixel-brewery/archipel-platform-core';
import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import { Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { AUTH_MFA_EMAIL_CODE_TTL, AUTH_MFA_EMAIL_MIN_RESEND } from '../../env.js';
import { MfaChannelNotEnabledError } from '../../errors/MfaChannelNotEnabledError.js';
import { MfaCodeExpiredError } from '../../errors/MfaCodeExpiredError.js';
import { MfaCodeNotIssuedError } from '../../errors/MfaCodeNotIssuedError.js';
import { MfaCodeRecentlySentError } from '../../errors/MfaCodeRecentlySentError.js';
import { MfaEmailRequiredError } from '../../errors/MfaEmailRequiredError.js';
import { MfaSetupExpiredError } from '../../errors/MfaSetupExpiredError.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import { IMfaSetup } from '../../models/index.js';
import { IMfaChannel } from '../IMfaChannel.js';
import { IMfaSetupContext, resolveMfaState } from '../MfaState.js';

// #endregion

/**
 * Email-based OTP MFA channel.
 *
 * **Stub implementation:** OTP delivery is logged but not actually sent.
 * Replace the `_logger.log` calls with a real email service integration
 * (e.g. platform-mailing) before production use.
 *
 * @public
 */
@Injectable()
export class EmailOtpMfaChannel implements IMfaChannel {
    public readonly method = 'email';

    private readonly _mfaSubject: MfaSubjectBase;
    private readonly _configService: ConfigService;
    private readonly _bcryptService: BcryptService;
    private readonly _logger = new Logger(EmailOtpMfaChannel.name);
    private readonly _ttlMilliseconds: number;
    private readonly _minResendMilliseconds: number;

    public constructor(mfaSubject: MfaSubjectBase, configService: ConfigService, bcryptService: BcryptService) {
        this._mfaSubject = mfaSubject;
        this._configService = configService;
        this._bcryptService = bcryptService;
        this._ttlMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_EMAIL_CODE_TTL.key, '10m'));
        this._minResendMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_EMAIL_MIN_RESEND.key, '30s'));
    }

    public async initSetup(userId: string, context?: IMfaSetupContext): Promise<IMfaSetup> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const email = context?.email ?? user.email;
        if (!email) {
            throw new MfaEmailRequiredError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method] ?? { enabled: false };

        const now = Date.now();
        if (channel.lastSentAt && now - Date.parse(channel.lastSentAt) < this._minResendMilliseconds) {
            throw new MfaCodeRecentlySentError('OTP');
        }

        const code = this.generateCode();
        const hashed = await this._bcryptService.hash(code);

        state.channels[this.method] = {
            enabled: false,
            email: email,
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

        this._logger.log(`Sending Email MFA code to ${email} (mock)`);

        return {
            method: this.method,
        };
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
            throw new MfaChannelNotEnabledError('Email');
        }

        const email = channel.email ?? user.email;
        if (!email) {
            throw new MfaEmailRequiredError();
        }

        const now = Date.now();
        if (channel.lastSentAt && now - Date.parse(channel.lastSentAt) < this._minResendMilliseconds) {
            throw new MfaCodeRecentlySentError('OTP');
        }

        const code = this.generateCode();
        const hashed = await this._bcryptService.hash(code);

        state.channels[this.method] = {
            ...channel,
            email: email,
            codeHash: hashed,
            codeExpiresAt: new Date(now + this._ttlMilliseconds).toISOString(),
            lastSentAt: new Date(now).toISOString(),
        };

        await this._mfaSubject.updateMfaState(userId, {
            mfaChannels: state,
            mfaUpdatedAt: new Date(),
        });

        this._logger.log(`Sending Email MFA code to ${email} (login)`);
    }

    private async verifyCodeAndMaybeEnable(userId: string, code: string, enable: boolean): Promise<boolean> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method];
        if (!channel?.codeHash || !channel.codeExpiresAt) {
            throw enable ? new MfaSetupNotInitializedError('Email') : new MfaCodeNotIssuedError('Email code');
        }

        if (Date.parse(channel.codeExpiresAt) < Date.now()) {
            throw enable ? new MfaSetupExpiredError('Email code') : new MfaCodeExpiredError('Email code');
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
}
