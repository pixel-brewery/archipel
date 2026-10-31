import type { IEntityGeneratorConfig } from './IEntityGeneratorConfig.js';

const defaultConfig: IEntityGeneratorConfig = {
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
};

const trueLiterals = ['true', '1', 'yes', 'y'];
const falseLiterals = ['false', '0', 'no', 'n'];

const sanitizeFileName = (value: string): string => {
    const trimmedValue = value.trim();
    if (trimmedValue.length === 0) {
        return defaultConfig.fileName;
    }

    return trimmedValue.endsWith('.ts') ? trimmedValue : `${trimmedValue}.ts`;
};

const sanitizeEntitySuffix = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return defaultConfig.entityFileSuffix;
    }

    const withLeadingDot = trimmedValue.startsWith('.') ? trimmedValue : `.${trimmedValue}`;
    return withLeadingDot.endsWith('.ts') ? withLeadingDot : `${withLeadingDot}.ts`;
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
    if (value === undefined) {
        return fallback;
    }

    const normalizedValue = value.trim().toLowerCase();

    if (trueLiterals.includes(normalizedValue)) {
        return true;
    }

    if (falseLiterals.includes(normalizedValue)) {
        return false;
    }

    return fallback;
};

const sanitizeString = (value: string | undefined, fallback: string): string => {
    if (value === undefined) {
        return fallback;
    }

    return value.trim();
};

/**
 * Merges user-specified Prisma generator configuration with the internal defaults.
 *
 * @param config Prisma generator configuration object
 * @returns Normalized generator configuration
 */
export const resolveGeneratorConfig = (config: Record<string, unknown>): IEntityGeneratorConfig => {
    const candidateFileName = config['fileName'] as string | undefined;
    const candidateReadonlyArray = config['useReadonlyArray'] as string | undefined;
    const candidateEntityFileSuffix = config['entityFileSuffix'] as string | undefined;
    const candidateGenerateModels = config['generateModels'] as string | undefined;
    const candidateGenerateEnums = config['generateEnums'] as string | undefined;
    const candidateUsePrismaEnumsWhenDisabled = config['usePrismaEnumsWhenDisabled'] as string | undefined;
    const candidateNamespaceName = config['namespaceName'] as string | undefined;
    const candidatePrismaClientImportPath = config['prismaClientImportPath'] as string | undefined;

    const candidateModelPrefix = config['modelNamingConventionPrefix'] as string | undefined;
    const candidateModelSuffix = config['modelNamingConventionSuffix'] as string | undefined;
    const candidateModelReplaceRegex = config['modelNamingConventionReplaceRegex'] as string | undefined;
    const candidateModelReplaceValue = config['modelNamingConventionReplaceValue'] as string | undefined;

    const candidateEnumPrefix = config['enumNamingConventionPrefix'] as string | undefined;
    const candidateEnumSuffix = config['enumNamingConventionSuffix'] as string | undefined;
    const candidateEnumReplaceRegex = config['enumNamingConventionReplaceRegex'] as string | undefined;
    const candidateEnumReplaceValue = config['enumNamingConventionReplaceValue'] as string | undefined;

    const fileName = sanitizeFileName(candidateFileName ?? defaultConfig.fileName);
    const entityFileSuffix = sanitizeEntitySuffix(candidateEntityFileSuffix ?? defaultConfig.entityFileSuffix);
    const useReadonlyArray = parseBoolean(candidateReadonlyArray, defaultConfig.useReadonlyArray);
    const generateModels = parseBoolean(candidateGenerateModels, defaultConfig.generateModels);
    const generateEnums = parseBoolean(candidateGenerateEnums, defaultConfig.generateEnums);
    const usePrismaEnumsWhenDisabled = parseBoolean(candidateUsePrismaEnumsWhenDisabled, defaultConfig.usePrismaEnumsWhenDisabled);
    const namespaceName = sanitizeString(candidateNamespaceName, defaultConfig.namespaceName);
    const prismaClientImportPath = sanitizeString(candidatePrismaClientImportPath, defaultConfig.prismaClientImportPath);

    const modelNamingConventionPrefix = sanitizeString(candidateModelPrefix, defaultConfig.modelNamingConventionPrefix);
    const modelNamingConventionSuffix = sanitizeString(candidateModelSuffix, defaultConfig.modelNamingConventionSuffix);
    const modelNamingConventionReplaceRegex = candidateModelReplaceRegex?.trim() || defaultConfig.modelNamingConventionReplaceRegex;
    const modelNamingConventionReplaceValue = candidateModelReplaceValue?.trim() || defaultConfig.modelNamingConventionReplaceValue;

    const enumNamingConventionPrefix = sanitizeString(candidateEnumPrefix, defaultConfig.enumNamingConventionPrefix);
    const enumNamingConventionSuffix = sanitizeString(candidateEnumSuffix, defaultConfig.enumNamingConventionSuffix);
    const enumNamingConventionReplaceRegex = candidateEnumReplaceRegex?.trim() || defaultConfig.enumNamingConventionReplaceRegex;
    const enumNamingConventionReplaceValue = candidateEnumReplaceValue?.trim() || defaultConfig.enumNamingConventionReplaceValue;

    return {
        fileName,
        entityFileSuffix,
        useReadonlyArray,
        generateModels,
        generateEnums,
        usePrismaEnumsWhenDisabled,
        namespaceName,
        prismaClientImportPath,
        modelNamingConventionPrefix,
        modelNamingConventionSuffix,
        modelNamingConventionReplaceRegex,
        modelNamingConventionReplaceValue,
        enumNamingConventionPrefix,
        enumNamingConventionSuffix,
        enumNamingConventionReplaceRegex,
        enumNamingConventionReplaceValue,
    };
};
