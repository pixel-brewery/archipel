// #region Imports

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ReleaseClient } from 'nx/release';

// #endregion

/**
 * Prepares both configured release groups through Nx's public API without performing Git or registry writes.
 *
 * @param options - The patch, minor or major increment selected by the trusted release workflow.
 * @param dependencies - An optional tag-reading boundary for offline policy tests.
 * @returns Nx's version preparation result after manifests and changelogs have been updated.
 * @remarks The release client combines these Git overrides with nx.json, preserving the canonical groups and versioning configuration. The later candidate helper exclusively owns the metadata commit and tags.
 *
 * @internal
 */
export async function prepareReleaseVersions({ specifier = 'patch' } = {}, dependencies = {}) {
    if (!['patch', 'minor', 'major'].includes(specifier)) throw new Error('Select patch, minor or major for release preparation.');
    const readTags = dependencies.readTags ?? readGitTags;
    let platform;
    let generators;
    try {
        platform = (await readTags('v[0-9]*')).trim();
        generators = (await readTags('prisma-generators-v[0-9]*')).trim();
    } catch {
        throw new Error('Could not inspect both release group tag baselines.');
    }
    if (Boolean(platform) !== Boolean(generators)) throw new Error('Both release groups must have a version baseline; refusing a partial tag history.');

    const client = new ReleaseClient({ git: { commit: false, tag: false, push: false, stageChanges: false } });
    return client.release({ specifier, firstRelease: !platform, skipPublish: true });
}

function readGitTags(pattern) {
    return execFileSync('git', ['tag', '--list', pattern], { encoding: 'utf8', timeout: 15_000, maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        if (process.argv.length !== 2) throw new Error('Release version preparation accepts only its workflow environment.');
        await prepareReleaseVersions({ specifier: process.env.RELEASE_SPECIFIER || 'patch' });
    } catch {
        process.stderr.write('Release version preparation failed; inspect the Nx output and release group baselines.\n');
        process.exitCode = 1;
    }
}
