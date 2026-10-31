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
        },
    },
});
