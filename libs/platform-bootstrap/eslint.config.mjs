import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    {
        files: ['**/*.json'],
        rules: {
            '@nx/dependency-checks': [
                'error',
                {
                    ignoredFiles: [
                        '{projectRoot}/eslint.config.{js,cjs,mjs,ts,cts,mts}',
                        '{projectRoot}/vite.config.{js,cjs,mjs,ts,cts,mts}',
                        '{projectRoot}/vitest.config.{js,cjs,mjs,ts,cts,mts}',
                    ],
                    ignoredDependencies: [
                        '@nestjs/core',
                        '@nx/vite',
                        'class-transformer',
                        'class-validator',
                        'compression',
                        'express',
                        'express-rate-limit',
                        'reflect-metadata',
                        'rxjs',
                        'vite',
                        'vitest',
                    ],
                },
            ],
        },
        languageOptions: {
            parser: await import('jsonc-eslint-parser'),
        },
    },
];
