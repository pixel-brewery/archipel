import { ResourceManager } from '@pixel-brewery/archipel-platform-resources';
import PizZip from 'pizzip';
import type { RequiredDeep } from 'type-fest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IDocumentModuleOptions } from '../DocumentModule.js';
import { IImageProcessor } from '../processor/interfaces/IImageProcessor.js';
import { DocxDocumentRenderer2 } from './DocxDocumentRenderer2.js';

describe('DocxDocumentRenderer2', () => {
    // #region Fields

    let renderer: DocxDocumentRenderer2;
    let mockImageProcessor: IImageProcessor;
    let mockResourceManager: ResourceManager;
    let mockOptions: RequiredDeep<IDocumentModuleOptions>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockImageProcessor = {
            process: vi.fn().mockImplementation(async (payload) => payload),
            toPng: vi.fn(),
            toJpeg: vi.fn(),
        } as unknown as IImageProcessor;

        mockResourceManager = {
            loadAsync: vi.fn(),
        } as unknown as ResourceManager;

        mockOptions = {
            maxImageWidth: 1024,
            maxImageHeight: 768,
            delimiters: { start: '[[', end: ']]' },
            debug: false,
        } as RequiredDeep<IDocumentModuleOptions>;

        renderer = new DocxDocumentRenderer2(mockOptions, mockResourceManager, mockImageProcessor);
    });

    // #endregion

    // #region Properties

    describe('supportedFormats', () => {
        it('should return docx format', () => {
            // act
            const formats = renderer.supportedFormats;

            // assert
            expect(formats).toEqual(['docx']);
        });
    });

    // #endregion

    // #region Methods

    describe('render', () => {
        it('should render from a template buffer with placeholders', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Hello [[name]]!');
            const options = { template: templateBuffer, data: { name: 'World' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.format).toBe('docx');
            expect(result.mimeType).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            expect(result.buffer.length).toBeGreaterThan(0);
            expect(result.report).toBeDefined();
            expect(result.report!.success).toBe(true);
        });

        it('should render from a raw XML string', async () => {
            // arrange
            const xml =
                '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
                '<w:body><w:p><w:r><w:t>[[greeting]]</w:t></w:r></w:p></w:body></w:document>';
            const options = { template: xml, data: { greeting: 'Hi' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.format).toBe('docx');
            expect(result.buffer.length).toBeGreaterThan(0);
            expect(result.report!.success).toBe(true);
        });

        it('should render by loading template via templateId', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Document for [[user]]');
            vi.mocked(mockResourceManager.loadAsync).mockResolvedValue({ content: templateBuffer } as never);
            const options = { templateId: 'invoice-template', data: { user: 'Alice' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(mockResourceManager.loadAsync).toHaveBeenCalledWith('invoice-template');
            expect(result.report!.success).toBe(true);
        });

        it('should throw when neither template nor templateId is provided', async () => {
            // arrange
            const options = { data: { key: 'value' } };

            // act & assert
            await expect(renderer.render(options)).rejects.toThrow('Either templateId or templateBuffer must be provided');
        });

        it('should report unresolved placeholders when data is missing', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Hello [[missing]]!');
            const options = { template: templateBuffer, data: {} };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.report!.success).toBe(true);
            expect(result.report!.unresolvedPlaceholders).toBeGreaterThan(0);
        });

        it('should throw when template buffer is not a valid zip', async () => {
            // arrange
            const templateBuffer = Buffer.from('not a valid docx');
            const options = { template: templateBuffer, data: {} };

            // act & assert
            await expect(renderer.render(options)).rejects.toThrow();
        });

        it('should block __proto__ path in template to prevent prototype pollution', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Hello [[__proto__]]!');
            const options = { template: templateBuffer, data: { __proto__: 'malicious' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.report).toBeDefined();
            expect(result.report!.success).toBe(true);
            // __proto__ should be treated as unresolved, not replaced
            expect(result.report!.unresolvedPlaceholders).toBeGreaterThan(0);
        });

        it('should block constructor path in template to prevent prototype pollution', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Hello [[constructor]]!');
            const options = { template: templateBuffer, data: { constructor: 'malicious' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.report).toBeDefined();
            expect(result.report!.success).toBe(true);
            expect(result.report!.unresolvedPlaceholders).toBeGreaterThan(0);
        });

        it('should block prototype path in template to prevent prototype pollution', async () => {
            // arrange
            const templateBuffer = createDocxTemplate('Hello [[prototype]]!');
            const options = { template: templateBuffer, data: { prototype: 'malicious' } };

            // act
            const result = await renderer.render(options);

            // assert
            expect(result.report).toBeDefined();
            expect(result.report!.success).toBe(true);
            expect(result.report!.unresolvedPlaceholders).toBeGreaterThan(0);
        });
    });

    // #endregion
});

/**
 * Creates a minimal DOCX template buffer for testing.
 */
function createDocxTemplate(content: string): Buffer {
    const zip = new PizZip();

    zip.file(
        '[Content_Types].xml',
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
            '<Default Extension="xml" ContentType="application/xml"/>' +
            '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
            '</Types>',
    );

    zip.file(
        '_rels/.rels',
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
            '</Relationships>',
    );

    zip.file(
        'word/_rels/document.xml.rels',
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>',
    );

    zip.file(
        'word/document.xml',
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
            '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
            `<w:body><w:p><w:r><w:t>${content}</w:t></w:r></w:p></w:body></w:document>`,
    );

    return zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
}
