import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { DocumentModule } from './DocumentModule.js';
import { DocumentEngine } from './engine/DocumentEngine.js';
import { SharpImageProcessor } from './processor/SharpImageProcessor.js';
import { DocxDocumentRenderer2 } from './renderer/DocxDocumentRenderer2.js';
import { PdfDocumentRenderer } from './renderer/PdfDocumentRenderer.js';

describe('DocumentModule (DI Integration)', () => {
    // #region Methods

    it('should resolve DocumentEngine when forRoot is called', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                ResourceModule.forRoot({ strategies: [] }),
                DocumentModule.forRoot({
                    imageProcessor: SharpImageProcessor,
                    renderers: [DocxDocumentRenderer2, PdfDocumentRenderer],
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({ get: () => undefined, tryGet: () => undefined, has: () => false })
            .compile();

        // act
        const engine = moduleRef.get(DocumentEngine);

        // assert
        expect(engine).toBeInstanceOf(DocumentEngine);
    });

    // #endregion
});
