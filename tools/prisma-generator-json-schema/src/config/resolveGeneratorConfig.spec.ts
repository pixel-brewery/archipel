import { describe, expect, it } from 'vitest';
import { resolveGeneratorConfig } from './resolveGeneratorConfig.js';

describe('resolveGeneratorConfig', () => {
    it('applies defaults when no configuration is provided', () => {
        const config = resolveGeneratorConfig({});

        expect(config).toEqual({
            fileName: 'manifest.json',
            schemaFileSuffix: '.schema.json',
            schemaVersion: 'https://json-schema.org/schema',
            emitGeneratorComment: true,
            modelNamingConvention: {
                prefix: '',
                suffix: '',
            },
            enumNamingConvention: {
                prefix: '',
                suffix: '',
            },
        });
    });

    it('parses custom values and sanitizes file names', () => {
        const rawConfig: Record<string, string | undefined> = {
            fileName: 'custom-manifest',
            schemaFileSuffix: 'definition',
            schemaVersion: 'https://json-schema.org/schema',
            emitGeneratorComment: 'no',
            modelNamingConvention: JSON.stringify({
                prefix: 'Json',
                suffix: 'Schema',
                replace: {
                    regex: 'Manifest',
                    value: 'Document',
                },
            }),
            enumNamingConvention: JSON.stringify({
                prefix: 'E',
                suffix: '',
                replace: {
                    regex: 'Role',
                    value: 'Permission',
                },
            }),
        };

        const config = resolveGeneratorConfig(rawConfig);

        expect(config).toEqual({
            fileName: 'custom-manifest.json',
            schemaFileSuffix: '.definition.json',
            schemaVersion: 'https://json-schema.org/schema',
            emitGeneratorComment: false,
            modelNamingConvention: {
                prefix: 'Json',
                suffix: 'Schema',
                replace: {
                    regex: 'Manifest',
                    value: 'Document',
                },
            },
            enumNamingConvention: {
                prefix: 'E',
                suffix: '',
                replace: {
                    regex: 'Role',
                    value: 'Permission',
                },
            },
        });
    });

    it('falls back to defaults when naming conventions cannot be parsed', () => {
        const rawConfig: Record<string, string | undefined> = {
            modelNamingConvention: 'not-json',
            enumNamingConvention: '{"prefix":true}',
        };

        const config = resolveGeneratorConfig(rawConfig);

        expect(config.modelNamingConvention).toEqual({
            prefix: '',
            suffix: '',
        });
        expect(config.enumNamingConvention).toEqual({
            prefix: '',
            suffix: '',
        });
    });
});
