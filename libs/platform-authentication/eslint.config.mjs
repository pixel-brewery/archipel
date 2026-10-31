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
                        '@nx/vite',
                        'vite',
                        'vitest',
                        'passport-apple',
                        'passport-github2',
                        'passport-google-oauth20',
                        'passport-microsoft',
                        '@types/passport-apple',
                        '@types/passport-github2',
                        '@types/passport-google-oauth20',
                        '@types/passport-microsoft',
                    ],
                },
            ],
        },
        languageOptions: {
            parser: await import('jsonc-eslint-parser'),
        },
    },
];
