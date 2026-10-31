// #region Imports

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// #endregion

// #region Constants

const SOURCE_ROOT = resolve(import.meta.dirname);
const GENERATORS = [
    'IntelligenceLanguageGenerator',
    'IntelligenceEmbeddingGenerator',
    'IntelligenceImageGenerator',
    'IntelligenceSpeechGenerator',
    'IntelligenceTranscriptionGenerator',
    'IntelligenceVideoGenerator',
] as const;

// #endregion

describe('intelligence generator topology', () => {
    // #region Methods

    it('should keep every capability generator inside the generators technology folder', () => {
        // arrange
        const rootIndex = readFileSync(resolve(SOURCE_ROOT, 'index.ts'), 'utf8');

        // act
        const violations = GENERATORS.flatMap((generator) => [
            ...(!existsSync(resolve(SOURCE_ROOT, 'generators', `${generator}.ts`)) ? [`missing:${generator}`] : []),
            ...(existsSync(resolve(SOURCE_ROOT, `${generator}.ts`)) ? [`root-source:${generator}`] : []),
            ...(!rootIndex.includes(`from './generators/${generator}.js'`) ? [`root-export:${generator}`] : []),
        ]);

        // assert
        expect(violations).toEqual([]);
    });

    it('should expose no media catch-all generator', () => {
        // arrange
        const rootIndex = readFileSync(resolve(SOURCE_ROOT, 'index.ts'), 'utf8');
        const moduleSource = readFileSync(resolve(SOURCE_ROOT, 'IntelligenceModule.ts'), 'utf8');

        // act
        const mediaSurfaces = [
            ...(rootIndex.includes('IntelligenceMediaGenerator') ? ['root-export'] : []),
            ...(moduleSource.includes('IntelligenceMediaGenerator') ? ['module-provider'] : []),
            ...(existsSync(resolve(SOURCE_ROOT, 'IntelligenceMediaGenerator.ts')) ? ['root-source'] : []),
            ...(existsSync(resolve(SOURCE_ROOT, 'generators', 'IntelligenceMediaGenerator.ts')) ? ['generator-source'] : []),
        ];

        // assert
        expect(mediaSurfaces).toEqual([]);
    });

    // #endregion
});
