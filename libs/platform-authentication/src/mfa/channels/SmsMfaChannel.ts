// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils } from '@pixel-brewery/archipel-platform-core';
import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import { Injectable, Logger } from '@nestjs/common';
import { randomInt } from 'node:crypto';
import { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { AUTH_MFA_SMS_CODE_TTL, AUTH_MFA_SMS_MIN_RESEND } from '../../env.js';
import { MfaChannelNotEnabledError } from '../../errors/MfaChannelNotEnabledError.js';
import { MfaCodeExpiredError } from '../../errors/MfaCodeExpiredError.js';
import { MfaCodeNotIssuedError } from '../../errors/MfaCodeNotIssuedError.js';
import { MfaCodeRecentlySentError } from '../../errors/MfaCodeRecentlySentError.js';
import { MfaPhoneNumberRequiredError } from '../../errors/MfaPhoneNumberRequiredError.js';
import { MfaSetupExpiredError } from '../../errors/MfaSetupExpiredError.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import { IMfaSetup } from '../../models/index.js';
import { IMfaChannel } from '../IMfaChannel.js';
import { IMfaSetupContext, resolveMfaState } from '../MfaState.js';

// #endregion

/**
 * SMS-based MFA channel.
 *
 * **Stub implementation:** OTP delivery is logged but not actually sent.
 * Replace the `_logger.log` calls with a real SMS gateway integration
 * (e.g. Twilio, Azure Communication Services) before production use.
 *
 * @public
 */
@Injectable()
export class SmsMfaChannel implements IMfaChannel {
    // #region Fields

    public readonly method = 'sms';

    private readonly _mfaSubject: MfaSubjectBase;
    private readonly _configService: ConfigService;
    private readonly _bcryptService: BcryptService;
    private readonly _logger = new Logger(SmsMfaChannel.name);
    private readonly _ttlMilliseconds: number;
    private readonly _minResendMilliseconds: number;

    // #endregion

    // #region Ctor

    public constructor(mfaSubject: MfaSubjectBase, configService: ConfigService, bcryptService: BcryptService) {
        this._mfaSubject = mfaSubject;
        this._configService = configService;
        this._bcryptService = bcryptService;
        this._ttlMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_SMS_CODE_TTL.key, '10m'));
        this._minResendMilliseconds = DateTimeUtils.parse(this._configService.tryGet(AUTH_MFA_SMS_MIN_RESEND.key, '30s'));
    }

    // #endregion

    // #region Methods

    public async initSetup(userId: string, context?: IMfaSetupContext): Promise<IMfaSetup> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const phone = context?.phoneNumber ?? user.phoneNumber;
        if (!phone) {
            throw new MfaPhoneNumberRequiredError();
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
            phoneNumber: phone,
            codeHash: hashed,
            codeExpiresAt: new Date(now + this._ttlMilliseconds).toISOString(),
            lastSentAt: new Date(now).toISOString(),
        };
        state.preferredMethod = state.preferredMethod ?? this.method;

        await this._mfaSubject.updateMfaState(userId, {
            phoneNumber: phone,
            mfaChannels: state,
            mfaPreferredMethod: state.preferredMethod,
            mfaUpdatedAt: new Date(),
        });

        this._logger.log(`Sending SMS MFA code to ${phone} (mock)`);

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
            throw new MfaChannelNotEnabledError('SMS');
        }

        const phone = channel.phoneNumber ?? user.phoneNumber;
        if (!phone) {
            throw new MfaPhoneNumberRequiredError();
        }

        const now = Date.now();
        if (channel.lastSentAt && now - Date.parse(channel.lastSentAt) < this._minResendMilliseconds) {
            throw new MfaCodeRecentlySentError('OTP');
        }

        const code = this.generateCode();
        const hashed = await this._bcryptService.hash(code);

        state.channels[this.method] = {
            ...channel,
            phoneNumber: phone,
            codeHash: hashed,
            codeExpiresAt: new Date(now + this._ttlMilliseconds).toISOString(),
            lastSentAt: new Date(now).toISOString(),
        };

        await this._mfaSubject.updateMfaState(userId, {
            mfaChannels: state,
            mfaUpdatedAt: new Date(),
        });

        this._logger.log(`Sending SMS MFA code to ${phone} (login)`);
    }

    private async verifyCodeAndMaybeEnable(userId: string, code: string, enable: boolean): Promise<boolean> {
        const user = await this._mfaSubject.findById(userId);
        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const state = resolveMfaState(user.mfaChannels);
        const channel = state.channels[this.method];
        if (!channel?.codeHash || !channel.codeExpiresAt) {
            throw enable ? new MfaSetupNotInitializedError('SMS') : new MfaCodeNotIssuedError('SMS code');
        }

        if (Date.parse(channel.codeExpiresAt) < Date.now()) {
            throw enable ? new MfaSetupExpiredError('SMS code') : new MfaCodeExpiredError('SMS code');
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
