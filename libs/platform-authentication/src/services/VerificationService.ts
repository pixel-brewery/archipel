// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils, HostService, type StringValue } from '@pixel-brewery/archipel-platform-core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { timingSafeEqual } from 'node:crypto';
import { VerificationSubjectBase } from '../abstracts/VerificationSubjectBase.js';
import { AUTH_VERIFY_JWT_EXPIRES_IN } from '../env.js';
import { JwtPayloadBase } from '../models/abstracts/JwtPayloadBase.js';

// #endregion

/**
 * Manages email / PIN verification tokens via the {@link VerificationSubjectBase}.
 *
 * @public
 */
@Injectable()
export class VerificationService {
    // #region Fields

    private readonly _jwtService: JwtService;
    private readonly _hostService: HostService;
    private readonly _verificationSubject: VerificationSubjectBase;
    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `VerificationService` class.
     *
     * @public
     * @param jwtService - JWT service instance.
     * @param hostService - Host service instance.
     * @param verificationSubject - Verification subject abstract base.
     * @param configService - Configuration service instance.
     */
    public constructor(jwtService: JwtService, hostService: HostService, verificationSubject: VerificationSubjectBase, configService: ConfigService) {
        this._jwtService = jwtService;
        this._hostService = hostService;
        this._verificationSubject = verificationSubject;
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Exhibits a new verification token.
     *
     * @public
     * @param data - The data to exhibit.
     * @returns The verification token.
     */
    public exhibitToken(data: Record<string, string>): Promise<string> {
        const expiresInMilliseconds = DateTimeUtils.parse(this._configService.get<StringValue>(AUTH_VERIFY_JWT_EXPIRES_IN.key));
        // jsonwebtoken treats numeric expiresIn values as seconds, while DateTimeUtils.parse returns milliseconds.
        const expiresInSeconds = expiresInMilliseconds / 1000;

        return this._jwtService.signAsync(data, {
            expiresIn: expiresInSeconds,
        });
    }

    /**
     * Redeems the user's token.
     *
     * @public
     * @param token - The token to redeem.
     * @returns The token data.
     */
    public redeemToken(token: string): Promise<Record<string, string>> {
        return this._jwtService.verifyAsync(token);
    }

    /**
     * Verifies the user's token.
     *
     * @public
     * @param token - The verification token.
     */
    public async verifyToken(token: string): Promise<boolean> {
        if (this._jwtService.verify(token)) {
            const jwt = this._jwtService.decode<JwtPayloadBase>(token);

            if (!jwt) {
                throw new BadRequestException('Invalid or expired token');
            }

            // check if the token is expired
            if (jwt.exp && Number(jwt.exp) < Math.floor(Date.now() / 1000)) {
                throw new BadRequestException('Invalid or expired token');
            }
        }

        const auth = await this._verificationSubject.findByVerificationToken(token);

        if (!auth || auth.isVerified) {
            return false;
        }

        await this._verificationSubject.markVerified(auth.id);

        return true;
    }

    public async verifyPin(pin: string, login: string): Promise<boolean> {
        const user = await this._verificationSubject.findByLogin(login);

        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.isVerified) {
            throw new BadRequestException('User already verified');
        }

        if (user.verificationToken) {
            const jwt = await this.redeemToken(user.verificationToken);

            const jwtEmail = String(jwt['email'] ?? '');
            const jwtPin = String(jwt['pin'] ?? '');
            const userEmail = String(user.email ?? '');

            const emailMatch = this.safeEqual(jwtEmail, userEmail);
            const pinMatch = this.safeEqual(jwtPin, pin);

            if (!emailMatch || !pinMatch) {
                throw new BadRequestException('Invalid verification token');
            }

            if (jwt['exp'] && Number(jwt['exp']) < Math.floor(Date.now() / 1000)) {
                throw new BadRequestException('Expired verification token');
            }

            await this._verificationSubject.markVerified(user.id);

            return true;
        }

        return false;
    }

    /**
     * Constructs the verification link.
     *
     * @public
     * @param token The verification token.
     * @returns The URL to verify the email.
     */
    public buildVerificationLink(token: string): string {
        return `${this._hostService.host}/api/auth/verify-token?token=${token}`; // get this dynamically or from config
    }

    /**
     * Performs a constant-time string comparison to prevent timing attacks.
     *
     * @param a - First string.
     * @param b - Second string.
     * @returns Whether the strings are equal.
     */
    private safeEqual(a: string, b: string): boolean {
        const bufA = Buffer.from(a, 'utf8');
        const bufB = Buffer.from(b, 'utf8');

        if (bufA.length !== bufB.length) {
            // Perform a dummy comparison to keep constant time even on length mismatch
            timingSafeEqual(bufA, bufA);
            return false;
        }

        return timingSafeEqual(bufA, bufB);
    }

    // #endregion
}
