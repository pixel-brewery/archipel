/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    resolve: {
        tsconfigPaths: true,
    },
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/libs/configuration',
    plugins: [nxCopyAssetsPlugin(['*.md'])],
    test: {
        watch: false,
        globals: true,
        environment: 'node',
        include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/libs/configuration',
            provider: 'v8' as const,
        },
    },
}));
