// #region Imports

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

// #endregion

type HashAlgorithm = 'sha1' | 'sha256' | 'sha512';

/**
 * Node.js crypto plugin used by OTP operations without loading optional Otplib crypto plugins.
 *
 * @public
 */
export const NODE_CRYPTO_PLUGIN = {
    name: 'node',
    hmac(algorithm: HashAlgorithm, key: Uint8Array, data: Uint8Array): Uint8Array {
        return createHmac(algorithm, Buffer.from(key)).update(Buffer.from(data)).digest();
    },
    randomBytes(length: number): Uint8Array {
        return randomBytes(length);
    },
    constantTimeEqual(left: string | Uint8Array, right: string | Uint8Array): boolean {
        return compareTimingSafe(left, right);
    },
};

function compareTimingSafe(left: string | Uint8Array, right: string | Uint8Array): boolean {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length === rightBuffer.length) {
        return timingSafeEqual(leftBuffer, rightBuffer);
    }

    const paddedLength = Math.max(leftBuffer.length, rightBuffer.length);
    const paddedLeft = Buffer.alloc(paddedLength);
    const paddedRight = Buffer.alloc(paddedLength);

    leftBuffer.copy(paddedLeft);
    rightBuffer.copy(paddedRight);
    timingSafeEqual(paddedLeft, paddedRight);

    return false;
}
