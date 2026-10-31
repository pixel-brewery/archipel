import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    root: fileURLToPath(new URL('../..', import.meta.url)),
    test: {
        include: ['.github/scripts/**/*.spec.mjs', 'tools/verify-{esm,published}-packages.spec.mjs'],
        pool: 'forks',
        maxWorkers: 1,
        fileParallelism: false,
    },
});
