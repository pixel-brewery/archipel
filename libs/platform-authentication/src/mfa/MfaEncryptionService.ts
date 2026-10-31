// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { AUTH_MFA_ENCRYPTION_KEY } from '../env.js';

// #endregion

/**
 * Provides AES-GCM encryption for MFA secrets.
 *
 * @public
 */
@Injectable()
export class MfaEncryptionService {
    // #region Fields

    private readonly _key: Buffer;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        const rawKey = configService.get<string>(AUTH_MFA_ENCRYPTION_KEY.key);
        this._key = createHash('sha256').update(rawKey).digest();
    }

    // #endregion

    // #region Methods

    /**
     * Encrypts the provided secret using AES-256-GCM.
     *
     * @param secret Plaintext secret to encrypt.
     * @returns Base64 encoded payload containing IV, auth tag, and ciphertext.
     */
    public encrypt(secret: string): string {
        const iv = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', this._key, iv);
        const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return Buffer.concat([iv, authTag, encrypted]).toString('base64');
    }

    /**
     * Decrypts the payload produced by {@link encrypt}.
     *
     * @param payload Base64 encoded payload with IV, auth tag, and ciphertext.
     */
    public decrypt(payload: string): string {
        const buffer = Buffer.from(payload, 'base64');
        const iv = buffer.subarray(0, 12);
        const authTag = buffer.subarray(12, 28);
        const ciphertext = buffer.subarray(28);

        const decipher = createDecipheriv('aes-256-gcm', this._key, iv);
        decipher.setAuthTag(authTag);

        const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return decrypted.toString('utf8');
    }

    // #endregion
}
