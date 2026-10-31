// #region Imports

import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { deflateSync } from 'node:zlib';

// #endregion

/**
 * Service for generating GitHub-style identicon avatars.
 *
 * @public
 */
@Injectable()
export class AvatarGeneratorService {
    // #region Fields

    private static readonly BYTES_PER_PIXEL = 4;
    private static readonly CRC_TABLE = AvatarGeneratorService.createCrcTable();
    private static readonly DATA_URL_PREFIX = 'data:image/png;base64,';
    private static readonly MAX_DIMENSION = 32_767;
    private static readonly PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    private readonly _precision: number = 3;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Generates a deterministic avatar as a base64-encoded PNG string.
     * When a seed (e.g. a user ID) is provided, the same seed always produces the same avatar.
     *
     * @public
     * @param width - Width of the avatar in pixels (default: 128)
     * @param height - Height of the avatar in pixels (default: 128)
     * @param seed - Optional stable identifier (e.g. user ID) for deterministic output
     * @returns Base64-encoded PNG image string
     */
    public async generate(width = 128, height = 128, seed?: string): Promise<string> {
        const normalizedWidth = this.normalizeDimension(width, 'width');
        const normalizedHeight = this.normalizeDimension(height, 'height');
        const hashBytes = this.deriveBytes(seed);
        const pixels = this.buildImage(normalizedWidth, normalizedHeight, hashBytes);
        const png = this.encodePng(normalizedWidth, normalizedHeight, pixels);

        return `${AvatarGeneratorService.DATA_URL_PREFIX}${png.toString('base64')}`;
    }

    private static createCrcTable(): Uint32Array {
        const table = new Uint32Array(256);

        for (let value = 0; value < table.length; value++) {
            let crc = value;

            for (let bit = 0; bit < 8; bit++) {
                crc = (crc & 1) === 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
            }

            table[value] = crc >>> 0;
        }

        return table;
    }

    /**
     * Builds the avatar pixels with a deterministic identicon pattern.
     *
     * @private
     * @param width - Canvas width
     * @param height - Canvas height
     * @param bytes - Hash-derived bytes to drive color and pattern
     * @returns Premultiplied RGBA pixels containing the rendered identicon
     */
    private buildImage(width: number, height: number, bytes: Buffer): Buffer {
        const size = Math.min(width, height);
        const red = bytes[0] % 256;
        const green = bytes[1] % 256;
        const blue = bytes[2] % 256;
        const pixels = Buffer.alloc(width * height * AvatarGeneratorService.BYTES_PER_PIXEL);
        const offsetX = (width - size) / 2;
        const offsetY = (height - size) / 2;
        const mult = size / (this._precision * 2 - 1);
        let byteIndex = 3;

        for (let x = 0; x < this._precision; x++) {
            for (let y = 0; y < this._precision * 2; y++) {
                if (bytes[byteIndex % bytes.length] / 255 < 0.5) {
                    const top = Math.floor(y * mult);
                    const cellSize = Math.ceil(mult);

                    this.fillRectangle(pixels, width, height, Math.floor(x * mult) + offsetX, top + offsetY, cellSize, cellSize, red, green, blue);
                    this.fillRectangle(pixels, width, height, Math.floor(size - (x + 1) * mult) + offsetX, top + offsetY, cellSize, cellSize, red, green, blue);
                }
                byteIndex++;
            }
        }

        return pixels;
    }

    private calculateCrc(data: Buffer): number {
        let crc = 0xffffffff;

        for (const byte of data) {
            crc = AvatarGeneratorService.CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
        }

        return (crc ^ 0xffffffff) >>> 0;
    }

    private createChunk(type: string, data: Buffer): Buffer {
        const typeBuffer = Buffer.from(type, 'ascii');
        const chunk = Buffer.alloc(data.length + 12);

        chunk.writeUInt32BE(data.length, 0);
        typeBuffer.copy(chunk, 4);
        data.copy(chunk, 8);
        chunk.writeUInt32BE(this.calculateCrc(Buffer.concat([typeBuffer, data])), data.length + 8);

        return chunk;
    }

    private createImageHeader(width: number, height: number): Buffer {
        const header = Buffer.alloc(13);

        header.writeUInt32BE(width, 0);
        header.writeUInt32BE(height, 4);
        header[8] = 8;
        header[9] = 6;

        return header;
    }

    private createScanlines(width: number, height: number, pixels: Buffer): Buffer {
        const rowLength = width * AvatarGeneratorService.BYTES_PER_PIXEL;
        const scanlineLength = rowLength + 1;
        const scanlines = Buffer.alloc(scanlineLength * height);

        for (let y = 0; y < height; y++) {
            const sourceRowOffset = y * rowLength;
            const targetRowOffset = y * scanlineLength;
            const previousRowOffset = sourceRowOffset - rowLength;

            scanlines[targetRowOffset] = 2;

            for (let x = 0; x < rowLength; x += AvatarGeneratorService.BYTES_PER_PIXEL) {
                const sourceOffset = sourceRowOffset + x;
                const targetOffset = targetRowOffset + x + 1;

                for (let component = 0; component < AvatarGeneratorService.BYTES_PER_PIXEL; component++) {
                    const currentValue = this.readPixelComponent(pixels, sourceOffset, component);
                    const previousValue = y === 0 ? 0 : this.readPixelComponent(pixels, previousRowOffset + x, component);

                    scanlines[targetOffset + component] = (currentValue - previousValue + 256) & 0xff;
                }
            }
        }

        return scanlines;
    }

    private encodePng(width: number, height: number, pixels: Buffer): Buffer {
        const header = this.createChunk('IHDR', this.createImageHeader(width, height));
        const imageData = this.createChunk('IDAT', deflateSync(this.createScanlines(width, height, pixels)));
        const end = this.createChunk('IEND', Buffer.alloc(0));

        return Buffer.concat([AvatarGeneratorService.PNG_SIGNATURE, header, imageData, end]);
    }

    private fillRectangle(
        pixels: Buffer,
        imageWidth: number,
        imageHeight: number,
        left: number,
        top: number,
        width: number,
        height: number,
        red: number,
        green: number,
        blue: number,
    ): void {
        const right = left + width;
        const bottom = top + height;
        const firstX = Math.max(0, Math.floor(left));
        const lastX = Math.min(imageWidth, Math.ceil(right));
        const firstY = Math.max(0, Math.floor(top));
        const lastY = Math.min(imageHeight, Math.ceil(bottom));

        for (let y = firstY; y < lastY; y++) {
            const verticalCoverage = Math.max(0, Math.min(y + 1, bottom) - Math.max(y, top));

            for (let x = firstX; x < lastX; x++) {
                const horizontalCoverage = Math.max(0, Math.min(x + 1, right) - Math.max(x, left));
                const sourceAlpha = Math.round(horizontalCoverage * verticalCoverage * 255);

                this.blendPixel(pixels, (y * imageWidth + x) * AvatarGeneratorService.BYTES_PER_PIXEL, sourceAlpha, red, green, blue);
            }
        }
    }

    private blendPixel(pixels: Buffer, offset: number, sourceAlpha: number, red: number, green: number, blue: number): void {
        if (sourceAlpha === 0) {
            return;
        }

        const inverseSourceAlpha = 255 - sourceAlpha;

        pixels[offset] = this.multiplyBytes(red, sourceAlpha) + this.multiplyBytes(pixels[offset], inverseSourceAlpha);
        pixels[offset + 1] = this.multiplyBytes(green, sourceAlpha) + this.multiplyBytes(pixels[offset + 1], inverseSourceAlpha);
        pixels[offset + 2] = this.multiplyBytes(blue, sourceAlpha) + this.multiplyBytes(pixels[offset + 2], inverseSourceAlpha);
        pixels[offset + 3] = sourceAlpha + this.multiplyBytes(pixels[offset + 3], inverseSourceAlpha);
    }

    private multiplyBytes(left: number, right: number): number {
        return Math.floor((left * right + 127) / 255);
    }

    private normalizeDimension(value: number, name: string): number {
        const normalizedValue = Number.isFinite(value) ? Math.trunc(value) : 0;

        if (normalizedValue < 1 || normalizedValue > AvatarGeneratorService.MAX_DIMENSION) {
            throw new RangeError(`Avatar ${name} must be between 1 and ${AvatarGeneratorService.MAX_DIMENSION} pixels.`);
        }

        return normalizedValue;
    }

    private readPixelComponent(pixels: Buffer, offset: number, component: number): number {
        const alpha = pixels[offset + 3];

        return component === 3 ? alpha : this.unpremultiply(pixels[offset + component], alpha);
    }

    private unpremultiply(color: number, alpha: number): number {
        return alpha === 0 ? 0 : Math.floor((color * 255) / alpha);
    }

    /**
     * Derives deterministic bytes from a seed, or random bytes if no seed is provided.
     *
     * @private
     * @param seed - Optional stable seed string
     * @returns Buffer of derived bytes
     */
    private deriveBytes(seed?: string): Buffer {
        if (seed) {
            return createHash('sha256').update(seed).digest();
        }

        return randomBytes(32);
    }

    // #endregion
}
