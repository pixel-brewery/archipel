/**
 * Public API surface for the Prisma JSON Schema generator library.
 *
 * For CLI / Prisma provider usage, see {@link ./bin.ts}.
 */
export type { IJsonSchemaGeneratorConfig } from './config/IJsonSchemaGeneratorConfig.js';
export type { INamingConvention } from './config/INamingConvention.js';
export { resolveGeneratorConfig } from './config/resolveGeneratorConfig.js';
export { PrismaJsonSchemaGenerator } from './PrismaJsonSchemaGenerator.js';
