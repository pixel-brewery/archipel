// #region Imports

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual, parseArgs } from 'node:util';
import { verifyPackedFileList } from '../../tools/verify-esm-packages.mjs';
import { collectReleasePackages } from '../../tools/verify-published-packages.mjs';
import { readReleaseCandidate } from './readReleaseCandidate.mjs';
import { verifyReleaseCandidate } from './verifyReleaseCandidate.mjs';

// #endregion

/**
 * Packs each verified build once and binds the publisher's exact tarball bytes to the prepared commit.
 *
 * @param candidateFilename - The previously verified prepared metadata file.
 * @param directory - An empty CI temporary output directory.
 * @returns Complete metadata including every tarball's immutable SHA-512 identity.
 * @remarks Uses npm pack with lifecycle scripts disabled and validates its actual packed file inventory.
 *
 * @internal
 */
export async function packReleaseArtifacts(candidateFilename, directory) {
    const candidate = verifyReleaseCandidate(dirname(candidateFilename), { sourceCommit: process.env.RELEASE_SOURCE_COMMIT ?? process.env.GITHUB_SHA });
    const packages = await collectReleasePackages({ groups: ['platform', 'prisma-generators'] });
    if (!isDeepStrictEqual(packages, candidate.packages)) throw new Error('Prepared package inventory changed before packing.');
    mkdirSync(directory, { recursive: true });
    if (readdirSync(directory).length !== 0) throw new Error('Release package output directory must be empty.');
    for (const item of candidate.packages) {
        const packageRoot = resolve('dist', item.sourceRoot);
        const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
        if (manifest.name !== item.name || manifest.version !== item.version) throw new Error('Built package does not match the prepared version.');
        const output = JSON.parse(
            execFileSync('npm', ['pack', packageRoot, '--ignore-scripts', '--json', '--pack-destination', resolve(directory)], {
                encoding: 'utf8',
                maxBuffer: 8 * 1024 * 1024,
                timeout: 120_000,
            }),
        );
        if (!Array.isArray(output) || output.length !== 1 || output[0].name !== item.name || output[0].version !== item.version)
            throw new Error('npm pack did not confirm the expected package.');
        const packed = output[0];
        const expectedFilename = `${item.name.slice(1).replaceAll('/', '-')}-${item.version}.tgz`;
        if (packed.filename !== expectedFilename || !Array.isArray(packed.files)) throw new Error('Unexpected packed filename or file inventory.');
        verifyPackedFileList(
            manifest,
            packed.files.map((file) => file.path),
            { packageRoot },
        );
        const filename = join(directory, packed.filename);
        if (!lstatSync(filename).isFile()) throw new Error('Packed output is not a regular file.');
        const integrity = `sha512-${createHash('sha512').update(readFileSync(filename)).digest('base64')}`;
        if (integrity !== packed.integrity) throw new Error('Packed bytes do not match npm integrity metadata.');
        item.filename = packed.filename;
        item.integrity = integrity;
    }
    copyFileSync(join(dirname(candidateFilename), 'release.bundle'), join(directory, 'release.bundle'));
    writeFileSync(join(directory, 'release-candidate.json'), `${JSON.stringify(candidate, null, 2)}\n`);
    return readReleaseCandidate(join(directory, 'release-candidate.json'), true);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values } = parseArgs({ options: { candidate: { type: 'string' }, 'output-dir': { type: 'string' } } });
        const candidate = await packReleaseArtifacts(values.candidate, values['output-dir']);
        process.stdout.write(`Packed and verified all ${candidate.packages.length} release artifacts.\n`);
    } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : 'Release packing failed.'}\n`);
        process.exitCode = 1;
    }
}
