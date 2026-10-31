import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [],
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vitest/libs/platform-documents',
    resolve: {
        tsconfigPaths: true,
        conditions: ['types', 'node', 'import'],
    },
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{spec,test}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: ['node_modules', 'dist', '.nx', 'coverage'],
        passWithNoTests: true,
        watch: false,
        reporters: ['default'],
        silent: false,
        bail: 0,
        isolate: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: '../../coverage/libs/platform-documents',
        },
    },
});
