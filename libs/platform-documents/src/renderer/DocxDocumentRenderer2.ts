import { Injectable, Logger } from '@nestjs/common';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { DocumentValidationError } from '../errors/DocumentValidationError.js';
import { IRenderOptions } from '../interfaces/IRenderOptions.js';
import { DocumentFormat, IRenderResult } from '../types/DocumentTypes.js';
import { DocumentRendererBase } from './abstracts/DocumentRendererBase.js';

/**
 * DOCX document renderer.
 * Delegates template processing to the configured parser (Encodian, Mustache, etc.).
 * The parser handles all template syntax logic via its processXml() method.
 *
 * @public
 */
@Injectable()
export class DocxDocumentRenderer2 extends DocumentRendererBase {
    private readonly _logger: Logger = new Logger(DocxDocumentRenderer2.name);

    // #region Methods

    /**
     * Supported document formats.
     */
    public get supportedFormats(): ReadonlyArray<DocumentFormat> {
        return ['docx'];
    }

    /**
     * Render DOCX document from template.
     * Template processing is delegated to the parser (no template logic in renderer).
     *
     * @public
     * @param options - Render options
     * @returns Render result
     */
    public async render(options: IRenderOptions): Promise<IRenderResult> {
        // Get template buffer from either uploaded buffer or ResourceManager
        let templateBuffer: Buffer;
        const source = options.templateId ? `id=${options.templateId}` : 'buffer';

        if (options.template) {
            // Handle string input (raw XML) - create minimal DOCX structure
            if (typeof options.template === 'string') {
                this._logger.debug(`source=string-xml length=${options.template.length}`);
                templateBuffer = this.createDocxFromXml(options.template);
            } else {
                templateBuffer = options.template;
                this._logger.debug(`source=${source} bytes=${templateBuffer.length}`);
            }
        } else if (options.templateId) {
            const resource = await this._resourceManager.loadAsync(options.templateId);
            templateBuffer = resource.content;
            this._logger.debug(`source=${source} bytes=${templateBuffer.length}`);
        } else {
            throw new DocumentValidationError('Either templateId or templateBuffer must be provided');
        }

        const processedData = await this.preprocessData(options.data);
        this._logger.debug(`dataKeys=${Object.keys(processedData).join(',')}`);

        // Tracking state for probe report
        const placeholderTracking = new Map<
            string,
            {
                original: string;
                path: string;
                replacementValue?: string;
                status: 'replaced' | 'notFound' | 'error';
                reason?: string;
            }
        >();

        const zip = new PizZip(templateBuffer);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
            warnFn: (errors) => {
                errors.forEach((error) => {
                    this._logger.warn(`template warning: ${error}`);
                });
            },
            nullGetter: (part, _scopeManager) => {
                this._logger.warn(`null value for part raw=${part.raw} type=${part.type}, value=${part.value}`);

                // Track not_found placeholders
                const path = part.value || part.raw;
                if (!placeholderTracking.has(path)) {
                    placeholderTracking.set(path, {
                        original: part.raw,
                        path,
                        status: 'notFound',
                        reason: 'Path not found in data payload',
                    });
                }

                if (!part.module) {
                    return 'undefined';
                }

                if (part.module === 'rawxml') {
                    return '';
                }

                return '';
            },
            parser: (...args) => ({
                get: (scope: Record<string, unknown>, _context) => {
                    const path = args[0].trim();

                    // Block prototype pollution paths
                    if (['__proto__', 'constructor', 'prototype'].includes(path)) {
                        this._logger.warn(`Blocked template access to forbidden path='${path}'`);

                        return undefined;
                    }

                    this._logger.debug(`Processing '${path}' tag`);

                    const value = scope[path as keyof typeof scope];
                    const hasValue = Object.prototype.hasOwnProperty.call(scope, path);

                    // Track placeholder access
                    if (!placeholderTracking.has(path)) {
                        if (hasValue) {
                            placeholderTracking.set(path, {
                                original: `${this._options.delimiters?.start}${path}${this._options.delimiters?.end}`,
                                path: path,
                                replacementValue: String(value),
                                status: 'replaced',
                            });
                        } else {
                            placeholderTracking.set(path, {
                                original: `${this._options.delimiters?.start}${path}${this._options.delimiters?.end}`,
                                path: path,
                                status: 'notFound',
                                reason: 'Key not found in data object',
                            });
                        }
                    }

                    return value;
                },
            }),
            delimiters: {
                start: this._options.delimiters?.start,
                end: this._options.delimiters?.end,
            },
        });

        try {
            const buffer = doc.render(processedData).toBuffer({
                compression: 'DEFLATE',
            });

            // Build probe report from tracking data
            const placeholders = Array.from(placeholderTracking.values());
            const replacedCount = placeholders.filter((p) => p.status === 'replaced').length;
            const unresolvedCount = placeholders.filter((p) => p.status === 'notFound' || p.status === 'error').length;

            this._logger.debug(`generated bytes=${buffer.length} placeholders=${placeholders.length} replaced=${replacedCount} unresolved=${unresolvedCount}`);

            return {
                buffer: buffer,
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: placeholders.length,
                    replacedPlaceholders: replacedCount,
                    unresolvedPlaceholders: unresolvedCount,
                    success: true,
                    dataKeys: Object.keys(processedData),
                    placeholders: placeholders,
                },
            };
        } catch (error) {
            // Track error case
            this._logger.error('Docxtemplater rendering failed', error);

            return {
                buffer: Buffer.alloc(0),
                format: 'docx',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                report: {
                    format: 'docx',
                    totalPlaceholders: Array.from(placeholderTracking.values()).length,
                    replacedPlaceholders: 0,
                    unresolvedPlaceholders: Array.from(placeholderTracking.values()).length,
                    success: false,
                    errorMessage: error instanceof Error ? error.message : String(error),
                    dataKeys: Object.keys(processedData),
                    placeholders: Array.from(placeholderTracking.values()),
                },
            };
        }
    }

    /**
     * Creates a minimal DOCX ZIP structure from raw XML content.
     *
     * @private
     * @param xml - Raw XML document content
     * @returns Buffer containing valid DOCX ZIP
     */
    private createDocxFromXml(xml: string): Buffer {
        const zip = new PizZip();

        // Add minimal DOCX structure
        // [Content_Types].xml
        zip.file(
            '[Content_Types].xml',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
                '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
                '<Default Extension="xml" ContentType="application/xml"/>' +
                '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
                '</Types>',
        );

        // _rels/.rels
        zip.file(
            '_rels/.rels',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
                '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
                '</Relationships>',
        );

        // word/_rels/document.xml.rels (minimal, empty)
        zip.file(
            'word/_rels/document.xml.rels',
            '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>',
        );

        // word/document.xml (the actual content)
        zip.file('word/document.xml', xml);

        return zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
    }

    // #endregion
}
