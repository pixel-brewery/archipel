// #region Imports

import { lstatSync, readFileSync } from 'node:fs';
import { releaseRepository } from './releaseRepository.mjs';

// #endregion

const sha = /^[a-f0-9]{40}$/u;
const version = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/u;

/**
 * Reads the bounded, source-bound metadata for both fixed release groups.
 *
 * @param filename - The candidate JSON file.
 * @param requirePacked - Whether every package must include its exact tarball name and SHA-512.
 * @returns Validated release metadata with exactly 26 platform and two generator packages.
 * @throws An Error for a foreign repository, invalid paths, duplicate packages or incomplete groups.
 *
 * @internal
 */
export function readReleaseCandidate(filename, requirePacked = false) {
    const stat = lstatSync(filename);
    if (!stat.isFile() || stat.size > 256 * 1024) throw new Error('Invalid release candidate metadata file.');
    const candidate = JSON.parse(readFileSync(filename, 'utf8'));
    if (
        candidate?.schemaVersion !== 1 ||
        candidate.repositoryId !== releaseRepository.id ||
        candidate.repository !== releaseRepository.fullName ||
        !sha.test(candidate.sourceCommit ?? '') ||
        !sha.test(candidate.preparedCommit ?? '') ||
        candidate.sourceCommit === candidate.preparedCommit ||
        !Array.isArray(candidate.packages) ||
        candidate.packages.length !== 28
    )
        throw new Error('Invalid source-bound release candidate identity.');

    for (const group of ['platform', 'prisma-generators']) {
        const groupVersion = candidate.groups?.[group];
        if (!version.test(groupVersion ?? '') || candidate.tags?.[group] !== `${group === 'platform' ? '' : 'prisma-generators-'}v${groupVersion}`)
            throw new Error('Invalid release group version or tag.');
    }
    if (Object.keys(candidate.groups).length !== 2 || Object.keys(candidate.tags).length !== 2) throw new Error('Unexpected release group.');

    const names = new Set();
    const roots = new Set();
    const counts = { platform: 0, 'prisma-generators': 0 };
    for (const item of candidate.packages) {
        let expectedName;
        let expectedGroup;
        if (/^libs\/platform-[a-z0-9-]+$/u.test(item?.sourceRoot ?? '')) {
            expectedName = `@pixel-brewery/archipel-${item.sourceRoot.slice('libs/'.length)}`;
            expectedGroup = 'platform';
        } else if (item?.sourceRoot === 'tools/mcp') {
            expectedName = '@pixel-brewery/archipel-mcp';
            expectedGroup = 'platform';
        } else if (/^tools\/prisma-generator-(?:entities|json-schema)$/u.test(item?.sourceRoot ?? '')) {
            expectedName = `@pixel-brewery/archipel-${item.sourceRoot.slice('tools/'.length)}`;
            expectedGroup = 'prisma-generators';
        }
        if (
            !expectedName ||
            item.name !== expectedName ||
            item.group !== expectedGroup ||
            item.version !== candidate.groups[expectedGroup] ||
            names.has(item.name) ||
            roots.has(item.sourceRoot)
        )
            throw new Error('Invalid or duplicate release package.');
        const expectedFilename = `${item.name.slice(1).replaceAll('/', '-')}-${item.version}.tgz`;
        if (
            (requirePacked || item.filename !== undefined || item.integrity !== undefined) &&
            (item.filename !== expectedFilename || !/^sha512-[A-Za-z0-9+/]{86}==$/u.test(item.integrity ?? ''))
        )
            throw new Error('Invalid packed release package identity.');
        names.add(item.name);
        roots.add(item.sourceRoot);
        counts[expectedGroup]++;
    }
    if (counts.platform !== 26 || counts['prisma-generators'] !== 2) throw new Error('Incomplete fixed release groups.');
    return candidate;
}
