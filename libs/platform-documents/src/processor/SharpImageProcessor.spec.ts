import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDocumentModuleOptions } from '../DocumentModule.js';
import { IImagePayload } from '../interfaces/IImagePayload.js';
import { SharpImageProcessor } from './SharpImageProcessor.js';

// Mock sharp
vi.mock('sharp', () => {
    const mockSharpInstance = {
        png: vi.fn().mockReturnThis(),
        jpeg: vi.fn().mockReturnThis(),
        resize: vi.fn().mockReturnThis(),
        timeout: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('processed-image')),
    };

    const mockSharp = vi.fn(() => mockSharpInstance);
    return {
        default: mockSharp,
    };
});

describe('SharpImageProcessor', () => {
    // #region Fields

    let processor: SharpImageProcessor;
    let mockOptions: IDocumentModuleOptions;

    // #endregion

    // #region Setup

    beforeEach(() => {
        mockOptions = {
            maxImageWidth: 800,
            maxImageHeight: 600,
        };

        processor = new SharpImageProcessor(mockOptions);
        vi.clearAllMocks();
    });

    // #endregion

    // #region Process Tests

    describe('process', () => {
        it('should process image payload with Buffer data', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 400,
                height: 300,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.data).toBeInstanceOf(Buffer);
            expect(result.width).toBe(400);
            expect(result.height).toBe(300);
        });

        it('should process image payload with base64 data', async () => {
            // arrange
            const base64Data = Buffer.from('test-image').toString('base64');
            const payload: IImagePayload = {
                data: base64Data,
                width: 400,
                height: 300,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.data).toBeInstanceOf(Buffer);
            expect(result.width).toBe(400);
            expect(result.height).toBe(300);
        });

        it('should enforce max width limit', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 1200,
                height: 400,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(800); // Limited to maxImageWidth
            expect(result.height).toBe(400);
        });

        it('should enforce max height limit', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 400,
                height: 900,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(400);
            expect(result.height).toBe(600); // Limited to maxImageHeight
        });

        it('should use max width when no width specified', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                height: 300,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(800);
            expect(result.height).toBe(300);
        });

        it('should use max height when no height specified', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 400,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(400);
            expect(result.height).toBe(600);
        });

        it('should use default dimensions when not specified', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(800);
            expect(result.height).toBe(600);
        });

        it('should preserve mimeType from payload', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 400,
                height: 300,
                mimeType: 'image/jpeg',
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.mimeType).toBe('image/jpeg');
        });
    });

    // #endregion

    // #region ToPng Tests

    describe('toPng', () => {
        it('should convert buffer to PNG', async () => {
            // arrange
            const buffer = Buffer.from('test-image');

            // act
            const result = await processor.toPng(buffer);

            // assert
            expect(result).toBeInstanceOf(Buffer);
        });

        it('should apply width and height when specified', async () => {
            // arrange
            const buffer = Buffer.from('test-image');
            const width = 400;
            const height = 300;

            // act
            await processor.toPng(buffer, width, height);

            // assert
            const sharp = await import('sharp');
            const mockSharpInstance = (sharp as unknown as { default: (buf: Buffer) => Record<string, unknown> }).default(buffer);
            expect(mockSharpInstance.resize).toHaveBeenCalledWith(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        });

        it('should work without dimensions', async () => {
            // arrange
            const buffer = Buffer.from('test-image');

            // act
            const result = await processor.toPng(buffer);

            // assert
            expect(result).toBeInstanceOf(Buffer);
        });
    });

    // #endregion

    // #region ToJpeg Tests

    describe('toJpeg', () => {
        it('should convert buffer to JPEG with default quality', async () => {
            // arrange
            const buffer = Buffer.from('test-image');

            // act
            const result = await processor.toJpeg(buffer);

            // assert
            expect(result).toBeInstanceOf(Buffer);
        });

        it('should apply custom quality', async () => {
            // arrange
            const buffer = Buffer.from('test-image');
            const quality = 75;

            // act
            await processor.toJpeg(buffer, undefined, undefined, quality);

            // assert
            const sharp = await import('sharp');
            const mockSharpInstance = (sharp as unknown as { default: (buf: Buffer) => Record<string, unknown> }).default(buffer);
            expect(mockSharpInstance.jpeg).toHaveBeenCalledWith({ quality: 75 });
        });

        it('should apply width and height when specified', async () => {
            // arrange
            const buffer = Buffer.from('test-image');
            const width = 400;
            const height = 300;

            // act
            await processor.toJpeg(buffer, width, height);

            // assert
            const sharp = await import('sharp');
            const mockSharpInstance = (sharp as unknown as { default: (buf: Buffer) => Record<string, unknown> }).default(buffer);
            expect(mockSharpInstance.resize).toHaveBeenCalledWith(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
        });

        it('should work without dimensions', async () => {
            // arrange
            const buffer = Buffer.from('test-image');

            // act
            const result = await processor.toJpeg(buffer);

            // assert
            expect(result).toBeInstanceOf(Buffer);
        });
    });

    // #endregion

    // #region Edge Cases Tests

    describe('edge cases', () => {
        it('should handle empty buffer', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from(''),
                width: 100,
                height: 100,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle very small dimensions', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 1,
                height: 1,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(1);
            expect(result.height).toBe(1);
        });

        it('should respect custom max limits in options', async () => {
            // arrange
            const customOptions: IDocumentModuleOptions = {
                maxImageWidth: 1920,
                maxImageHeight: 1080,
            };
            const customProcessor = new SharpImageProcessor(customOptions);

            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 1600,
                height: 900,
            };

            // act
            const result = await customProcessor.process(payload);

            // assert
            expect(result.width).toBe(1600);
            expect(result.height).toBe(900);
        });

        it('should clamp dimensions to MAX_DIMENSION (8192) even if options allow more', async () => {
            // arrange
            const customOptions: IDocumentModuleOptions = {
                maxImageWidth: 20000,
                maxImageHeight: 20000,
            };
            const customProcessor = new SharpImageProcessor(customOptions);

            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 10000,
                height: 10000,
            };

            // act
            const result = await customProcessor.process(payload);

            // assert
            expect(result.width).toBe(8192);
            expect(result.height).toBe(8192);
        });

        it('should use defaults when zero dimensions are provided (falsy)', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: 0,
                height: 0,
            };

            // act
            const result = await processor.process(payload);

            // assert
            // 0 is falsy, so it falls back to maxWidth/maxHeight defaults
            expect(result.width).toBe(800);
            expect(result.height).toBe(600);
        });

        it('should clamp negative dimensions to 1', async () => {
            // arrange
            const payload: IImagePayload = {
                data: Buffer.from('test-image'),
                width: -100,
                height: -50,
            };

            // act
            const result = await processor.process(payload);

            // assert
            expect(result.width).toBe(1);
            expect(result.height).toBe(1);
        });
    });

    // #endregion
});
