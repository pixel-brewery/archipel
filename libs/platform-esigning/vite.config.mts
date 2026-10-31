/// <reference types='vitest' />
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
    resolve: {
        tsconfigPaths: true,
    },
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/libs/esigning',
    plugins: [nxCopyAssetsPlugin(['*.md'])],
    test: {
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/libs/esigning',
            provider: 'v8' as const,
        },
    },
}));
