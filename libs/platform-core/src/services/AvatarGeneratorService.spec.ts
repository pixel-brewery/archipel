// #region Imports

import { createHash } from 'node:crypto';
import { inflateSync } from 'node:zlib';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AvatarGeneratorService } from './AvatarGeneratorService.js';

// #endregion

interface IDecodedPng {
    readonly height: number;
    readonly pixels: Buffer;
    readonly width: number;
}

const CANVAS_COMPATIBILITY_CASES = [
    {
        width: 64,
        height: 64,
        seed: 'test-seed',
        pixelHash: '5adde33f84ab2b6b61e375f0d48931a2704efeee5e1191ced116138d79da9e07',
    },
    {
        width: 128,
        height: 128,
        seed: 'default-dims',
        pixelHash: '2ed7832eeae67fd9f18376710159f32d42cc5b964067941c334f487f49911373',
    },
    {
        width: 512,
        height: 512,
        seed: 'compatibility-seed',
        pixelHash: '679e3902420b098e165e8384615054ea98bdbd4fa8d6a126852c43d51cf1ab5e',
    },
    {
        width: 65,
        height: 64,
        seed: 'compatibility-seed',
        pixelHash: '31e5d3d4aae982628e4c93b7e60d73cd7ba3c6e75210d6cf74152fe2988816c7',
    },
] as const;

// #region Tests

describe('AvatarGeneratorService', () => {
    const service = new AvatarGeneratorService();

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should generate a base64 PNG data URL', async () => {
        // act
        const result = await service.generate(64, 64, 'test-seed');

        // assert
        expect(result).toMatch(/^data:image\/png;base64,/);
        expect(Buffer.from(result.slice('data:image/png;base64,'.length), 'base64').subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    });

    it.each(CANVAS_COMPATIBILITY_CASES)(
        'should preserve the Canvas-rendered pixels for $width x $height avatars',
        async ({ width, height, seed, pixelHash }) => {
            // act
            const result = await service.generate(width, height, seed);

            // assert
            const decoded = decodePng(result);
            expect(decoded.width).toBe(width);
            expect(decoded.height).toBe(height);
            expect(createHash('sha256').update(decoded.pixels).digest('hex')).toBe(pixelHash);
        },
    );

    it('should produce deterministic output for the same seed', async () => {
        // act
        const [firstResult, secondResult] = await Promise.all([service.generate(64, 64, 'deterministic-seed'), service.generate(64, 64, 'deterministic-seed')]);

        // assert
        expect(firstResult).toBe(secondResult);
    });

    it('should produce different output for different seeds', async () => {
        // act
        const [firstResult, secondResult] = await Promise.all([service.generate(64, 64, 'seed-a'), service.generate(64, 64, 'seed-b')]);

        // assert
        expect(firstResult).not.toBe(secondResult);
    });

    it('should produce non-deterministic output when no seed is provided', async () => {
        // act
        const [firstResult, secondResult] = await Promise.all([service.generate(64, 64), service.generate(64, 64)]);

        // assert
        expect(firstResult).not.toBe(secondResult);
    });

    it('should use default dimensions when not specified', async () => {
        // act
        const result = await service.generate(undefined, undefined, 'default-dims');

        // assert
        const decoded = decodePng(result);
        expect(decoded.width).toBe(128);
        expect(decoded.height).toBe(128);
    });

    it.each([
        { width: 0, height: 64 },
        { width: 64, height: 0 },
        { width: 32_768, height: 64 },
        { width: 64, height: 32_768 },
    ])('should reject unsupported avatar dimensions $width x $height', async ({ width, height }) => {
        // act
        const result = service.generate(width, height, 'invalid-dimensions');

        // assert
        await expect(result).rejects.toThrow(RangeError);
    });
});

// #endregion

function decodePng(dataUrl: string): IDecodedPng {
    const png = Buffer.from(dataUrl.slice('data:image/png;base64,'.length), 'base64');
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    const imageDataChunks: Buffer[] = [];
    let chunkOffset = 8;

    while (chunkOffset < png.length) {
        const chunkLength = png.readUInt32BE(chunkOffset);
        const chunkType = png.toString('ascii', chunkOffset + 4, chunkOffset + 8);
        const dataOffset = chunkOffset + 8;

        if (chunkType === 'IDAT') {
            imageDataChunks.push(png.subarray(dataOffset, dataOffset + chunkLength));
        }

        chunkOffset += chunkLength + 12;
    }

    const inflated = inflateSync(Buffer.concat(imageDataChunks));
    const rowLength = width * 4;
    const pixels = Buffer.alloc(rowLength * height);

    for (let y = 0; y < height; y++) {
        const sourceOffset = y * (rowLength + 1);
        const filter = inflated[sourceOffset];

        if (filter !== 0 && filter !== 2) {
            throw new Error('Compatibility PNG uses an unsupported scanline filter.');
        }

        for (let x = 0; x < rowLength; x++) {
            const previousValue = filter === 2 && y > 0 ? pixels[(y - 1) * rowLength + x] : 0;

            pixels[y * rowLength + x] = (inflated[sourceOffset + x + 1] + previousValue) & 0xff;
        }
    }

    return { width, height, pixels };
}
