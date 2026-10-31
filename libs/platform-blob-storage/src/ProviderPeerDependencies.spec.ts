import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IPackageManifest {
    readonly peerDependencies?: Readonly<Record<string, string>>;
    readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
}

const OPTIONAL_PROVIDER_PEERS = ['@aws-sdk/client-s3', '@aws-sdk/s3-request-presigner', '@azure/storage-blob', 'axios'] as const;

describe('blob storage provider peer dependencies', () => {
    it('should keep opt-in storage adapter packages optional', () => {
        // arrange
        const packageManifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;

        // act
        const violations = OPTIONAL_PROVIDER_PEERS.filter(
            (dependency) =>
                packageManifest.peerDependencies?.[dependency] === undefined || packageManifest.peerDependenciesMeta?.[dependency]?.optional !== true,
        );

        // assert
        expect(violations).toEqual([]);
    });
});
