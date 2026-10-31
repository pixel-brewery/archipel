/**
 * Public API surface for the Prisma entity generator library.
 *
 * For CLI / Prisma provider usage, see {@link ./bin.ts}.
 */
export type { IEntityGeneratorConfig } from './config/IEntityGeneratorConfig.js';
export type { INamingConvention } from './config/INamingConvention.js';
export { resolveGeneratorConfig } from './config/resolveGeneratorConfig.js';
export { PrismaEntityGenerator } from './PrismaEntityGenerator.js';
