import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IPackageManifest {
    readonly dependencies?: Readonly<Record<string, string>>;
    readonly peerDependencies?: Readonly<Record<string, string>>;
}

const FILE_STRATEGY_RUNTIME_DEPENDENCIES = ['glob', 'mime-types'] as const;

function readPackageManifest(): IPackageManifest {
    return JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;
}

describe('resource runtime dependencies', () => {
    it('should install dependencies required by the built-in file strategy', () => {
        // arrange
        const packageManifest = readPackageManifest();

        // act
        const missingDependencies = FILE_STRATEGY_RUNTIME_DEPENDENCIES.filter((dependency) => packageManifest.dependencies?.[dependency] === undefined);
        const peerDependencies = FILE_STRATEGY_RUNTIME_DEPENDENCIES.filter((dependency) => packageManifest.peerDependencies?.[dependency] !== undefined);

        // assert
        expect(missingDependencies).toEqual([]);
        expect(peerDependencies).toEqual([]);
    });
});
