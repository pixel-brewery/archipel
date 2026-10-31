// #region Imports

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

// #endregion

/**
 * Requires a release diff to contain only versions, changelogs, lock metadata and generated API documentation.
 *
 * @param candidate - Validated package and source metadata.
 * @param target - A prepared Git commit, or undefined to inspect current version preparation.
 * @throws An Error when application code, workflow code or non-version manifest fields changed.
 *
 * @internal
 */
export function validateReleaseChanges(candidate, target) {
    const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).trim();
    const files = git('diff', '--name-only', candidate.sourceCommit, ...(target ? [target] : []))
        .split('\n')
        .filter(Boolean);
    if (!target) files.push(...git('ls-files', '--others', '--exclude-standard').split('\n').filter(Boolean));
    if (files.length === 0) throw new Error('Release preparation produced no metadata changes.');
    const manifests = new Set(['package.json', ...candidate.packages.map((item) => `${item.sourceRoot}/package.json`)]);
    const changelogs = new Set(['CHANGELOG.md', ...candidate.packages.map((item) => `${item.sourceRoot}/CHANGELOG.md`)]);
    for (const filename of new Set(files)) {
        if (manifests.has(filename)) {
            const before = JSON.parse(git('show', `${candidate.sourceCommit}:${filename}`));
            const after = JSON.parse(target ? git('show', `${target}:${filename}`) : readFileSync(filename, 'utf8'));
            const item = candidate.packages.find((pkg) => `${pkg.sourceRoot}/package.json` === filename);
            if (item && after.version !== item.version) throw new Error('Prepared package version does not match its release group.');
            if (!isDeepStrictEqual(withoutVersions(before), withoutVersions(after)))
                throw new Error('A release manifest changed fields outside version metadata.');
        } else if (filename !== 'yarn.lock' && !changelogs.has(filename) && !/^\.docs\/packages\/platform-[a-z0-9-]+\/api\/.+\.md$/u.test(filename))
            throw new Error(`Release preparation changed a non-metadata file: ${filename}`);
    }
}

function withoutVersions(manifest) {
    const normalized = structuredClone(manifest);
    delete normalized.version;
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        for (const name of Object.keys(normalized[section] ?? {})) {
            if (name.startsWith('@pixel-brewery/archipel-')) normalized[section][name] = '<release-version>';
        }
    }
    return normalized;
}
