// #region Imports

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// #endregion

// #region Types

interface IPackageExport {
    readonly default: string;
    readonly types: string;
}

interface IPackageManifest {
    readonly devDependencies?: Readonly<Record<string, string>>;
    readonly exports?: Readonly<Record<string, IPackageExport>>;
    readonly optionalDependencies?: Readonly<Record<string, string>>;
    readonly peerDependencies?: Readonly<Record<string, string>>;
    readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
    readonly typesVersions?: Readonly<Record<string, Readonly<Record<string, ReadonlyArray<string>>>>>;
}

interface IProjectManifest {
    readonly targets?: {
        readonly build?: {
            readonly options?: {
                readonly additionalEntryPoints?: ReadonlyArray<string>;
            };
        };
    };
}

interface ITsConfig {
    readonly compilerOptions?: {
        readonly paths?: Readonly<Record<string, ReadonlyArray<string>>>;
    };
}

interface IProviderDefinition {
    readonly adapter: string;
    readonly configEntries: string;
    readonly loader: string;
    readonly sdk: string;
    readonly tools: boolean;
}

// #endregion

// #region Constants

const WORKSPACE_ROOT = resolve(import.meta.dirname, '../../..');
const PACKAGE_NAME = '@pixel-brewery/archipel-platform-intelligence';
const PROVIDERS: Readonly<Record<string, IProviderDefinition>> = {
    openai: {
        adapter: 'OpenAIIntelligenceProviderAdapter',
        configEntries: 'OPENAI_CONFIG_ENTRIES',
        loader: 'loadOpenAISdk.ts',
        sdk: '@ai-sdk/openai',
        tools: true,
    },
    anthropic: {
        adapter: 'AnthropicIntelligenceProviderAdapter',
        configEntries: 'ANTHROPIC_CONFIG_ENTRIES',
        loader: 'loadAnthropicSdk.ts',
        sdk: '@ai-sdk/anthropic',
        tools: true,
    },
    google: {
        adapter: 'GoogleIntelligenceProviderAdapter',
        configEntries: 'GOOGLE_CONFIG_ENTRIES',
        loader: 'loadGoogleSdk.ts',
        sdk: '@ai-sdk/google',
        tools: true,
    },
    grok: {
        adapter: 'GrokIntelligenceProviderAdapter',
        configEntries: 'GROK_CONFIG_ENTRIES',
        loader: 'loadGrokSdk.ts',
        sdk: '@ai-sdk/xai',
        tools: true,
    },
    mimo: {
        adapter: 'MiMoIntelligenceProviderAdapter',
        configEntries: 'MIMO_CONFIG_ENTRIES',
        loader: 'loadMiMoSdk.ts',
        sdk: '@ai-sdk/openai-compatible',
        tools: true,
    },
    gateway: {
        adapter: 'GatewayIntelligenceProviderAdapter',
        configEntries: 'AI_GATEWAY_CONFIG_ENTRIES',
        loader: 'loadGatewaySdk.ts',
        sdk: '@ai-sdk/gateway',
        tools: false,
    },
};
const LEGACY_PUBLIC_FILES = [
    'IntelligenceImageGenerator.ts',
    'IntelligenceMediaGenerator.ts',
    'IntelligenceTextGenerator.ts',
    'IntelligenceStructuredGenerator.ts',
    'IntelligenceTelemetryRegistry.ts',
    'generators/IntelligenceMediaGenerator.ts',
    'providers/IIntelligenceProviderAdapter.ts',
];
const AI_SDK_RUNTIME_CONSUMERS = [
    'IntelligenceProviderAssetUploader.ts',
    'IntelligenceRealtimeSessionFactory.ts',
    'IntelligenceReranker.ts',
    'generators/IntelligenceEmbeddingGenerator.ts',
    'generators/IntelligenceImageGenerator.ts',
    'generators/IntelligenceLanguageGenerator.ts',
    'generators/IntelligenceSpeechGenerator.ts',
    'generators/IntelligenceTranscriptionGenerator.ts',
    'generators/IntelligenceVideoGenerator.ts',
    'runtime/toAiSdkSchema.ts',
    'runtime/toAiSdkToolSet.ts',
];

// #endregion

// #region Methods

function readJson<TValue>(path: string): TValue {
    return JSON.parse(readFileSync(resolve(WORKSPACE_ROOT, path), 'utf8')) as TValue;
}

// #endregion

describe('intelligence provider entrypoints', () => {
    // #region Methods

    it('should keep every provider lifecycle surface synchronized', () => {
        // arrange
        const packageManifest = readJson<IPackageManifest>('libs/platform-intelligence/package.json');
        const projectManifest = readJson<IProjectManifest>('libs/platform-intelligence/project.json');
        const rootPackageManifest = readJson<IPackageManifest>('package.json');
        const tsconfig = readJson<ITsConfig>('tsconfig.base.json');

        // act
        const violations = Object.entries(PROVIDERS).flatMap(([provider, definition]) => {
            const subpath = `./provider/${provider}`;
            const typeSubpath = `provider/${provider}`;
            const sourceEntry = `libs/platform-intelligence/src/providers/${provider}/index.ts`;
            const importPath = `${PACKAGE_NAME}/provider/${provider}`;
            const indexSource = readFileSync(resolve(WORKSPACE_ROOT, sourceEntry), 'utf8');
            const adapterSource = readFileSync(
                resolve(WORKSPACE_ROOT, `libs/platform-intelligence/src/providers/${provider}/${definition.adapter}.ts`),
                'utf8',
            );
            const loaderSource = readFileSync(resolve(WORKSPACE_ROOT, `libs/platform-intelligence/src/providers/${provider}/${definition.loader}`), 'utf8');
            const checks: Array<readonly [boolean, string]> = [
                [Boolean(packageManifest.exports?.[subpath]), `${provider}: package export`],
                [Boolean(packageManifest.typesVersions?.['*']?.[typeSubpath]), `${provider}: typesVersions`],
                [projectManifest.targets?.build?.options?.additionalEntryPoints?.includes(sourceEntry) === true, `${provider}: Nx entrypoint`],
                [Boolean(tsconfig.compilerOptions?.paths?.[importPath]), `${provider}: TypeScript path`],
                [Boolean(rootPackageManifest.devDependencies?.[definition.sdk]), `${provider}: root SDK dev dependency`],
                [Boolean(packageManifest.optionalDependencies?.[definition.sdk]), `${provider}: Archipel-owned optional SDK dependency`],
                [Boolean(packageManifest.peerDependencies?.[definition.sdk]), `${provider}: optional SDK peer contract`],
                [packageManifest.peerDependenciesMeta?.[definition.sdk]?.optional === true, `${provider}: optional SDK peer metadata`],
                [indexSource.includes(definition.adapter), `${provider}: adapter barrel export`],
                [indexSource.includes(definition.configEntries), `${provider}: config barrel export`],
                [!indexSource.includes("from './tools"), `${provider}: tools isolated from provider entrypoint`],
                [adapterSource.includes('@Injectable()'), `${provider}: injectable adapter`],
                [adapterSource.includes('extends IntelligenceProviderAdapterBase'), `${provider}: provider port`],
                [loaderSource.includes(`import('${definition.sdk}')`), `${provider}: native ESM runtime trace`],
            ];

            if (definition.tools) {
                const toolsEntry = `${sourceEntry.slice(0, -'index.ts'.length)}tools/index.ts`;
                checks.push(
                    [Boolean(packageManifest.exports?.[`${subpath}/tools`]), `${provider}: tools package export`],
                    [Boolean(packageManifest.typesVersions?.['*']?.[`${typeSubpath}/tools`]), `${provider}: tools typesVersions`],
                    [projectManifest.targets?.build?.options?.additionalEntryPoints?.includes(toolsEntry) === true, `${provider}: tools Nx entrypoint`],
                    [Boolean(tsconfig.compilerOptions?.paths?.[`${importPath}/tools`]), `${provider}: tools TypeScript path`],
                );
            }

            return checks.filter(([satisfied]) => !satisfied).map(([, message]) => message);
        });

        // assert
        expect(violations).toEqual([]);
    });

    it('should import the provider-neutral AI runtime directly at every usage site', () => {
        // arrange
        const sourceRoot = resolve(WORKSPACE_ROOT, 'libs/platform-intelligence/src');

        // act
        const consumersWithoutDirectImport = AI_SDK_RUNTIME_CONSUMERS.filter(
            (consumer) => !readFileSync(resolve(sourceRoot, consumer), 'utf8').includes("import('ai')"),
        );

        // assert
        expect(existsSync(resolve(sourceRoot, 'runtime/loadAiSdk.ts'))).toBe(false);
        expect(consumersWithoutDirectImport).toEqual([]);
    });

    it('should expose no root-level or plural provider aliases or superseded facades', () => {
        // arrange
        const packageManifest = readJson<IPackageManifest>('libs/platform-intelligence/package.json');
        const tsconfig = readJson<ITsConfig>('tsconfig.base.json');

        // act
        const legacySurfaces = [
            ...Object.keys(PROVIDERS).flatMap((provider) => [
                ...(packageManifest.exports?.[`./${provider}`] ? [`export:${provider}`] : []),
                ...(packageManifest.typesVersions?.['*']?.[provider] ? [`types:${provider}`] : []),
                ...(tsconfig.compilerOptions?.paths?.[`${PACKAGE_NAME}/${provider}`] ? [`path:${provider}`] : []),
                ...(existsSync(resolve(WORKSPACE_ROOT, `libs/platform-intelligence/src/${provider}`)) ? [`source:${provider}`] : []),
            ]),
            ...Object.keys(packageManifest.exports ?? {}).filter((key) => key.startsWith('./providers/')),
            ...Object.keys(packageManifest.typesVersions?.['*'] ?? {}).filter((key) => key.startsWith('providers/')),
            ...Object.keys(tsconfig.compilerOptions?.paths ?? {}).filter((key) => key.startsWith(`${PACKAGE_NAME}/providers/`)),
            ...LEGACY_PUBLIC_FILES.filter((file) => existsSync(resolve(WORKSPACE_ROOT, 'libs/platform-intelligence/src', file))),
        ];

        // assert
        expect(legacySurfaces).toEqual([]);
    });

    it('should keep the root entrypoint free of provider implementations and provider config', () => {
        // arrange
        const rootIndex = readFileSync(resolve(WORKSPACE_ROOT, 'libs/platform-intelligence/src/index.ts'), 'utf8');
        const rootEnvironment = readFileSync(resolve(WORKSPACE_ROOT, 'libs/platform-intelligence/src/env.ts'), 'utf8');

        // act
        const violations = Object.values(PROVIDERS).flatMap((definition) => [
            ...(rootIndex.includes(definition.adapter) ? [definition.adapter] : []),
            ...(rootIndex.includes(definition.configEntries) ? [definition.configEntries] : []),
            ...(rootEnvironment.includes(definition.configEntries) ? [`env:${definition.configEntries}`] : []),
        ]);

        // assert
        expect(violations).toEqual([]);
    });

    // #endregion
});
