import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [],
    root: import.meta.dirname,
    test: {
        include: ['**/*.{[sS]pec,[tT]est}.?(c|m)[jt]s?(x)'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
        },
        projects: ['libs/**/vitest.config.{mjs,mts}', 'tools/**/vitest.config.{mjs,mts}'],
    },
});
