import { afterEach, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifyReleaseCandidate } from './verifyReleaseCandidate.mjs';
import { releaseRepository } from './releaseRepository.mjs';

const originalDirectory = process.cwd();
const directories = [];
function fixture(mutate) {
    const directory = mkdtempSync(join(tmpdir(), 'archipel-candidate-git-'));
    directories.push(directory);
    const repository = join(directory, 'repository');
    const artifact = join(directory, 'artifact');
    mkdirSync(repository);
    mkdirSync(artifact);
    const globalConfig = join(directory, 'empty.gitconfig');
    writeFileSync(globalConfig, '');
    const env = {
        ...process.env,
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: globalConfig,
        GIT_AUTHOR_NAME: 'Release Fixture',
        GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
        GIT_COMMITTER_NAME: 'Release Fixture',
        GIT_COMMITTER_EMAIL: 'fixture@example.invalid',
    };
    const git = (...args) =>
        execFileSync('git', ['-c', 'commit.gpgsign=false', '-c', 'tag.gpgsign=false', ...args], {
            cwd: repository,
            env,
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'pipe'],
        }).trim();
    git('init', '--initial-branch=main');
    // Keep LF fixture writes consistent across isolated Git and the verifier's native Git calls.
    git('config', 'core.autocrlf', 'false');
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
    for (const item of packages) {
        mkdirSync(join(repository, item.sourceRoot), { recursive: true });
        writeFileSync(join(repository, item.sourceRoot, 'package.json'), JSON.stringify({ name: item.name, version: '0.1.23', type: 'module' }));
    }
    writeFileSync(join(repository, 'runtime.ts'), 'export const value = true;\n');
    git('add', '.');
    git('commit', '-m', 'Initial source');
    const sourceCommit = git('rev-parse', 'HEAD');
    for (const item of packages)
        writeFileSync(join(repository, item.sourceRoot, 'package.json'), JSON.stringify({ name: item.name, version: item.version, type: 'module' }));
    writeFileSync(join(repository, 'CHANGELOG.md'), '# Release\n');
    mutate?.(repository);
    git('add', '.');
    git('commit', '-m', 'chore(release): fixture [skip ci]');
    const preparedCommit = git('rev-parse', 'HEAD');
    const tags = { platform: 'v0.1.24', 'prisma-generators': 'prisma-generators-v0.1.24' };
    for (const tag of Object.values(tags)) git('tag', '--annotate', tag, '--message', tag);
    const candidate = {
        schemaVersion: 1,
        repositoryId: releaseRepository.id,
        repository: releaseRepository.fullName,
        sourceCommit,
        preparedCommit,
        groups: { platform: '0.1.24', 'prisma-generators': '0.1.24' },
        tags,
        packages,
    };
    const save = () => writeFileSync(join(artifact, 'release-candidate.json'), JSON.stringify(candidate));
    save();
    process.chdir(repository);
    return { directory, repository, artifact, sourceCommit, preparedCommit, candidate, git, save };
}
afterEach(() => {
    process.chdir(originalDirectory);
    for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

// These integration fixtures perform real Git operations, including 28 package manifests.
describe('verifyReleaseCandidate', { timeout: 30_000 }, () => {
    it('accepts exactly one metadata-only child with both fixed tags and all 28 versioned manifests', () => {
        // Arrange
        const value = fixture();
        // Act
        const candidate = verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit });
        // Assert
        expect(candidate.preparedCommit).toBe(value.preparedCommit);
        expect(candidate.packages).toHaveLength(28);
    });
    it('imports and checks out the exact candidate branch from its source-prerequisite Git bundle', () => {
        // Arrange
        const value = fixture();
        value.git('update-ref', 'refs/heads/archipel-release-candidate', value.preparedCommit);
        value.git(
            'bundle',
            'create',
            join(value.artifact, 'release.bundle'),
            `${value.sourceCommit}..refs/heads/archipel-release-candidate`,
            ...Object.values(value.candidate.tags).map((tag) => `refs/tags/${tag}`),
        );
        value.git('checkout', '--detach', value.sourceCommit);
        // Act
        const candidate = verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit, checkout: true });
        // Assert
        expect(value.git('rev-parse', 'HEAD')).toBe(candidate.preparedCommit);
        expect(value.git('status', '--porcelain')).toBe('');
    });
    it('rejects runtime changes mixed into version preparation', () => {
        // Arrange
        const value = fixture((repository) => writeFileSync(join(repository, 'runtime.ts'), 'export const value = false;\n'));
        // Act / Assert
        expect(() => verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit })).toThrow('non-metadata');
    });
    it('rejects lifecycle scripts hidden inside a versioned package manifest', () => {
        // Arrange
        const value = fixture((repository) => {
            const filename = join(repository, 'libs/platform-lib-0/package.json');
            const manifest = JSON.parse(readFileSync(filename, 'utf8'));
            manifest.scripts = { postinstall: 'unexpected-script' };
            writeFileSync(filename, JSON.stringify(manifest));
        });
        // Act / Assert
        expect(() => verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit })).toThrow('outside version metadata');
    });
    it('rejects a candidate whose tag was redirected to another source commit', () => {
        // Arrange
        const value = fixture();
        value.git('tag', '--force', 'v0.1.24', value.sourceCommit);
        // Act / Assert
        expect(() => verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit })).toThrow('tag does not identify');
    });
    it('detects modified tarball bytes before any publisher operation', () => {
        // Arrange
        const value = fixture();
        writeFileSync(join(value.artifact, 'release.bundle'), 'unit fixture');
        for (const item of value.candidate.packages) {
            const bytes = Buffer.from(`fixture archive ${item.name}`);
            item.filename = `${item.name.slice(1).replaceAll('/', '-')}-${item.version}.tgz`;
            item.integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
            writeFileSync(join(value.artifact, item.filename), bytes);
        }
        value.save();
        writeFileSync(join(value.artifact, value.candidate.packages[0].filename), 'changed archive');
        // Act / Assert
        expect(() => verifyReleaseCandidate(value.artifact, { sourceCommit: value.sourceCommit, requirePacked: true })).toThrow('tarball bytes differ');
    });
});
