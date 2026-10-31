import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readReleaseCandidate } from './readReleaseCandidate.mjs';
import { releaseRepository } from './releaseRepository.mjs';

const directories = [];
function fixture() {
    const packages = Array.from({ length: 25 }, (_, index) => ({
        group: 'platform',
        name: `@pixel-brewery/archipel-platform-lib-${index}`,
        sourceRoot: `libs/platform-lib-${index}`,
        version: '0.1.24',
    }));
    packages.push({ group: 'platform', name: '@pixel-brewery/archipel-mcp', sourceRoot: 'tools/mcp', version: '0.1.24' });
    for (const name of ['entities', 'json-schema'])
        packages.push({
            group: 'prisma-generators',
            name: `@pixel-brewery/archipel-prisma-generator-${name}`,
            sourceRoot: `tools/prisma-generator-${name}`,
            version: '0.1.24',
        });
    return {
        schemaVersion: 1,
        repositoryId: releaseRepository.id,
        repository: releaseRepository.fullName,
        sourceCommit: 'a'.repeat(40),
        preparedCommit: 'b'.repeat(40),
        groups: { platform: '0.1.24', 'prisma-generators': '0.1.24' },
        tags: { platform: 'v0.1.24', 'prisma-generators': 'prisma-generators-v0.1.24' },
        packages,
    };
}
function file(candidate) {
    const directory = mkdtempSync(join(tmpdir(), 'archipel-release-metadata-'));
    directories.push(directory);
    const filename = join(directory, 'release-candidate.json');
    writeFileSync(filename, JSON.stringify(candidate));
    return filename;
}
afterEach(() => {
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

describe('readReleaseCandidate', () => {
    it('retains both independently versioned groups and their exact package inventory', () => {
        // Arrange
        const candidate = fixture();
        const filename = file(candidate);
        // Act
        const result = readReleaseCandidate(filename);
        // Assert
        expect(result).toEqual(candidate);
    });
    it.each([
        ['wrong repository ID', (value) => value.repositoryId++],
        ['old owner', (value) => (value.repository = 'former-owner/archipel')],
        ['missing parent identity', (value) => (value.sourceCommit = 'main')],
        ['self parent', (value) => (value.preparedCommit = value.sourceCommit)],
        ['incomplete group', (value) => value.packages.pop()],
        ['duplicate package', (value) => (value.packages[1] = value.packages[0])],
        ['path traversal', (value) => (value.packages[0].sourceRoot = '../source')],
        ['foreign package scope', (value) => (value.packages[0].name = '@someone/package')],
        ['divergent fixed version', (value) => (value.packages[0].version = '0.1.25')],
        ['mismatching tag', (value) => (value.tags.platform = 'v0.1.25')],
        ['shell tag', (value) => (value.groups.platform = '$(secret)')],
    ])('rejects %s', (_name, mutate) => {
        // Arrange
        const candidate = fixture();
        mutate(candidate);
        const filename = file(candidate);
        // Act / Assert
        expect(() => readReleaseCandidate(filename)).toThrow();
    });
    it('requires exact flat tarball names and full SHA-512 integrity for publication', () => {
        // Arrange
        const candidate = fixture();
        for (const item of candidate.packages) {
            item.filename = `${item.name.slice(1).replaceAll('/', '-')}-${item.version}.tgz`;
            item.integrity = `sha512-${Buffer.alloc(64, 1).toString('base64')}`;
        }
        const filename = file(candidate);
        // Act
        const result = readReleaseCandidate(filename, true);
        // Assert
        expect(result.packages).toHaveLength(28);
    });
    it('rejects prepared metadata without pack evidence in the publisher', () => {
        // Arrange
        const filename = file(fixture());
        // Act / Assert
        expect(() => readReleaseCandidate(filename, true)).toThrow('packed');
    });
});
