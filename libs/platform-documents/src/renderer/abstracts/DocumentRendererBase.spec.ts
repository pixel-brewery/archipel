import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import type { RequiredDeep } from 'type-fest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDocumentModuleOptions } from '../../DocumentModule.js';
import { IImagePayload } from '../../interfaces/IImagePayload.js';
import { IRenderOptions } from '../../interfaces/IRenderOptions.js';
import { IImageProcessor } from '../../processor/interfaces/IImageProcessor.js';
import { DocumentFormat, IRenderResult } from '../../types/DocumentTypes.js';
import { DocumentRendererBase } from './DocumentRendererBase.js';

/**
 * Concrete subclass to expose protected methods for testing.
 */
class TestDocumentRenderer extends DocumentRendererBase {
    public get supportedFormats(): ReadonlyArray<DocumentFormat> {
        return ['docx'];
    }

    public async render(_options: IRenderOptions): Promise<IRenderResult> {
        throw new Error('Not implemented');
    }

    public async exposedPreprocessData(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        return this.preprocessData(data);
    }

    public async exposedProcessImages(data: Record<string, unknown>): Promise<Record<string, unknown>> {
        return this.processImages(data);
    }

    public exposedIsImagePayload(value: unknown): boolean {
        return this.isImagePayload(value);
    }
}

describe('DocumentRendererBase', () => {
    // #region Fields

    let renderer: TestDocumentRenderer;
    let mockImageProcessor: IImageProcessor;
    let mockResourceManager: ResourceManager;
    let mockOptions: RequiredDeep<IDocumentModuleOptions>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockImageProcessor = {
            process: vi.fn().mockImplementation(async (payload: IImagePayload) => ({
                ...payload,
                data: Buffer.from('processed'),
            })),
            toPng: vi.fn(),
            toJpeg: vi.fn(),
        } as unknown as IImageProcessor;

        mockResourceManager = {} as ResourceManager;
        mockOptions = {
            maxImageWidth: 1024,
            maxImageHeight: 768,
            delimiters: { start: '[[', end: ']]' },
            debug: false,
        } as RequiredDeep<IDocumentModuleOptions>;

        renderer = new TestDocumentRenderer(mockOptions, mockResourceManager, mockImageProcessor);
    });

    // #endregion

    // #region Properties

    describe('isImagePayload', () => {
        it('should return true for object with data and width', () => {
            // arrange
            const value = { data: Buffer.from('img'), width: 100 };

            // act
            const result = renderer.exposedIsImagePayload(value);

            // assert
            expect(result).toBe(true);
        });

        it('should return true for object with data and height', () => {
            // arrange
            const value = { data: Buffer.from('img'), height: 200 };

            // act
            const result = renderer.exposedIsImagePayload(value);

            // assert
            expect(result).toBe(true);
        });

        it('should return false for object with data but no dimensions', () => {
            // arrange
            const value = { data: Buffer.from('img') };

            // act
            const result = renderer.exposedIsImagePayload(value);

            // assert
            expect(result).toBe(false);
        });

        it('should return false for null', () => {
            // act
            const result = renderer.exposedIsImagePayload(null);

            // assert
            expect(result).toBe(false);
        });

        it('should return false for primitive values', () => {
            // act & assert
            expect(renderer.exposedIsImagePayload('string')).toBe(false);
            expect(renderer.exposedIsImagePayload(42)).toBe(false);
            expect(renderer.exposedIsImagePayload(undefined)).toBe(false);
        });
    });

    // #endregion

    // #region Methods

    describe('processImages', () => {
        it('should process top-level image payloads', async () => {
            // arrange
            const data = {
                logo: { data: Buffer.from('logo'), width: 100 } as IImagePayload,
                title: 'Test Document',
            };

            // act
            const result = await renderer.exposedProcessImages(data);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledOnce();
            expect(result['title']).toBe('Test Document');
            expect(result['logo']).toEqual(expect.objectContaining({ data: Buffer.from('processed') }));
        });

        it('should process image payloads in arrays', async () => {
            // arrange
            const data = {
                images: [{ data: Buffer.from('img1'), width: 50 } as IImagePayload, 'not-an-image'],
            };

            // act
            const result = await renderer.exposedProcessImages(data);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledOnce();
            const images = result['images'] as unknown[];
            expect(images[0]).toEqual(expect.objectContaining({ data: Buffer.from('processed') }));
            expect(images[1]).toBe('not-an-image');
        });

        it('should recursively process nested objects', async () => {
            // arrange
            const data = {
                section: {
                    header: { data: Buffer.from('hdr'), height: 80 } as IImagePayload,
                    text: 'Hello',
                },
            };

            // act
            const result = await renderer.exposedProcessImages(data);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledOnce();
            const section = result['section'] as Record<string, unknown>;
            expect(section['text']).toBe('Hello');
            expect(section['header']).toEqual(expect.objectContaining({ data: Buffer.from('processed') }));
        });

        it('should pass through primitives unchanged', async () => {
            // arrange
            const data = { count: 42, flag: true, label: 'test' };

            // act
            const result = await renderer.exposedProcessImages(data);

            // assert
            expect(mockImageProcessor.process).not.toHaveBeenCalled();
            expect(result).toEqual(data);
        });
    });

    describe('preprocessData', () => {
        it('should delegate to processImages', async () => {
            // arrange
            const data = { name: 'test' };

            // act
            const result = await renderer.exposedPreprocessData(data);

            // assert
            expect(result).toEqual({ name: 'test' });
        });
    });

    // #endregion
});
