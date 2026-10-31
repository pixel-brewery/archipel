---
title: '@pixel-brewery/archipel-platform-documents'
generated: true
editUrl: false
---

# @pixel-brewery/archipel-platform-documents

## Classes

| Class                                                    | Description                                                                                                                                                                          |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [DocumentEngine](Class.DocumentEngine)                   | DocumentEngine orchestrates document generation workflow. Coordinates resource loading and renderer components.                                                                      |
| [DocumentErrorBase](Class.DocumentErrorBase)             | Base class for document-related domain errors.                                                                                                                                       |
| [DocumentModule](Class.DocumentModule)                   | DocumentModule provides services for document generation and image processing. Uses abstract base classes and interfaces for extensibility.                                          |
| [DocumentRendererBase](Class.DocumentRendererBase)       | Base class for document renderers. Provides common functionality for template loading, parsing, and image processing.                                                                |
| [DocumentRenderError](Class.DocumentRenderError)         | Thrown when document rendering fails.                                                                                                                                                |
| [DocumentValidationError](Class.DocumentValidationError) | Thrown when document input validation fails.                                                                                                                                         |
| [DocxDocumentRenderer2](Class.DocxDocumentRenderer2)     | DOCX document renderer. Delegates template processing to the configured parser (Encodian, Mustache, etc.). The parser handles all template syntax logic via its processXml() method. |
| [ImageProcessingError](Class.ImageProcessingError)       | Thrown when image processing fails.                                                                                                                                                  |
| [PdfDocumentRenderer](Class.PdfDocumentRenderer)         | PDF document renderer using pdf-lib. Supports placeholder overlay and table rendering.                                                                                               |
| [SharpImageProcessor](Class.SharpImageProcessor)         | Sharp-based image processor. Handles image resizing and format conversion.                                                                                                           |

## Interfaces

| Interface                                                          | Description                                                                             |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [IDocumentModuleOptions](Interface.IDocumentModuleOptions)         | Configuration options for the DocumentModule.                                           |
| [IDocumentPlaceholderDetail](Interface.IDocumentPlaceholderDetail) | Placeholder detail for document probe report.                                           |
| [IDocumentProbeReport](Interface.IDocumentProbeReport)             | Document probe report.                                                                  |
| [IDocumentRenderer](Interface.IDocumentRenderer)                   | Base interface for document renderers. Each renderer handles specific document formats. |
| [IImagePayload](Interface.IImagePayload)                           | Image payload for templates.                                                            |
| [IImageProcessor](Interface.IImageProcessor)                       | Base interface for image processors. Handles image manipulation and format conversion.  |
| [IRenderOptions](Interface.IRenderOptions)                         | Options for rendering a document.                                                       |
| [IRenderResult](Interface.IRenderResult)                           | Document render result.                                                                 |

## Type Aliases

| Type Alias                                 | Description                           |
| ------------------------------------------ | ------------------------------------- |
| [DocumentFormat](TypeAlias.DocumentFormat) | Document output format types.         |
| [EngineType](TypeAlias.EngineType)         | Template engine type.                 |
| [ImageMimeType](TypeAlias.ImageMimeType)   | Image MIME type.                      |
| [TemplateFormat](TypeAlias.TemplateFormat) | Template format type (parser syntax). |
| [TemplateType](TypeAlias.TemplateType)     | Template type.                        |

## Variables

| Variable                                                      | Description                                             |
| ------------------------------------------------------------- | ------------------------------------------------------- |
| [DOCUMENT\_MODULE\_OPTIONS](Variable.DOCUMENT_MODULE_OPTIONS) | Injection token for DocumentModule options.             |
| [DOCUMENT\_PARSER\_TOKEN](Variable.DOCUMENT_PARSER_TOKEN)     | Injection token for IDocumentParser.                    |
| [DOCUMENT\_RENDERER\_TOKEN](Variable.DOCUMENT_RENDERER_TOKEN) | Injection token for IDocumentRenderer (multi-provider). |
| [IMAGE\_PROCESSOR\_TOKEN](Variable.IMAGE_PROCESSOR_TOKEN)     | Injection token for IImageProcessor.                    |
