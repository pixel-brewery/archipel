import type { GeneratorOptions } from '@prisma/generator';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IEntityGeneratorConfig } from './config/IEntityGeneratorConfig.js';
import type { IRenderedSourceFile } from './rendering/IRenderedSourceFile.js';
import { TypeScriptRenderer } from './rendering/TypeScriptRenderer.js';

/**
 * Coordinates the Prisma generator execution lifecycle.
 */
export class PrismaEntityGenerator {
    // #region Fields

    private readonly _options: GeneratorOptions;
    private readonly _config: IEntityGeneratorConfig;
    private readonly _renderer: TypeScriptRenderer;
    private readonly _outputDirectory: string;

    // #endregion

    // #region Ctor

    public constructor(options: GeneratorOptions, config: IEntityGeneratorConfig) {
        if (!options.generator.output?.value) {
            throw new Error('Missing generator output directory configuration.');
        }

        this._options = options;
        this._config = config;
        this._renderer = new TypeScriptRenderer(config);
        this._outputDirectory = options.generator.output.value;
    }

    // #endregion

    // #region Methods

    public async generate(): Promise<void> {
        const datamodel = this._options.dmmf.datamodel;
        const renderedOutput = this._renderer.render(datamodel);

        // Clean generate: Remove existing output directory to prevent stale files
        await this.cleanOutputDirectory();

        await mkdir(this._outputDirectory, { recursive: true });
        const files: ReadonlyArray<IRenderedSourceFile> = [renderedOutput.primaryFile, ...renderedOutput.supportingFiles];

        for (const file of files) {
            const targetPath = join(this._outputDirectory, file.fileName);
            await writeFile(targetPath, file.content, 'utf8');
        }
    }

    private async cleanOutputDirectory(): Promise<void> {
        try {
            await rm(this._outputDirectory, {
                recursive: true,
                force: true,
            });
        } catch (_error) {
            // Ignore errors if directory doesn't exist
            // force: true should handle this, but be defensive
        }
    }

    // #endregion
}
