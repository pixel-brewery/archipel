import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import type { RequiredDeep } from 'type-fest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDocumentModuleOptions } from '../DocumentModule.js';
import { IRenderOptions } from '../interfaces/IRenderOptions.js';
import { IImageProcessor } from '../processor/interfaces/IImageProcessor.js';
import { PdfDocumentRenderer } from './PdfDocumentRenderer.js';

// Mock pdf-lib
vi.mock('pdf-lib', async () => {
    const mockPage = {
        getSize: vi.fn().mockReturnValue({ width: 595.28, height: 841.89 }),
        drawText: vi.fn(),
    };

    const mockFont = {};

    const mockPDFDocument = {
        getPages: vi.fn().mockReturnValue([mockPage]),
        embedFont: vi.fn().mockResolvedValue(mockFont),
        save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
        addPage: vi.fn().mockReturnValue(mockPage),
    };

    return {
        PDFDocument: {
            load: vi.fn().mockResolvedValue(mockPDFDocument),
            create: vi.fn().mockResolvedValue(mockPDFDocument),
        },
        rgb: vi.fn((r: number, g: number, b: number) => ({ r, g, b })),
        PageSizes: {
            A4: [595.28, 841.89] as [number, number],
        },
        StandardFonts: {
            Helvetica: 'Helvetica',
        },
    };
});

describe('PdfRenderer', () => {
    // #region Fields

    let renderer: PdfDocumentRenderer;
    let mockOptions: RequiredDeep<IDocumentModuleOptions>;
    let mockResourceManager: ResourceManager;
    let mockImageProcessor: IImageProcessor;

    // #endregion

    // #region Setup

    beforeEach(() => {
        mockOptions = {
            maxImageWidth: 800,
            maxImageHeight: 600,
            delimiters: {
                start: '[[',
                end: ']]',
            },
            debug: false,
        };

        mockResourceManager = {
            loadAsync: vi.fn(),
        } as unknown as ResourceManager;

        mockImageProcessor = {
            process: vi.fn((payload) => Promise.resolve(payload)),
            toPng: vi.fn(),
            toJpeg: vi.fn(),
        };

        renderer = new PdfDocumentRenderer(mockOptions, mockResourceManager, mockImageProcessor);

        vi.clearAllMocks();
    });

    // #endregion

    // #region Supported Formats Tests

    describe('supportedFormats', () => {
        it('should support pdf format', () => {
            // act
            const formats = renderer.supportedFormats;

            // assert
            expect(formats).toContain('pdf');
            expect(formats.length).toBe(1);
        });
    });

    // #endregion

    // #region Render Tests

    describe('render', () => {
        it('should render document with templateBuffer', async () => {
            // arrange
            const templateBuffer = Buffer.from('PDF template');
            const options: IRenderOptions = {
                template: templateBuffer,
                data: { name: 'John' },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.buffer).toBeInstanceOf(Buffer);
            expect(result.format).toBe('pdf');
            expect(result.mimeType).toBe('application/pdf');
        });

        it('should render document with templateId from ResourceManager', async () => {
            // arrange
            const templateId = 'template-456';
            const templateBuffer = Buffer.from('PDF template');
            const options: IRenderOptions = {
                templateId,
                data: { name: 'Jane' },
            };

            vi.mocked(mockResourceManager.loadAsync).mockResolvedValue({
                content: templateBuffer,
                metadata: {
                    path: 'templates/report.pdf',
                    size: 2048,
                    mimeType: 'application/pdf',
                },
            } as never);

            // act
            const result = await renderer.render(options);

            // assert
            expect(mockResourceManager.loadAsync).toHaveBeenCalledWith(templateId);
            expect(result.format).toBe('pdf');
        });

        it('should throw error when template is a string (raw XML not supported)', async () => {
            // arrange
            const xmlContent = '<?xml version="1.0"?><document>Content</document>';
            const options: IRenderOptions = {
                template: xmlContent,
                data: { name: 'Test' },
            };

            // act & assert
            await expect(renderer.render(options)).rejects.toThrow('PDF renderer does not support raw XML string templates. Use Buffer with PDF content.');
        });

        it('should throw error when neither templateId nor templateBuffer provided', async () => {
            // arrange
            const options: IRenderOptions = {
                data: { name: 'Test' },
            };

            // act & assert
            await expect(renderer.render(options)).rejects.toThrow('Either templateId or templateBuffer must be provided');
        });

        it('should process images in data before rendering', async () => {
            // arrange
            const imagePayload = {
                data: Buffer.from('image'),
                width: 100,
                height: 100,
            };

            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    name: 'Test',
                    logo: imagePayload,
                },
            };

            // act
            await renderer.render(options);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledWith(imagePayload);
        });

        it('should handle nested image payloads', async () => {
            // arrange
            const imagePayload = {
                data: Buffer.from('image'),
                width: 100,
                height: 100,
            };

            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    company: {
                        logo: imagePayload,
                    },
                },
            };

            // act
            await renderer.render(options);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledWith(imagePayload);
        });

        it('should render text placeholders on PDF pages', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    title: 'Report Title',
                    author: 'John Doe',
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
            expect(result.buffer).toBeInstanceOf(Buffer);
        });
    });

    // #endregion

    // #region CreateFromScratch Tests

    describe('createFromScratch', () => {
        it('should create PDF document without template', async () => {
            // arrange
            const data = {
                title: 'New Document',
                content: 'Document content',
            };

            // act
            const result = await renderer.createFromScratch(data);

            // assert
            expect(result.buffer).toBeInstanceOf(Buffer);
            expect(result.format).toBe('pdf');
            expect(result.mimeType).toBe('application/pdf');
        });

        it('should render data on blank page', async () => {
            // arrange
            const data = {
                name: 'John',
                age: 30,
                city: 'Berlin',
            };

            // act
            const result = await renderer.createFromScratch(data);

            // assert
            expect(result).toBeDefined();
        });

        it('should process images before rendering', async () => {
            // arrange
            const imagePayload = {
                data: Buffer.from('image'),
                width: 100,
                height: 100,
            };

            const data = {
                title: 'Document',
                logo: imagePayload,
            };

            // act
            await renderer.createFromScratch(data);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledWith(imagePayload);
        });

        it('should handle empty data', async () => {
            // arrange
            const data = {};

            // act
            const result = await renderer.createFromScratch(data);

            // assert
            expect(result).toBeDefined();
            expect(result.format).toBe('pdf');
        });
    });

    // #endregion

    // #region Edge Cases Tests

    describe('edge cases', () => {
        it('should handle empty data object', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {},
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
            expect(result.format).toBe('pdf');
        });

        it('should handle complex nested data', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    level1: {
                        level2: {
                            level3: {
                                value: 'deep',
                            },
                        },
                    },
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle data with arrays', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    items: [{ name: 'Item1' }, { name: 'Item2' }, { name: 'Item3' }],
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle null values in data', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    nullField: null,
                    validField: 'value',
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle numeric and boolean values', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    count: 42,
                    price: 19.99,
                    isActive: true,
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle special characters in text', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    text: 'Text with <special> & "characters"',
                },
            };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result).toBeDefined();
        });

        it('should handle image arrays', async () => {
            // arrange
            const imagePayload1 = {
                data: Buffer.from('image1'),
                width: 100,
                height: 100,
            };

            const imagePayload2 = {
                data: Buffer.from('image2'),
                width: 200,
                height: 200,
            };

            const options: IRenderOptions = {
                template: Buffer.from('PDF template'),
                data: {
                    images: [imagePayload1, imagePayload2],
                },
            };

            // act
            await renderer.render(options);

            // assert
            expect(mockImageProcessor.process).toHaveBeenCalledTimes(2);
        });
    });

    // #endregion
});
