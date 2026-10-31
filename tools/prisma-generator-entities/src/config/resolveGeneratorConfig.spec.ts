import { describe, expect, it } from 'vitest';
import { resolveGeneratorConfig } from './resolveGeneratorConfig.js';

describe('resolveGeneratorConfig', () => {
    it('applies defaults when no configuration is provided', () => {
        // arrange
        const rawConfig: Record<string, unknown> = {};

        // act
        const config = resolveGeneratorConfig(rawConfig);

        // assert
        expect(config).toEqual({
            fileName: 'entities.ts',
            entityFileSuffix: '.entity.ts',
            useReadonlyArray: true,
            generateModels: true,
            generateEnums: true,
            usePrismaEnumsWhenDisabled: true,
            prismaClientImportPath: '@prisma/client',
            namespaceName: '',
            modelNamingConventionPrefix: '',
            modelNamingConventionSuffix: '',
            modelNamingConventionReplaceRegex: undefined,
            modelNamingConventionReplaceValue: undefined,
            enumNamingConventionPrefix: '',
            enumNamingConventionSuffix: '',
            enumNamingConventionReplaceRegex: undefined,
            enumNamingConventionReplaceValue: undefined,
        });
    });

    it('parses custom values and sanitizes file names', () => {
        // arrange
        const rawConfig: Record<string, unknown> = {
            fileName: 'custom-entities',
            useReadonlyArray: 'no',
            entityFileSuffix: 'dto',
            generateModels: 'true',
            generateEnums: 'false',
            usePrismaEnumsWhenDisabled: 'yes',
            namespaceName: 'MyEntities',
            prismaClientImportPath: '@prisma/custom-client',
            modelNamingConventionPrefix: 'I',
            modelNamingConventionSuffix: 'Entity',
            modelNamingConventionReplaceRegex: '^User$',
            modelNamingConventionReplaceValue: 'Account',
            enumNamingConventionPrefix: 'E',
            enumNamingConventionSuffix: 'Enum',
            enumNamingConventionReplaceRegex: '^Role$',
            enumNamingConventionReplaceValue: 'Permission',
        };

        // act
        const config = resolveGeneratorConfig(rawConfig);

        // assert
        expect(config).toEqual({
            fileName: 'custom-entities.ts',
            entityFileSuffix: '.dto.ts',
            useReadonlyArray: false,
            generateModels: true,
            generateEnums: false,
            usePrismaEnumsWhenDisabled: true,
            prismaClientImportPath: '@prisma/custom-client',
            namespaceName: 'MyEntities',
            modelNamingConventionPrefix: 'I',
            modelNamingConventionSuffix: 'Entity',
            modelNamingConventionReplaceRegex: '^User$',
            modelNamingConventionReplaceValue: 'Account',
            enumNamingConventionPrefix: 'E',
            enumNamingConventionSuffix: 'Enum',
            enumNamingConventionReplaceRegex: '^Role$',
            enumNamingConventionReplaceValue: 'Permission',
        });
    });

    it('falls back to defaults for missing naming convention fields', () => {
        // arrange
        const rawConfig: Record<string, unknown> = {
            modelNamingConventionPrefix: 'I',
        };

        // act
        const config = resolveGeneratorConfig(rawConfig);

        // assert
        expect(config.modelNamingConventionPrefix).toBe('I');
        expect(config.modelNamingConventionSuffix).toBe('');
        expect(config.modelNamingConventionReplaceRegex).toBeUndefined();
        expect(config.modelNamingConventionReplaceValue).toBeUndefined();
        expect(config.enumNamingConventionPrefix).toBe('');
        expect(config.enumNamingConventionSuffix).toBe('');
    });
});
