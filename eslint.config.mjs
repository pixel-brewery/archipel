import jsPlugin from '@eslint/js';
import nx from '@nx/eslint-plugin';
import stylistic from '@stylistic/eslint-plugin';

export default [
    jsPlugin.configs.recommended,
    ...nx.configs['flat/base'],
    ...nx.configs['flat/typescript'],
    ...nx.configs['flat/javascript'],
    // Note: standaloneConfigs2.stylistic removed due to deprecated allowTemplateLiterals boolean value
    {
        // Custom stylistic configuration with non-deprecated options
        files: ['**/*.{ts,tsx,js,jsx}'],
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: 'never' }],
            '@stylistic/space-before-function-paren': 'off',
        },
    },
    // ...standaloneConfigs2.typescript,
    {
        ignores: [
            '**/dist',
            '**/.build/**',
            '**/__legacy/**',
            '**/tmp/**',
            '**/.vitepress/cache/**',
            '**/vite.config.*.timestamp*',
            '**/vitest.config.*.timestamp*',
            '**/eslint.config.*',
            '**/api/**',
        ],
    },
    // Avoid type-aware parsing on build/tool config files which aren't part of TS project references
    {
        files: [
            '**/*config.{js,cjs,mjs,ts,cts,mts}',
            '**/*.{config,configs}.?(c|m)js',
            '**/{vite,vitest,tailwind,webpack,rollup}.config.{js,cjs,mjs,ts,cts,mts}',
        ],
        languageOptions: {
            parserOptions: {
                // Turn off the TS project service for these files to prevent parsing errors
                projectService: false,
            },
        },
        rules: {
            // Config files often use dev-only deps
            '@nx/dependency-checks': 'off',
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': [
                'error',
                {
                    enforceBuildableLibDependency: true,
                    allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
                    depConstraints: [
                        {
                            sourceTag: '*',
                            onlyDependOnLibsWithTags: ['*'],
                        },
                    ],
                },
            ],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts', '**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
        // Register additional plugins and override or add rules here
        rules: {
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    args: 'all',
                    argsIgnorePattern: '^_',
                    caughtErrors: 'all',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],
            'no-unused-vars': 'off',
            'no-redeclare': 'off',
        },
    },
];
