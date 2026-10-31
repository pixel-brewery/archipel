import { ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { DynamicModule, Module, type Provider, type Type } from '@nestjs/common';
import type { RequiredDeep } from 'type-fest';
import { DocumentEngine } from './engine/DocumentEngine.js';
import type { IImageProcessor } from './processor/interfaces/IImageProcessor.js';
import type { IDocumentRenderer } from './renderer/interfaces/IDocumentRenderer.js';
import { DOCUMENT_MODULE_OPTIONS, DOCUMENT_RENDERER_TOKEN, IMAGE_PROCESSOR_TOKEN } from './tokens/DocumentTokens.js';

/**
 * Configuration options for the DocumentModule.
 *
 * @public
 */
export interface IDocumentModuleOptions {
    /**
     * Maximum image width in pixels.
     */
    readonly maxImageWidth?: number;

    /**
     * Maximum image height in pixels.
     */
    readonly maxImageHeight?: number;

    /**
     * Delimiters for template placeholders.
     */
    readonly delimiters?: {
        /**
         * Starting delimiter.
         * @default '[['
         */
        readonly start?: string;
        /**
         * Ending delimiter.
         * @default ']]'
         */
        readonly end?: string;
    };

    /**
     * Enable debug logging for document processing pipeline.
     * When enabled, detailed logs will be written for:
     * - Parser strategy selection
     * - Template variable replacements
     * - Data object transformations
     * - Renderer processing steps
     */
    readonly debug?: boolean;

    /**
     * Image processor implementation class.
     * Import from `@pixel-brewery/archipel-platform-documents/sharp` for the default Sharp-based processor.
     */
    readonly imageProcessor: Type<IImageProcessor>;

    /**
     * Document renderer implementation classes.
     * Import from `@pixel-brewery/archipel-platform-documents/docx` and `/pdf` for the built-in renderers.
     */
    readonly renderers: Type<IDocumentRenderer>[];
}

/**
 * DocumentModule provides services for document generation and image processing.
 * Uses abstract base classes and interfaces for extensibility.
 *
 * @public
 */
@Module({
    imports: [ResourceModule],
})
export class DocumentModule {
    // #region Methods

    /**
     * Configures the module with the specified options.
     *
     * @public
     * @param options The module configuration options.
     * @returns Dynamic module definition
     */
    public static forRoot(options: IDocumentModuleOptions): DynamicModule {
        const requiredOptions = {
            ...{
                maxImageHeight: 1080,
                maxImageWidth: 1920,
                delimiters: {
                    start: '[[',
                    end: ']]',
                },
                debug: false,
            },
            ...options,
        } as RequiredDeep<IDocumentModuleOptions>;

        const renderers = options.renderers ?? [];
        const rendererProviders = renderers.map((renderer) => renderer);

        const providers: Provider[] = [
            {
                provide: DOCUMENT_MODULE_OPTIONS,
                useValue: requiredOptions,
            },
            ...rendererProviders,
            {
                provide: DOCUMENT_RENDERER_TOKEN,
                useFactory: (...resolvedRenderers: IDocumentRenderer[]) => resolvedRenderers,
                inject: renderers,
            },
            DocumentEngine,
        ];

        if (options.imageProcessor) {
            providers.push({
                provide: IMAGE_PROCESSOR_TOKEN,
                useClass: options.imageProcessor,
            });
        }

        return {
            module: DocumentModule,
            global: true,
            providers,
            exports: [DocumentEngine, IMAGE_PROCESSOR_TOKEN],
        };
    }

    // #endregion
}
