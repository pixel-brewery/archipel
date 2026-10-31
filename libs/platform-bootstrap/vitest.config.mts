import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
    resolve: {
        tsconfigPaths: true,
    },
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/libs/platform-bootstrap',
    plugins: [nxCopyAssetsPlugin(['*.md'])],
    test: {
        name: 'platform-bootstrap',
        watch: false,
        globals: true,
        environment: 'node',
        include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/libs/platform-bootstrap',
            provider: 'v8' as const,
        },
    },
}));
