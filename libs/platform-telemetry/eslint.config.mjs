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
                        '@pixel-brewery/archipel-platform-core',
                        '@opentelemetry/exporter-metrics-otlp-grpc',
                        '@opentelemetry/exporter-metrics-otlp-http',
                        '@opentelemetry/exporter-prometheus',
                        '@opentelemetry/exporter-trace-otlp-http',
                        '@opentelemetry/instrumentation-http',
                        '@opentelemetry/resources',
                        '@opentelemetry/sdk-node',
                    ],
                },
            ],
        },
        languageOptions: {
            parser: await import('jsonc-eslint-parser'),
        },
    },
];
