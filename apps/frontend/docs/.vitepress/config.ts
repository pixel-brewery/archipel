import path from 'node:path';
import { defineConfig } from 'vitepress';
import { buildFullSidebar } from './plugins/apiDocsPlugin.js';
import { loadPackagesAtBuildTime } from './plugins/packagesLoader.js';

const configDirectory = import.meta.dirname;

// Path from .vitepress to the repository-level .docs source directory.
const docsRoot = path.resolve(configDirectory, '../../../../.docs');
const sidebar = buildFullSidebar(docsRoot);

// Load packages at BUILD TIME - this runs once during vitepress build
const packagesData = loadPackagesAtBuildTime(docsRoot, configDirectory);

// Virtual module name for packages data
const virtualModuleId = 'virtual:packages-data';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default defineConfig({
    title: 'Archipel API Docs',
    description: 'API-first documentation for Archipel platform libraries and integrations',

    srcDir: docsRoot,
    base: '/archipel/',
    cleanUrls: false,
    lastUpdated: false,
    appearance: 'dark',

    // Vite plugin to provide packages data as a virtual module
    vite: {
        publicDir: path.join(docsRoot, 'public'),
        plugins: [
            {
                name: 'packages-data-plugin',
                resolveId(id) {
                    if (id === virtualModuleId) {
                        return resolvedVirtualModuleId;
                    }
                },
                load(id) {
                    if (id === resolvedVirtualModuleId) {
                        return `export default ${JSON.stringify(packagesData)}`;
                    }
                },
            },
        ],
    },

    head: [
        ['meta', { name: 'theme-color', content: '#ff2975' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
        ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
        [
            'link',
            {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/css2?family=Satisfy&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
            },
        ],
    ],

    themeConfig: {
        logo: undefined,
        siteTitle: 'Archipel',

        nav: [
            { text: 'Home', link: '/' },
            { text: 'Packages', link: '/packages/' },
            { text: 'Guides', link: '/guides/' },
            { text: 'Patterns', link: '/patterns/' },
            { text: 'API', link: '/api/' },
            { text: 'Architecture', link: '/architecture/' },
            { text: 'Tools', link: '/tools/' },
        ],

        sidebar,

        socialLinks: [{ icon: 'github', link: 'https://github.com/pixel-brewery/archipel' }],

        search: {
            provider: 'local',
        },

        editLink: {
            pattern: 'https://github.com/pixel-brewery/archipel/edit/main/.docs/:path',
            text: 'Suggest an API docs edit',
        },

        footer: {
            message: 'Released under the MIT License.',
            copyright: '© 2026 Archipel Platform',
        },
    },

    markdown: {
        lineNumbers: true,
    },
});
