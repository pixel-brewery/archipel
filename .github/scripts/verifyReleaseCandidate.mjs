// #region Imports

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { readReleaseCandidate } from './readReleaseCandidate.mjs';
import { validateReleaseChanges } from './validateReleaseChanges.mjs';

// #endregion

/**
 * Verifies the exact one-commit release candidate and optionally imports its source-bound bundle.
 *
 * @param directory - The artifact directory containing release-candidate.json and release.bundle.
 * @param options - The expected source revision and whether to import and check out the candidate.
 * @returns Validated candidate metadata.
 * @remarks Does not access credentials, invoke package scripts or change remote refs.
 *
 * @internal
 */
export function verifyReleaseCandidate(directory, options = {}) {
    const candidate = readReleaseCandidate(join(directory, 'release-candidate.json'), options.requirePacked === true);
    const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim();
    if (candidate.sourceCommit !== options.sourceCommit) throw new Error('Release artifact belongs to a different source revision.');
    if (options.checkout) {
        const bundle = resolve(directory, 'release.bundle');
        if (!lstatSync(bundle).isFile()) throw new Error('Release bundle is missing or not a regular file.');
        git(
            'fetch',
            '--no-tags',
            bundle,
            'refs/heads/archipel-release-candidate',
            ...Object.values(candidate.tags).map((tag) => `refs/tags/${tag}:refs/tags/${tag}`),
        );
        if (git('rev-parse', 'FETCH_HEAD') !== candidate.preparedCommit) throw new Error('Release bundle head does not match its metadata.');
    }
    const parents = git('rev-list', '--parents', '-n', '1', candidate.preparedCommit).split(' ');
    if (parents.length !== 2 || parents[1] !== candidate.sourceCommit)
        throw new Error('Release candidate must have exactly the triggering source revision as parent.');
    validateReleaseChanges(candidate, candidate.preparedCommit);
    for (const tag of Object.values(candidate.tags)) {
        if (git('rev-parse', `${tag}^{commit}`) !== candidate.preparedCommit) throw new Error('Release tag does not identify the prepared commit.');
    }
    for (const item of candidate.packages) {
        const manifest = JSON.parse(git('show', `${candidate.preparedCommit}:${item.sourceRoot}/package.json`));
        if (manifest.name !== item.name || manifest.version !== item.version || manifest.private === true)
            throw new Error('Release package metadata does not match its prepared commit.');
    }
    if (options.requirePacked) {
        const expectedFiles = new Set(['release.bundle', 'release-candidate.json', ...candidate.packages.map((item) => item.filename)]);
        if (readdirSync(directory).some((name) => !expectedFiles.delete(name)) || expectedFiles.size !== 0)
            throw new Error('Release artifact file set is incomplete or contains extra files.');
        for (const item of candidate.packages) {
            const filename = join(directory, item.filename);
            const stat = lstatSync(filename);
            if (!stat.isFile() || stat.size < 1 || stat.size > 128 * 1024 * 1024) throw new Error('Release tarball is not a bounded regular file.');
            const integrity = `sha512-${createHash('sha512').update(readFileSync(filename)).digest('base64')}`;
            if (integrity !== item.integrity) throw new Error('Release tarball bytes differ from the verified artifact.');
        }
    }
    if (options.checkout) git('checkout', '--detach', candidate.preparedCommit);
    if (git('rev-parse', 'HEAD') !== candidate.preparedCommit) throw new Error('Checkout is not the prepared release commit.');
    if (git('status', '--porcelain')) throw new Error('Release candidate checkout is not clean.');
    return candidate;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values } = parseArgs({
            options: { directory: { type: 'string' }, checkout: { type: 'boolean', default: false }, 'require-packed': { type: 'boolean', default: false } },
        });
        const candidate = verifyReleaseCandidate(values.directory, {
            checkout: values.checkout,
            requirePacked: values['require-packed'],
            sourceCommit: process.env.RELEASE_SOURCE_COMMIT ?? process.env.GITHUB_SHA,
        });
        process.stdout.write(`Verified prepared release ${candidate.preparedCommit}.\n`);
    } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : 'Release candidate verification failed.'}\n`);
        process.exitCode = 1;
    }
}
