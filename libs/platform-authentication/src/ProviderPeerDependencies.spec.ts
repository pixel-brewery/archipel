import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IPackageManifest {
    readonly peerDependencies?: Readonly<Record<string, string>>;
    readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
}

const OPTIONAL_PROVIDER_PEERS = ['passport-apple', 'passport-github2', 'passport-google-oauth20', 'passport-microsoft'] as const;
const REQUIRED_PROVIDER_PEERS = ['passport-custom', 'passport-jwt', 'passport-local'] as const;

function readPackageManifest(): IPackageManifest {
    return JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;
}

describe('authentication provider peer dependencies', () => {
    it('should keep opt-in OAuth connector packages optional', () => {
        // arrange
        const packageManifest = readPackageManifest();

        // act
        const violations = OPTIONAL_PROVIDER_PEERS.filter(
            (dependency) =>
                packageManifest.peerDependencies?.[dependency] === undefined || packageManifest.peerDependenciesMeta?.[dependency]?.optional !== true,
        );

        // assert
        expect(violations).toEqual([]);
    });

    it('should keep built-in authentication strategies required', () => {
        // arrange
        const packageManifest = readPackageManifest();

        // act
        const violations = REQUIRED_PROVIDER_PEERS.filter(
            (dependency) =>
                packageManifest.peerDependencies?.[dependency] === undefined || packageManifest.peerDependenciesMeta?.[dependency]?.optional === true,
        );

        // assert
        expect(violations).toEqual([]);
    });
});
