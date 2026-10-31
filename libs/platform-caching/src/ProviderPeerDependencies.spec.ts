import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

interface IPackageManifest {
    readonly peerDependencies?: Readonly<Record<string, string>>;
    readonly peerDependenciesMeta?: Readonly<Record<string, { readonly optional?: boolean }>>;
}

describe('caching provider peer dependencies', () => {
    it('should keep the opt-in Redis adapter package optional', () => {
        // arrange
        const packageManifest = JSON.parse(readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8')) as IPackageManifest;

        // act
        const isOptional = packageManifest.peerDependencies?.['ioredis'] !== undefined && packageManifest.peerDependenciesMeta?.['ioredis']?.optional === true;

        // assert
        expect(isOptional).toBe(true);
    });
});
