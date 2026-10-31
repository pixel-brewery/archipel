import { ResourceManager, ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocumentModule } from './DocumentModule.js';
import { DocumentEngine } from './engine/DocumentEngine.js';
import { SharpImageProcessor } from './processor/SharpImageProcessor.js';
import { DocxDocumentRenderer2 } from './renderer/DocxDocumentRenderer2.js';
import { PdfDocumentRenderer } from './renderer/PdfDocumentRenderer.js';
import { DOCUMENT_MODULE_OPTIONS, DOCUMENT_RENDERER_TOKEN, IMAGE_PROCESSOR_TOKEN } from './tokens/DocumentTokens.js';

const mockResourceManager = {
    load: vi.fn(),
    loadAsync: vi.fn(),
    loadAsStringAsync: vi.fn().mockResolvedValue(''),
    exists: vi.fn().mockReturnValue(false),
    existsAsync: vi.fn().mockResolvedValue(false),
    whatDoIHave: vi.fn(),
};

describe('DocumentModule', () => {
    // #region Fields

    let module: TestingModule;

    // #endregion

    // #region Module Registration Tests

    describe('register', () => {
        beforeEach(async () => {
            module = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        maxImageWidth: 1024,
                        maxImageHeight: 768,
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();
        });

        it('should register module with options', () => {
            // act
            const options = module.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(options).toBeDefined();
            expect(options.maxImageWidth).toBe(1024);
            expect(options.maxImageHeight).toBe(768);
        });

        it('should provide DocumentEngine', () => {
            // act
            const engine = module.get(DocumentEngine);

            // assert
            expect(engine).toBeDefined();
            expect(engine).toBeInstanceOf(DocumentEngine);
        });

        it('should provide IMAGE_PROCESSOR_TOKEN', () => {
            // act
            const processor = module.get(IMAGE_PROCESSOR_TOKEN);

            // assert
            expect(processor).toBeDefined();
            expect(processor).toBeInstanceOf(SharpImageProcessor);
        });

        it('should provide DOCUMENT_RENDERER_TOKEN as array', () => {
            // act
            const renderers = module.get(DOCUMENT_RENDERER_TOKEN);

            // assert
            expect(renderers).toBeDefined();
            expect(Array.isArray(renderers)).toBe(true);
            expect(renderers.length).toBe(2);
        });

        it('should provide DocxRenderer2', () => {
            // act
            const renderer = module.get(DocxDocumentRenderer2);

            // assert
            expect(renderer).toBeDefined();
            expect(renderer).toBeInstanceOf(DocxDocumentRenderer2);
        });

        it('should provide PdfRenderer', () => {
            // act
            const renderer = module.get(PdfDocumentRenderer);

            // assert
            expect(renderer).toBeDefined();
            expect(renderer).toBeInstanceOf(PdfDocumentRenderer);
        });

        it('should export DocumentEngine', () => {
            // act
            const engine = module.get(DocumentEngine);

            // assert
            expect(engine).toBeDefined();
        });

        it('should export IMAGE_PROCESSOR_TOKEN', () => {
            // act
            const processor = module.get(IMAGE_PROCESSOR_TOKEN);

            // assert
            expect(processor).toBeDefined();
        });
    });

    // #endregion

    // #region Module Configuration Tests

    describe('module configuration', () => {
        it('should accept custom maxImageWidth', async () => {
            // arrange
            const testModule = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        maxImageWidth: 2048,
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();

            // act
            const options = testModule.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(options.maxImageWidth).toBe(2048);
        });

        it('should accept custom maxImageHeight', async () => {
            // arrange
            const testModule = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        maxImageHeight: 1536,
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();

            // act
            const options = testModule.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(options.maxImageHeight).toBe(1536);
        });

        it('should handle empty options', async () => {
            // arrange
            const testModule = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();

            // act
            const options = testModule.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(options).toBeDefined();
        });
    });

    // #endregion

    // #region Integration Tests

    describe('integration', () => {
        beforeEach(async () => {
            module = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        maxImageWidth: 800,
                        maxImageHeight: 600,
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();
        });

        it('should wire DocumentEngine with renderers', () => {
            // act
            const engine = module.get(DocumentEngine);

            // assert
            expect(engine.renderers.size).toBeGreaterThan(0);
        });

        it('should provide both DOCX and PDF renderers', () => {
            // act
            const engine = module.get(DocumentEngine);

            // assert
            expect(engine.renderers.has('docx')).toBe(true);
            expect(engine.renderers.has('pdf')).toBe(true);
        });

        it('should provide SharpImageProcessor via token', () => {
            // act
            const processor = module.get(IMAGE_PROCESSOR_TOKEN);

            // assert
            expect(processor).toBeInstanceOf(SharpImageProcessor);
        });
    });

    // #endregion

    // #region Dependency Tests

    describe('dependencies', () => {
        beforeEach(async () => {
            module = await Test.createTestingModule({
                imports: [
                    ResourceModule.forRoot({ strategies: [] }),
                    DocumentModule.forRoot({
                        maxImageWidth: 800,
                        maxImageHeight: 600,
                        imageProcessor: SharpImageProcessor,
                        renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                    }),
                ],
            })
                .overrideProvider(ResourceManager)
                .useValue(mockResourceManager)
                .compile();
        });

        it('should inject options into SharpImageProcessor', () => {
            // act
            const processor = module.get(IMAGE_PROCESSOR_TOKEN) as SharpImageProcessor;
            const options = module.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(processor).toBeDefined();
            expect(options).toBeDefined();
        });

        it('should inject options into DocumentEngine', () => {
            // act
            const engine = module.get(DocumentEngine);
            const options = module.get(DOCUMENT_MODULE_OPTIONS);

            // assert
            expect(engine).toBeDefined();
            expect(options).toBeDefined();
        });

        it('should provide renderers array to DocumentEngine', () => {
            // act
            const renderers = module.get(DOCUMENT_RENDERER_TOKEN);

            // assert
            expect(Array.isArray(renderers)).toBe(true);
            expect(renderers[0]).toBeInstanceOf(DocxDocumentRenderer2);
            expect(renderers[1]).toBeInstanceOf(PdfDocumentRenderer);
        });
    });

    // #endregion
});
