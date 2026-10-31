// #region Imports

import { Inject, Injectable, Optional } from '@nestjs/common';
import { generateSecret } from '@otplib/core';
import { verify as verifyHotp } from '@otplib/hotp';
import { verifySync as verifyTotpSync } from '@otplib/totp';
import { generateTOTP } from '@otplib/uri';
import { BASE32_PLUGIN } from './Base32Plugin.js';
import { IOtpOptions } from './IOtpOptions.js';
import { IOtpService, IOtpUriOptions } from './IOtpService.js';
import { NODE_CRYPTO_PLUGIN } from './NodeCryptoPlugin.js';
import { OTP_OPTIONS } from './OtpTokens.js';

// #endregion

/**
 * Default TOTP verification tolerance expressed in **seconds** (otplib v13 `epochTolerance`).
 *
 * Each time step equals 30 seconds by default (RFC 6238).
 *
 * | `epochTolerance` | Accepted range          |
 * |------------------|-------------------------|
 * | 0                | current step only       |
 * | 30               | ±1 step (±30 s)         |
 * | 60               | ±2 steps (±60 s)        |
 * | 90               | ±3 steps (±90 s)        |
 *
 * @public
 */
export const TOTP_EPOCH_TOLERANCE = 30;

/**
 * OTP service implementation backed by otplib v13.
 *
 * Wraps the otplib standalone functions behind the generic
 * {@link IOtpService} interface so consumers are decoupled from
 * the library version.
 *
 * @public
 */
@Injectable()
export class OtpService implements IOtpService {
    // #region Fields

    private readonly _epochTolerance: number;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `OtpService` class.
     *
     * @param options - Optional OTP configuration. When omitted, defaults
     *   to a tolerance of 30 seconds.
     */
    public constructor(@Optional() @Inject(OTP_OPTIONS) options?: IOtpOptions) {
        this._epochTolerance = options?.epochTolerance ?? TOTP_EPOCH_TOLERANCE;
    }

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public generateSecret(): string {
        return generateSecret({ crypto: NODE_CRYPTO_PLUGIN, base32: BASE32_PLUGIN });
    }

    /** @inheritdoc */
    public generateUri(options: IOtpUriOptions): string {
        return generateTOTP({ issuer: options.issuer, label: options.label, secret: options.secret });
    }

    /**
     * Verifies a TOTP token against the given secret.
     *
     * The underlying comparison performed by otplib's `verifySync` is
     * **constant-time**, preventing timing-based side-channel attacks.
     *
     * @inheritdoc
     */
    public verify(token: string, secret: string): boolean {
        const result = verifyTotpSync({
            token,
            secret,
            epochTolerance: this._epochTolerance,
            crypto: NODE_CRYPTO_PLUGIN,
            base32: BASE32_PLUGIN,
        });

        return result.valid;
    }

    /** @inheritdoc */
    public async verifyHotp(token: string, secret: string, counter: number): Promise<boolean> {
        const result = await verifyHotp({ token, secret, counter, crypto: NODE_CRYPTO_PLUGIN, base32: BASE32_PLUGIN });

        return result.valid;
    }

    // #endregion
}
