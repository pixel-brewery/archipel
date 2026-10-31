#!/usr/bin/env node
import type { GeneratorOptions } from '@prisma/generator';
import { generatorHandler } from '@prisma/generator-helper';
import { PrismaJsonSchemaGenerator } from './PrismaJsonSchemaGenerator.js';
import { resolveGeneratorConfig } from './config/resolveGeneratorConfig.js';

/**
 * CLI entry point for the Prisma JSON Schema generator.
 * This file is executed by Prisma when the generator is invoked via the `provider` field in `schema.prisma`.
 */
generatorHandler({
    onManifest: () => ({
        defaultOutput: './node_modules/@generated/json-schema',
        prettyName: 'Prisma Generator JSON Schema',
    }),
    onGenerate: async (options: GeneratorOptions) => {
        const config = resolveGeneratorConfig(options.generator.config);
        const generator = new PrismaJsonSchemaGenerator(options, config);
        await generator.generate();
    },
});
