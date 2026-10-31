import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        tsconfigPaths: true,
    },
    plugins: [],
    root: import.meta.dirname,
    test: {
        globals: true,
        environment: 'node',
        include: ['**/*.{[sS]pec,[tT]est}.?(c|m)[jt]s?(x)'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.spec.ts'],
            reportsDirectory: '../../coverage/libs/platform-intelligence-agents',
            thresholds: { statements: 90, lines: 90, branches: 85 },
        },
    },
});
