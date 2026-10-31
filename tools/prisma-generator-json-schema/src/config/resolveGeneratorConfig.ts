import type { IJsonSchemaGeneratorConfig } from './IJsonSchemaGeneratorConfig.js';
import type { INamingConvention } from './INamingConvention.js';

const defaultNamingConvention: INamingConvention = {
    prefix: '',
    suffix: '',
};

const defaultConfig: IJsonSchemaGeneratorConfig = {
    fileName: 'manifest.json',
    schemaFileSuffix: '.schema.json',
    schemaVersion: 'https://json-schema.org/schema',
    emitGeneratorComment: true,
    modelNamingConvention: defaultNamingConvention,
    enumNamingConvention: defaultNamingConvention,
};

const trueLiterals = ['true', '1', 'yes', 'y'];
const falseLiterals = ['false', '0', 'no', 'n'];

const sanitizeFileName = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return defaultConfig.fileName;
    }

    return trimmedValue.endsWith('.json') ? trimmedValue : `${trimmedValue}.json`;
};

const sanitizeSchemaSuffix = (value: string): string => {
    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return defaultConfig.schemaFileSuffix;
    }

    const withLeadingDot = trimmedValue.startsWith('.') ? trimmedValue : `.${trimmedValue}`;
    return withLeadingDot.endsWith('.json') ? withLeadingDot : `${withLeadingDot}.json`;
};

const sanitizeSchemaVersion = (value: string | undefined): string => {
    if (value === undefined) {
        return defaultConfig.schemaVersion;
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
        return defaultConfig.schemaVersion;
    }

    return trimmedValue;
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

const sanitizeNamingConvention = (candidate: Partial<INamingConvention> | undefined, fallback: INamingConvention): INamingConvention => {
    const prefix = typeof candidate?.prefix === 'string' ? candidate.prefix.trim() : (fallback.prefix ?? '');
    const suffix = typeof candidate?.suffix === 'string' ? candidate.suffix.trim() : (fallback.suffix ?? '');

    const replaceCandidate = candidate?.replace;
    let replace:
        | {
              regex: string;
              value: string;
          }
        | undefined;

    if (replaceCandidate && typeof replaceCandidate.regex === 'string') {
        const regex = replaceCandidate.regex.trim();
        if (regex.length > 0) {
            replace = {
                regex,
                value: typeof replaceCandidate.value === 'string' ? replaceCandidate.value : '',
            };
        }
    }

    return {
        prefix,
        suffix,
        ...(replace ? { replace } : {}),
    };
};

const parseNamingConvention = (rawValue: string | undefined, fallback: INamingConvention): INamingConvention => {
    if (rawValue === undefined) {
        return sanitizeNamingConvention(undefined, fallback);
    }

    try {
        const parsed = JSON.parse(rawValue) as Partial<INamingConvention> | undefined;
        return sanitizeNamingConvention(parsed, fallback);
    } catch {
        return sanitizeNamingConvention(undefined, fallback);
    }
};

/**
 * Merges user-specified Prisma generator configuration with the internal defaults.
 *
 * @param config Prisma generator configuration object
 * @returns Normalized generator configuration
 */
export const resolveGeneratorConfig = (config: Record<string, string | string[] | undefined>): IJsonSchemaGeneratorConfig => {
    const candidateFileName = config['fileName'] as string | undefined;
    const candidateSchemaSuffix = config['schemaFileSuffix'] as string | undefined;
    const candidateSchemaVersion = config['schemaVersion'] as string | undefined;
    const candidateComment = config['emitGeneratorComment'] as string | undefined;
    const candidateModelConvention = config['modelNamingConvention'] as string | undefined;
    const candidateEnumConvention = config['enumNamingConvention'] as string | undefined;

    const fileName = sanitizeFileName(candidateFileName ?? defaultConfig.fileName);
    const schemaFileSuffix = sanitizeSchemaSuffix(candidateSchemaSuffix ?? defaultConfig.schemaFileSuffix);
    const schemaVersion = sanitizeSchemaVersion(candidateSchemaVersion);
    const emitGeneratorComment = parseBoolean(candidateComment, defaultConfig.emitGeneratorComment);
    const modelNamingConvention = parseNamingConvention(candidateModelConvention, defaultConfig.modelNamingConvention);
    const enumNamingConvention = parseNamingConvention(candidateEnumConvention, defaultConfig.enumNamingConvention);

    return {
        fileName,
        schemaFileSuffix,
        schemaVersion,
        emitGeneratorComment,
        modelNamingConvention,
        enumNamingConvention,
    };
};
