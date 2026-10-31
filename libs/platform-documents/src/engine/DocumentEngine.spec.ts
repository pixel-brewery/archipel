import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IRenderOptions } from '../interfaces/IRenderOptions.js';
import { IDocumentRenderer } from '../renderer/interfaces/IDocumentRenderer.js';
import { IRenderResult } from '../types/DocumentTypes.js';
import { DocumentEngine } from './DocumentEngine.js';

describe('DocumentEngine', () => {
    // #region Fields

    let engine: DocumentEngine;
    let mockResourceManager: ResourceManager;
    let mockDocxRenderer: IDocumentRenderer;
    let mockPdfRenderer: IDocumentRenderer;
    let renderers: Array<IDocumentRenderer>;

    // #endregion

    // #region Setup

    beforeEach(() => {
        mockResourceManager = {
            loadAsync: vi.fn(),
        } as unknown as ResourceManager;

        mockDocxRenderer = {
            supportedFormats: ['docx'],
            render: vi.fn(),
        } as IDocumentRenderer;

        mockPdfRenderer = {
            supportedFormats: ['pdf'],
            render: vi.fn(),
        } as IDocumentRenderer;

        renderers = [mockDocxRenderer, mockPdfRenderer];

        engine = new DocumentEngine(mockResourceManager, renderers, { debug: false } as never);
    });

    // #endregion

    // #region Constructor Tests

    describe('constructor', () => {
        it('should initialize with provided options', () => {
            // assert
            expect(engine).toBeDefined();
            expect(engine.renderers).toBeDefined();
        });

        it('should register all renderers for their supported formats', () => {
            // assert
            expect(engine.renderers.size).toBe(2);
            expect(engine.renderers.get('docx')).toBe(mockDocxRenderer);
            expect(engine.renderers.get('pdf')).toBe(mockPdfRenderer);
        });

        it('should handle renderer supporting multiple formats', () => {
            // arrange
            const multiFormatRenderer: IDocumentRenderer = {
                supportedFormats: ['docx', 'pdf'],
                render: vi.fn(),
            };

            // act
            const engineWithMulti = new DocumentEngine(mockResourceManager, [multiFormatRenderer], { debug: false } as never);

            // assert
            expect(engineWithMulti.renderers.size).toBe(2);
            expect(engineWithMulti.renderers.get('docx')).toBe(multiFormatRenderer);
            expect(engineWithMulti.renderers.get('pdf')).toBe(multiFormatRenderer);
        });
    });

    // #endregion

    // #region Render Tests

    describe('render', () => {
        it('should render document with templateBuffer (Buffer)', async () => {
            // arrange
            const templateBuffer = Buffer.from('test template');
            const options: IRenderOptions = {
                template: templateBuffer,
                data: { name: 'Test' },
            };

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockDocxRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockDocxRenderer.render).toHaveBeenCalledWith(options);
            expect(result.report).toEqual(expectedResult.report);
            expect(result.buffer).toEqual(expectedResult.buffer);
            expect(result.format).toBe('docx');
            expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });

        it('should render document with template (string - raw XML)', async () => {
            // arrange
            const xmlContent =
                '<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>{{name}}</w:t></w:r></w:p></w:body></w:document>';
            const options: IRenderOptions = {
                template: xmlContent,
                data: { name: 'Test User' },
            };

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered docx'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: 1,
                    replacedPlaceholders: 1,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [
                        {
                            original: '{{name}}',
                            path: 'name',
                            status: 'replaced',
                            replacementValue: 'Test User',
                        },
                    ],
                },
            };

            vi.mocked(mockDocxRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockDocxRenderer.render).toHaveBeenCalledWith(options);
            expect(result.report).toEqual(expectedResult.report);
            expect(result.buffer).toEqual(expectedResult.buffer);
            expect(result.format).toBe('docx');
            expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        });

        it('should render document with templateId from ResourceManager', async () => {
            // arrange
            const templateId = 'template-123';
            const templateBuffer = Buffer.from('stored template');
            const options: IRenderOptions = {
                templateId,
                data: { name: 'Test' },
            };

            vi.mocked(mockResourceManager.loadAsync).mockResolvedValue({
                content: templateBuffer,
                metadata: {
                    path: 'templates/invoice.docx',
                    size: 1024,
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                },
            } as never);

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockDocxRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockResourceManager.loadAsync).toHaveBeenCalledWith(templateId);
            expect(mockDocxRenderer.render).toHaveBeenCalledWith(options);
            expect(result.report).toEqual(expectedResult.report);
            expect(result.format).toBe('docx');
        });

        it('should detect PDF format from buffer magic bytes', async () => {
            // arrange
            const pdfBuffer = Buffer.from('%PDF-1.4\n');
            const options: IRenderOptions = {
                template: pdfBuffer,
                data: { name: 'Test' },
            };

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered pdf'),
                format: 'pdf',
                mimeType: 'application/pdf',
                report: {
                    format: 'pdf',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockPdfRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockPdfRenderer.render).toHaveBeenCalledWith(options);
            expect(result.report).toEqual(expectedResult.report);
            expect(result.format).toBe('pdf');
            expect(result.mimeType).toBe('application/pdf');
        });

        it('should detect DOCX format from ZIP magic bytes', async () => {
            // arrange
            const docxBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
            const options: IRenderOptions = {
                template: docxBuffer,
                data: { name: 'Test' },
            };

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockDocxRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockDocxRenderer.render).toHaveBeenCalledWith(options);
            expect(result.format).toBe('docx');
            expect(result.report).toEqual(expectedResult.report);
        });

        it('should default to DOCX for unknown buffer format', async () => {
            // arrange
            const unknownBuffer = Buffer.from('unknown format');
            const options: IRenderOptions = {
                template: unknownBuffer,
                data: { name: 'Test' },
            };

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockDocxRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockDocxRenderer.render).toHaveBeenCalledWith(options);
            expect(result.report).toEqual(expectedResult.report);
        });

        it('should detect format from file extension when using templateId', async () => {
            // arrange
            const templateId = 'template-456';
            const options: IRenderOptions = {
                templateId,
                data: { title: 'Report' },
            };

            vi.mocked(mockResourceManager.loadAsync).mockResolvedValue({
                content: Buffer.from('pdf content'),
                metadata: {
                    path: 'templates/report.pdf',
                    size: 2048,
                    mimeType: 'application/pdf',
                },
            } as never);

            const expectedResult: IRenderResult = {
                buffer: Buffer.from('rendered pdf'),
                format: 'pdf',
                mimeType: 'application/pdf',
                report: {
                    format: 'pdf',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockPdfRenderer.render).mockResolvedValue(expectedResult);

            // act
            const result = await engine.render(options);

            // assert
            expect(mockPdfRenderer.render).toHaveBeenCalledWith(options);
            expect(result.format).toBe('pdf');
            expect(result.report).toEqual(expectedResult.report);
        });

        it('should apply correct MIME type to result', async () => {
            // arrange
            const options: IRenderOptions = {
                template: Buffer.from('%PDF-1.4'),
                data: {},
            };

            const resultWithoutMime: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'pdf',
                mimeType: '',
                report: {
                    format: 'pdf',
                    totalPlaceholders: 0,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: 0,
                    success: true,
                    placeholders: [],
                },
            };

            vi.mocked(mockPdfRenderer.render).mockResolvedValue(resultWithoutMime);

            // act
            const result = await engine.render(options);

            // assert
            expect(result.mimeType).toBe('application/pdf');
            expect(result.report).toEqual(resultWithoutMime.report);
        });

        it('should throw error when neither templateId nor templateBuffer provided', async () => {
            // arrange
            const options: IRenderOptions = {
                data: { name: 'Test' },
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow('Either templateId or templateBuffer must be provided');
        });

        it('should throw error when no renderer available for format', async () => {
            // arrange
            const engineWithoutRenderers = new DocumentEngine(mockResourceManager, [], { debug: false } as never);

            const options: IRenderOptions = {
                template: Buffer.from('test'),
                data: {},
            };

            // act & assert
            await expect(engineWithoutRenderers.render(options)).rejects.toThrow('No renderer available for format: docx');
        });
    });

    // #endregion

    // #region Properties Tests

    describe('renderers property', () => {
        it('should return readonly map of renderers', () => {
            // act
            const renderersMap = engine.renderers;

            // assert
            expect(renderersMap).toBeInstanceOf(Map);
            expect(renderersMap.size).toBe(2);
        });
    });

    // #endregion

    // #region Security Tests

    describe('templateId sanitization', () => {
        it('should reject templateId containing path traversal with forward slash', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: '../etc/passwd',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow("Invalid templateId: '../etc/passwd'");
        });

        it('should reject templateId containing path traversal with backslash', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: '..\\windows\\system32',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow("Invalid templateId: '..\\windows\\system32'");
        });

        it('should reject templateId containing embedded path traversal', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: 'templates/../../../etc/shadow',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow('Invalid templateId');
        });

        it('should reject templateId containing control characters', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: 'template\x00id',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow('Invalid templateId');
        });

        it('should reject templateId containing http URL (SSRF)', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: 'http://evil.com/template.docx',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow('Invalid templateId');
        });

        it('should reject templateId containing https URL (SSRF)', async () => {
            // arrange
            const options: IRenderOptions = {
                templateId: 'https://evil.com/template.docx',
                data: {},
            };

            // act & assert
            await expect(engine.render(options)).rejects.toThrow('Invalid templateId');
        });

        it('should accept valid templateId without traversal characters', async () => {
            // arrange
            const mockResource = {
                content: Buffer.from('test-content'),
                metadata: { path: '/templates/invoice.docx' },
            };
            mockResourceManager.loadAsync = vi.fn().mockResolvedValue(mockResource);

            const mockResult: IRenderResult = {
                buffer: Buffer.from('rendered'),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            };
            vi.mocked(mockDocxRenderer.render).mockResolvedValue(mockResult);

            const options: IRenderOptions = {
                templateId: 'invoices/invoice-2024',
                data: { name: 'Test' },
            };

            // act
            const result = await engine.render(options);

            // assert
            expect(mockResourceManager.loadAsync).toHaveBeenCalledWith('invoices/invoice-2024');
            expect(result).toBeDefined();
            expect(result.format).toBe('docx');
        });
    });

    // #endregion
});
