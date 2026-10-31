#!/usr/bin/env node
import type { GeneratorOptions } from '@prisma/generator';
import { generatorHandler } from '@prisma/generator-helper';
import { PrismaEntityGenerator } from './PrismaEntityGenerator.js';
import { resolveGeneratorConfig } from './config/resolveGeneratorConfig.js';

/**
 * CLI entry point for the Prisma entity generator.
 * This file is executed by Prisma when the generator is invoked via the `provider` field in `schema.prisma`.
 */
generatorHandler({
    onManifest: () => ({
        defaultOutput: './node_modules/@generated/entities',
        prettyName: 'Prisma Generator Entities',
    }),
    onGenerate: async (options: GeneratorOptions) => {
        const config = resolveGeneratorConfig(options.generator.config);
        const generator = new PrismaEntityGenerator(options, config);
        await generator.generate();
    },
});
