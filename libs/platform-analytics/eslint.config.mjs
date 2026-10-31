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
                    ignoredDependencies: ['@nx/vite', 'vite', 'vitest', '@nestjs/core', '@sentry/node', 'applicationinsights', 'dd-trace'],
                },
            ],
        },
        languageOptions: {
            parser: await import('jsonc-eslint-parser'),
        },
    },
];
