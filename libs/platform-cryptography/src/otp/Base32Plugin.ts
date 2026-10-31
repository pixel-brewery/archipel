const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const BASE32_LOOKUP = new Map<string, number>(Array.from(BASE32_ALPHABET, (character, index) => [character, index]));

interface IBase32EncodeOptions {
    readonly padding?: boolean;
}

/**
 * RFC 4648 Base32 plugin used by OTP operations without loading ESM-only runtime dependencies.
 *
 * @public
 */
export const BASE32_PLUGIN = {
    name: 'archipel-base32',
    encode(data: Uint8Array, options: IBase32EncodeOptions = {}): string {
        return encodeBase32(data, options);
    },
    decode(value: string): Uint8Array {
        return decodeBase32(value);
    },
};

function encodeBase32(data: Uint8Array, options: IBase32EncodeOptions): string {
    let encoded = '';
    let bitBuffer = 0;
    let bitCount = 0;

    for (const byte of data) {
        bitBuffer = (bitBuffer << 8) | byte;
        bitCount += 8;

        while (bitCount >= 5) {
            encoded += BASE32_ALPHABET[(bitBuffer >>> (bitCount - 5)) & 31];
            bitCount -= 5;
        }
    }

    if (bitCount > 0) {
        encoded += BASE32_ALPHABET[(bitBuffer << (5 - bitCount)) & 31];
    }

    if (options.padding === true) {
        while (encoded.length % 8 !== 0) {
            encoded += '=';
        }
    }

    return encoded;
}

function decodeBase32(value: string): Uint8Array {
    const normalized = value.toUpperCase().replace(/=+$/u, '');
    const decoded: number[] = [];
    let bitBuffer = 0;
    let bitCount = 0;

    for (const character of normalized) {
        const decodedValue = BASE32_LOOKUP.get(character);

        if (decodedValue === undefined) {
            throw new Error(`Invalid Base32 character: ${character}`);
        }

        bitBuffer = (bitBuffer << 5) | decodedValue;
        bitCount += 5;

        if (bitCount >= 8) {
            decoded.push((bitBuffer >>> (bitCount - 8)) & 255);
            bitCount -= 8;
            bitBuffer &= (1 << bitCount) - 1;
        }
    }

    return new Uint8Array(decoded);
}
