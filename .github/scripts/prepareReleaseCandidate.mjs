// #region Imports

import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { collectReleasePackages } from '../../tools/verify-published-packages.mjs';
import { releaseRepository } from './releaseRepository.mjs';
import { validateReleaseChanges } from './validateReleaseChanges.mjs';
import { verifyReleaseCandidate } from './verifyReleaseCandidate.mjs';

// #endregion

/**
 * Seals local Nx version preparation as one source-bound metadata commit and two fixed-group tags.
 *
 * @param directory - A CI temporary directory outside the source checkout.
 * @param sourceCommit - The immutable main source revision that requested this release.
 * @returns The validated prepared candidate manifest.
 * @remarks Runs only after local version preparation. This operation creates local Git objects; it never pushes or publishes.
 *
 * @internal
 */
export async function prepareReleaseCandidate(directory, sourceCommit) {
    const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim();
    if (!/^[a-f0-9]{40}$/u.test(sourceCommit ?? '') || git('rev-parse', 'HEAD') !== sourceCommit)
        throw new Error('Release preparation must start at the triggering source revision.');
    const packages = await collectReleasePackages({ groups: ['platform', 'prisma-generators'] });
    const groups = Object.fromEntries(['platform', 'prisma-generators'].map((group) => [group, packages.find((item) => item.group === group)?.version]));
    const tags = { platform: `v${groups.platform}`, 'prisma-generators': `prisma-generators-v${groups['prisma-generators']}` };
    const candidate = {
        schemaVersion: 1,
        repositoryId: releaseRepository.id,
        repository: releaseRepository.fullName,
        sourceCommit,
        preparedCommit: '0'.repeat(40),
        groups,
        tags,
        packages,
    };
    validateReleaseChanges(candidate);
    for (const tag of Object.values(tags)) {
        const existing = git('tag', '--list', tag);
        if (existing) throw new Error('Prepared release tag already exists locally.');
    }
    git('add', '--all');
    git('commit', '-m', `chore(release): publish platform ${groups.platform} and generators ${groups['prisma-generators']} [skip ci]`);
    candidate.preparedCommit = git('rev-parse', 'HEAD');
    for (const tag of Object.values(tags)) git('tag', '--annotate', tag, '--message', tag);
    mkdirSync(directory, { recursive: true });
    writeFileSync(join(directory, 'release-candidate.json'), `${JSON.stringify(candidate, null, 2)}\n`);
    verifyReleaseCandidate(directory, { sourceCommit });
    git('update-ref', 'refs/heads/archipel-release-candidate', candidate.preparedCommit);
    git(
        'bundle',
        'create',
        resolve(directory, 'release.bundle'),
        `${sourceCommit}..refs/heads/archipel-release-candidate`,
        ...Object.values(tags).map((tag) => `refs/tags/${tag}`),
    );
    return candidate;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values } = parseArgs({ options: { directory: { type: 'string' } } });
        const candidate = await prepareReleaseCandidate(values.directory, process.env.GITHUB_SHA);
        process.stdout.write(`Prepared ${candidate.preparedCommit} for both release groups.\n`);
    } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : 'Release preparation failed.'}\n`);
        process.exitCode = 1;
    }
}
