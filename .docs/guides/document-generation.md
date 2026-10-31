---
title: Document Generation
description: Generate PDF and DOCX documents from templates with variable substitution and image processing.
order: 11
---

# Document Generation

This guide covers generating documents with `platform-documents`: template setup, variable substitution, image processing, and rendering to PDF or DOCX.

---

## Installation

```bash
yarn add @pixel-brewery/archipel-platform-documents
```

---

## Module Registration

```typescript
import { Module } from '@nestjs/common';
import { DocumentModule } from '@pixel-brewery/archipel-platform-documents';
import { SharpImageProcessor } from '@pixel-brewery/archipel-platform-documents/sharp';
import { DocxDocumentRenderer2 } from '@pixel-brewery/archipel-platform-documents/docx';
import { PdfDocumentRenderer } from '@pixel-brewery/archipel-platform-documents/pdf';

@Module({
    imports: [
        DocumentModule.forRoot({
            imageProcessor: SharpImageProcessor,
            renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
            maxImageWidth: 1920,
            maxImageHeight: 1080,
            delimiters: { start: '[[', end: ']]' },
        }),
    ],
})
export class AppModule {}
```

### Options

| Option           | Default | Description                                                                          |
| ---------------- | ------- | ------------------------------------------------------------------------------------ |
| `imageProcessor` | —       | **Required.** Image processor class (e.g. `SharpImageProcessor`)                     |
| `renderers`      | —       | **Required.** Renderer classes (e.g. `[DocxDocumentRenderer2, PdfDocumentRenderer]`) |
| `maxImageWidth`  | `1920`  | Maximum width for embedded images (in pixels)                                        |
| `maxImageHeight` | `1080`  | Maximum height for embedded images (in pixels)                                       |
| `delimiters`     | `[[ ]]` | Start and end delimiters for template variables                                      |
| `debug`          | `false` | Enable verbose logging for the rendering pipeline                                    |

---

## Creating Templates

Templates are document files (DOCX) with placeholder variables. By default, placeholders use double brackets:

```
Dear [[customerName]],

Your order [[orderId]] has been confirmed.
Total: [[orderTotal]]

Thank you for your business.
```

You can change the delimiter format:

```typescript
DocumentModule.forRoot({
    imageProcessor: SharpImageProcessor,
    renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
    delimiters: { start: '{{', end: '}}' },
});
```

---

## Rendering Documents

Use `DocumentEngine` to render templates with data:

```typescript
import { Injectable } from '@nestjs/common';
import { DocumentEngine } from '@pixel-brewery/archipel-platform-documents';

@Injectable()
export class InvoiceService {
    private readonly _documentEngine: DocumentEngine;

    constructor(documentEngine: DocumentEngine) {
        this._documentEngine = documentEngine;
    }

    public async generateInvoice(orderId: string, data: Record<string, unknown>): Promise<Buffer> {
        return this._documentEngine.render({
            template: 'invoice-template.docx',
            data: {
                customerName: data['customerName'],
                orderId,
                orderTotal: data['total'],
                date: new Date().toLocaleDateString(),
            },
            format: 'pdf', // or 'docx'
        });
    }
}
```

### Supported Output Formats

| Format | Renderer      | Description                           |
| ------ | ------------- | ------------------------------------- |
| `pdf`  | PDF Renderer  | Convert template to PDF               |
| `docx` | DOCX Renderer | Keep as DOCX with filled placeholders |

---

## Image Processing

The `SharpImageProcessor` automatically optimizes embedded images:

- Resizes images that exceed `maxImageWidth` or `maxImageHeight`
- Preserves aspect ratio
- Compresses images for smaller file sizes

This is useful for templates that include dynamic images (logos, product photos, signatures).

---

## Serving Documents via HTTP

```typescript
import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';

@Controller('invoices')
export class InvoiceController {
    private readonly _invoiceService: InvoiceService;

    constructor(invoiceService: InvoiceService) {
        this._invoiceService = invoiceService;
    }

    @Get(':orderId/pdf')
    public async downloadInvoice(@Param('orderId') orderId: string, @Res() res: Response): Promise<void> {
        const pdf = await this._invoiceService.generateInvoice(orderId, {/* ... */});

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="invoice-${orderId}.pdf"`,
        });

        res.send(pdf);
    }
}
```

---

## Debug Mode

Enable debug logging to trace the rendering pipeline:

```typescript
DocumentModule.forRoot({
    imageProcessor: SharpImageProcessor,
    renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
    debug: true,
});
```

This logs each step of the rendering process: template loading, placeholder parsing, variable substitution, image processing, and final output generation.

---

## Error Handling

The document library throws typed domain errors for different failure scenarios:

| Error class               | When thrown                             |
| ------------------------- | --------------------------------------- |
| `DocumentRenderError`     | Template rendering failures (DOCX, PDF) |
| `DocumentValidationError` | Invalid templates, missing placeholders |
| `ImageProcessingError`    | Image resize/conversion failures        |

```typescript
import { DocumentRenderError } from '@pixel-brewery/archipel-platform-documents';

try {
    const result = await this._engine.render(template, data);
} catch (error) {
    if (error instanceof DocumentRenderError) {
        // Handle render failure
    }
}
```

All errors extend `DocumentErrorBase` — catch the base class for a blanket handler.

---

## Next Steps

- See the [Blob Storage](/guides/blob-storage) guide for storing generated documents
- Browse the [platform-documents API reference](/packages/platform-documents/api/) for complete method signatures
