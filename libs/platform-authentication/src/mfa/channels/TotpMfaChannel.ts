// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { IOtpService, OTP_SERVICE_TOKEN } from '@pixel-brewery/archipel-platform-cryptography/otp';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { MfaSubjectBase } from '../../abstracts/MfaSubjectBase.js';
import { MfaReplayPersistenceBase } from '../../abstracts/MfaReplayPersistenceBase.js';
import { MfaReplayProtectionUnavailableError } from '../../errors/MfaReplayProtectionUnavailableError.js';
import { createHash } from 'node:crypto';
import { AUTH_MFA_ISSUER } from '../../env.js';
import { MfaSetupNotInitializedError } from '../../errors/MfaSetupNotInitializedError.js';
import { MfaSubjectNotFoundError } from '../../errors/MfaSubjectNotFoundError.js';
import { IMfaSetup } from '../../models/index.js';
import { IMfaChannel } from '../IMfaChannel.js';
import { MfaEncryptionService } from '../MfaEncryptionService.js';
import { IMfaSetupContext, resolveMfaState } from '../MfaState.js';

// #endregion

@Injectable()
export class TotpMfaChannel implements IMfaChannel {
    // #region Fields

    public readonly method = 'totp';

    private readonly _mfaSubject: MfaSubjectBase;
    private readonly _configService: ConfigService;
    private readonly _encryptionService: MfaEncryptionService;
    private readonly _otpService: IOtpService;
    private readonly _issuer: string;
    private readonly _replay: MfaReplayPersistenceBase | undefined;

    // #endregion

    // #region Ctor

    public constructor(
        mfaSubject: MfaSubjectBase,
        configService: ConfigService,
        encryptionService: MfaEncryptionService,
        @Inject(OTP_SERVICE_TOKEN) otpService: IOtpService,
        @Optional() replay?: MfaReplayPersistenceBase,
    ) {
        this._mfaSubject = mfaSubject;
        this._configService = configService;
        this._encryptionService = encryptionService;
        this._otpService = otpService;
        this._issuer = this._configService.get<string>(AUTH_MFA_ISSUER.key);
        this._replay = replay;
    }

    // #endregion

    // #region Methods

    public async initSetup(userId: string, _context?: IMfaSetupContext): Promise<IMfaSetup> {
        const user = await this._mfaSubject.findById(userId);

        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        const accountLabel = user.email ?? user.userName ?? user.id;
        const secret = this._otpService.generateSecret();

        const encryptedSecret = this._encryptionService.encrypt(secret);
        const state = resolveMfaState(user.mfaChannels);
        state.channels[this.method] = {
            enabled: false,
            secret: encryptedSecret,
        };
        state.preferredMethod = state.preferredMethod ?? this.method;

        await this._mfaSubject.updateMfaState(userId, {
            mfaChannels: state,
            mfaEnabled: user.mfaEnabled ?? false,
            mfaPreferredMethod: state.preferredMethod ?? this.method,
            mfaUpdatedAt: new Date(),
        });

        const otpauthUrl = this._otpService.generateUri({ label: accountLabel, issuer: this._issuer, secret });

        return {
            method: this.method,
            secret: secret,
            otpauthUrl: otpauthUrl,
        };
    }

    public async verifySetup(userId: string, code: string): Promise<boolean> {
        const state = await this.loadState(userId);
        const channel = state.channels[this.method];
        if (!channel?.secret) {
            throw new MfaSetupNotInitializedError('TOTP');
        }

        const secret = this._encryptionService.decrypt(channel.secret);
        const isValid = await this.verifyCode(userId, channel.secret, code, secret);

        if (isValid) {
            channel.enabled = true;
            channel.verifiedAt = new Date().toISOString();
            await this._mfaSubject.updateMfaState(userId, {
                mfaChannels: state,
                mfaEnabled: true,
                mfaPreferredMethod: state.preferredMethod ?? this.method,
                mfaVerifiedAt: new Date(),
                mfaUpdatedAt: new Date(),
            });
        }

        return isValid;
    }

    public async verifyChallenge(userId: string, code: string): Promise<boolean> {
        const state = await this.loadState(userId);
        const channel = state.channels[this.method];

        if (!channel?.enabled || !channel.secret) {
            return false;
        }

        const secret = this._encryptionService.decrypt(channel.secret);
        const isValid = await this.verifyCode(userId, channel.secret, code, secret);

        return isValid;
    }

    private async verifyCode(userId: string, encryptedSecret: string, code: string, secret: string): Promise<boolean> {
        if (!this._replay) return this._otpService.verify(code, secret);
        if (!this._otpService.verifyTimeStep) throw new MfaReplayProtectionUnavailableError();
        const timeStep = this._otpService.verifyTimeStep(code, secret);
        if (timeStep === null || !Number.isSafeInteger(timeStep) || timeStep < 0) return false;
        return this._replay.consumeTotpStep(userId, createHash('sha256').update(encryptedSecret).digest('hex'), timeStep);
    }

    private async loadState(userId: string) {
        const user = await this._mfaSubject.findById(userId);

        if (!user) {
            throw new MfaSubjectNotFoundError();
        }

        return resolveMfaState(user.mfaChannels);
    }

    // #endregion
}
