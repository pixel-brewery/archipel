// #region Imports

import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { open, readdir, realpath } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';
import { parseArgs } from 'node:util';
import { releaseRepository } from '../.github/scripts/releaseRepository.mjs';

// #endregion

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const registry = 'https://npm.pkg.github.com';
const repository = releaseRepository.fullName;
const repositoryId = releaseRepository.id;
const organization = 'pixel-brewery';
const execute = promisify(execFile);
const versionPattern = /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/u;
const commitPattern = /^[a-f0-9]{40}$/u;
const groupProjects = {
    platform: ['libs/*', 'tools/mcp'],
    'prisma-generators': ['tools/prisma-generator-*'],
};
const jsonBudget = 4 * 1024 * 1024;
const archiveBudget = 64 * 1024 * 1024;
const archiveRedirectStatuses = new Set([301, 302, 303, 307, 308]);
const archiveRedirectFailure = 'archive redirect rejected';

/**
 * Resolves the two fixed release groups without loading Nx or installing dependencies.
 *
 * @param options Existing workspace and optional selected release-group names.
 * @returns Validated source package identities and each group's fixed version.
 * @throws When the canonical release groups or package metadata cannot be verified.
 * @internal
 */
export async function collectReleasePackages({ groups, root = workspaceRoot } = {}) {
    const canonicalRoot = await realpath(root);
    const configuration = await readJson(join(canonicalRoot, 'nx.json'));
    const selected = selectedGroups(groups);
    const packages = [];

    for (const name of selected) {
        const group = configuration?.release?.groups?.[name];
        if (
            group?.projectsRelationship !== 'fixed' ||
            !Array.isArray(group.projects) ||
            [...group.projects].sort().join('\0') !== [...groupProjects[name]].sort().join('\0')
        ) {
            throw new Error(`Release group ${name} must retain its canonical fixed package selection.`);
        }

        const roots =
            name === 'platform'
                ? [
                      ...(await readdir(join(canonicalRoot, 'libs'), { withFileTypes: true }))
                          .filter((entry) => entry.isDirectory() && /^platform-[a-z0-9-]+$/u.test(entry.name))
                          .map((entry) => `libs/${entry.name}`),
                      'tools/mcp',
                  ]
                : ['tools/prisma-generator-entities', 'tools/prisma-generator-json-schema'];
        const versions = new Set();

        for (const sourceRoot of roots.sort()) {
            const manifestPath = await realpath(join(canonicalRoot, sourceRoot, 'package.json'));
            if (!inside(canonicalRoot, manifestPath)) throw new Error('Release manifests must remain inside the workspace.');
            const manifest = await readJson(manifestPath);
            const suffix = sourceRoot === 'tools/mcp' ? 'mcp' : sourceRoot.split('/').at(-1);
            const expectedName = `@${organization}/archipel-${suffix}`;
            if (
                manifest.private === true ||
                manifest.name !== expectedName ||
                !validVersion(manifest.version) ||
                manifest.publishConfig?.registry !== registry ||
                manifest.publishConfig?.access !== 'public' ||
                !expectedRepository(manifest.repository) ||
                manifest.repository?.directory !== sourceRoot
            ) {
                throw new Error(`Release package ${sourceRoot} has inconsistent publication metadata.`);
            }
            versions.add(manifest.version);
            packages.push({ group: name, name: manifest.name, version: manifest.version, sourceRoot });
        }
        if (roots.length === 0 || versions.size !== 1) {
            throw new Error(`Release group ${name} must contain packages at one fixed version.`);
        }
    }
    if (packages.length > 64 || new Set(packages.map((pkg) => pkg.name)).size !== packages.length) {
        throw new Error('Release package identities exceed their budget or are duplicated.');
    }
    return packages;
}

/**
 * Proves public registry versions and, for a prepared candidate, the exact published archive bytes.
 *
 * @param options Optional selected groups, candidate manifest and local artifact directory.
 * @returns Completion only after every selected package satisfies the publication contract.
 * @throws Safe errors for invalid local metadata, authentication or remote publication evidence.
 * @remarks Read-only: never installs, publishes, changes credentials or changes package visibility.
 * @internal
 */
export async function verifyPublishedPackages({ groups, expectedManifest, artifactsDir, root = workspaceRoot } = {}) {
    const candidate = expectedManifest ? await readJson(resolve(expectedManifest)) : undefined;
    const selected = selectedGroups(groups ?? (candidate ? Object.keys(candidate.groups ?? {}) : undefined));
    const packages = await collectReleasePackages({ groups: selected, root });
    if (candidate) validateCandidate(candidate, packages, selected);
    if (artifactsDir && !candidate) throw new Error('Local archives require a prepared candidate manifest.');

    if (artifactsDir) {
        const directory = await realpath(artifactsDir);
        for (const pkg of candidate.packages) {
            const archive = await realpath(join(directory, pkg.filename));
            if (!inside(directory, archive)) throw new Error('Candidate archives must remain inside their artifact directory.');
            const bytes = await readBytes(archive, archiveBudget);
            if (integrity(bytes) !== pkg.integrity) throw new Error(`Local archive integrity differs for ${pkg.name}.`);
        }
    }

    let token = await authentication();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180_000);
    const results = [];
    try {
        // Two packages bound the parallel metadata and archive streams for all 28 packages.
        for (let index = 0; index < packages.length; index += 2) {
            if (controller.signal.aborted) throw new Error('Published package verification exceeded its three-minute network budget.');
            results.push(
                ...(await Promise.all(
                    packages.slice(index, index + 2).map((pkg) =>
                        verifyPackage(
                            pkg,
                            candidate?.packages.find((entry) => entry.name === pkg.name),
                            token,
                            controller.signal,
                        ),
                    ),
                )),
            );
        }
    } finally {
        clearTimeout(timer);
        controller.abort();
        token = '';
    }
    for (const result of results) {
        process.stdout.write(
            `${result.name}@${result.version}: version=${result.published ? 'present' : 'missing'}, latest=${result.latest}, visibility=${result.visibility}, source=${result.source}, archive=${result.archive}${result.failure ? `, ${result.failure}` : ''}\n`,
        );
    }
    const failures = results.filter((result) => !result.ok);
    if (failures.length) {
        throw new Error(
            `Published package verification failed for ${failures.length} of ${packages.length} packages: expected exact versions, latest tags, public Pixel Brewery visibility, repository ${repositoryId} association, matching source metadata when exposed, and verified archive integrity.`,
        );
    }
    process.stdout.write(`Verified ${packages.length} public Archipel packages in ${selected.join(', ')} against their release manifests and archive bytes.\n`);
}

function validateCandidate(candidate, packages, selected) {
    if (
        candidate.schemaVersion !== 1 ||
        candidate.repositoryId !== repositoryId ||
        candidate.repository !== repository ||
        !commitPattern.test(candidate.sourceCommit) ||
        !commitPattern.test(candidate.preparedCommit) ||
        !Array.isArray(candidate.packages) ||
        candidate.packages.length !== packages.length ||
        Object.keys(candidate.groups ?? {})
            .sort()
            .join('\0') !== [...selected].sort().join('\0') ||
        Object.keys(candidate.tags ?? {})
            .sort()
            .join('\0') !== [...selected].sort().join('\0')
    )
        throw new Error('The prepared release candidate has an invalid repository, revision or group inventory.');

    for (const group of selected) {
        const version = packages.find((pkg) => pkg.group === group)?.version;
        const tag = group === 'platform' ? `v${version}` : `prisma-generators-v${version}`;
        if (candidate.groups[group] !== version || candidate.tags[group] !== tag) {
            throw new Error(`The prepared ${group} version or tag differs from local release metadata.`);
        }
    }
    const seen = new Set();
    for (const pkg of candidate.packages) {
        const local = packages.find((entry) => entry.name === pkg?.name);
        if (
            !local ||
            seen.has(pkg.name) ||
            pkg.group !== local.group ||
            pkg.version !== local.version ||
            pkg.sourceRoot !== local.sourceRoot ||
            pkg.filename !== `${local.name.slice(1).replace('/', '-')}-${local.version}.tgz` ||
            !validIntegrity(pkg.integrity)
        )
            throw new Error('The prepared release candidate has inconsistent package or archive identities.');
        seen.add(pkg.name);
    }
}

async function verifyPackage(pkg, expected, token, signal) {
    const slug = pkg.name.slice(`@${organization}/`.length);
    const [registryResult, visibilityResult] = await Promise.all([
        fetchValue(`${registry}/${pkg.name.replace('/', '%2f')}`, token, signal),
        fetchValue(`https://api.github.com/orgs/${organization}/packages/npm/${encodeURIComponent(slug)}`, token, signal),
    ]);
    const metadata = registryResult.ok ? record(registryResult.value) : undefined;
    const version = record(record(metadata?.versions)?.[pkg.version]);
    const latest = validVersion(record(metadata?.['dist-tags'])?.latest) ? metadata['dist-tags'].latest : 'missing';
    const published = version?.name === pkg.name && version?.version === pkg.version;
    const visibilityMetadata = visibilityResult.ok ? record(visibilityResult.value) : undefined;
    const owned =
        visibilityMetadata?.name === slug &&
        visibilityMetadata.package_type === 'npm' &&
        typeof record(visibilityMetadata.owner)?.login === 'string' &&
        visibilityMetadata.owner.login.toLowerCase() === organization;
    const visibility = owned && ['public', 'private', 'internal'].includes(visibilityMetadata.visibility) ? visibilityMetadata.visibility : 'unknown';
    const association = record(visibilityMetadata?.repository);
    const associated =
        association?.id === repositoryId &&
        typeof association.full_name === 'string' &&
        association.full_name.toLowerCase() === repository &&
        association.private === false;
    const source = version?.repository === undefined ? 'not-exposed' : expectedRepository(version.repository) ? 'expected' : 'mismatch';
    const dist = record(version?.dist);
    const checksum = dist?.integrity;
    let archive = 'unverified';
    let archiveFailure;

    if (published && validIntegrity(checksum) && (!expected || checksum === expected.integrity) && validArchiveUrl(dist?.tarball)) {
        const download = await fetchValue(dist.tarball, token, signal, true);
        if (download.ok) archive = integrity(download.value) === checksum ? 'verified' : 'mismatch';
        else archiveFailure = download.failure;
    }
    return {
        ...pkg,
        published,
        latest,
        visibility,
        source: associated ? source : 'association-mismatch',
        archive,
        ok: published && latest === pkg.version && visibility === 'public' && associated && source !== 'mismatch' && archive === 'verified',
        failure: [
            ...(!registryResult.ok ? [`registry ${registryResult.failure}`] : []),
            ...(!visibilityResult.ok ? [`visibility ${visibilityResult.failure}`] : []),
            ...(archiveFailure ? [`archive ${archiveFailure}`] : []),
        ].join('; '),
    };
}

async function authentication() {
    for (const name of ['NODE_AUTH_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN']) {
        const value = process.env[name]?.trim();
        if (value) return checkedToken(value);
    }
    try {
        const result = await execute('gh', ['auth', 'token', '--hostname', 'github.com'], {
            encoding: 'utf8',
            timeout: 5000,
            killSignal: 'SIGKILL',
            maxBuffer: 16 * 1024,
            windowsHide: true,
        });
        return checkedToken(result.stdout.trim());
    } catch {
        throw new Error(
            'Package authentication is unavailable. Supply an existing NODE_AUTH_TOKEN, GH_TOKEN or GITHUB_TOKEN with package-read access, or use the active GitHub CLI account.',
        );
    }
}

function checkedToken(value) {
    if (!/^[\x21-\x7e]{1,4096}$/u.test(value)) throw new Error('The existing package authentication value is invalid.');
    return value;
}

async function fetchValue(url, token, signal, archive = false) {
    const controller = new AbortController();
    const abort = () => controller.abort();
    const timer = setTimeout(abort, 15_000);
    let reader;
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) abort();
    try {
        const rest = new URL(url).hostname === 'api.github.com';
        const response = archive
            ? await fetchArchiveResponse(url, token, controller.signal)
            : await fetch(url, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: rest ? 'application/vnd.github+json' : 'application/json',
                      'User-Agent': 'Archipel-release-verification',
                      ...(rest ? { 'X-GitHub-Api-Version': '2026-03-10' } : {}),
                  },
                  redirect: 'error',
                  signal: controller.signal,
              });
        if (!response.ok) return { ok: false, failure: `HTTP ${response.status}` };
        const budget = archive ? archiveBudget : jsonBudget;
        if (!response.body || Number(response.headers.get('content-length')) > budget)
            return { ok: false, failure: 'response exceeds its byte budget or is empty' };
        reader = response.body.getReader();
        const chunks = [];
        let length = 0;
        while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            length += chunk.value.byteLength;
            if (length > budget) return { ok: false, failure: 'response exceeds its byte budget' };
            chunks.push(chunk.value);
        }
        const bytes = Buffer.concat(chunks, length);
        return { ok: true, value: archive ? bytes : JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) };
    } catch (error) {
        return {
            ok: false,
            failure: controller.signal.aborted
                ? 'timed out or cancelled'
                : archive && error instanceof Error && error.message === archiveRedirectFailure
                  ? archiveRedirectFailure
                  : 'request or JSON validation failed',
        };
    } finally {
        clearTimeout(timer);
        controller.abort();
        reader?.releaseLock();
        signal.removeEventListener('abort', abort);
    }
}

/** Follows only registry/CDN archive redirects under the caller's existing deadline and byte budget. */
async function fetchArchiveResponse(value, token, signal) {
    let target = new URL(value);
    let retainAuthentication = true;
    for (let redirects = 0; ; redirects++) {
        const response = await fetch(target.href, {
            headers: {
                ...(retainAuthentication && target.origin === registry ? { Authorization: `Bearer ${token}` } : {}),
                Accept: 'application/octet-stream',
                'User-Agent': 'Archipel-release-verification',
            },
            redirect: 'manual',
            signal,
        });
        if (!archiveRedirectStatuses.has(response.status)) return response;
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (redirects >= 3 || typeof location !== 'string' || location.length === 0 || location.length > 8192) {
            throw new Error(archiveRedirectFailure);
        }
        let next;
        try {
            next = new URL(location, target);
        } catch {
            throw new Error(archiveRedirectFailure);
        }
        if (
            next.protocol !== 'https:' ||
            !['npm.pkg.github.com', 'pkg-npm.githubusercontent.com'].includes(next.hostname) ||
            next.port ||
            next.username ||
            next.password ||
            next.hash
        )
            throw new Error(archiveRedirectFailure);
        // Once a request crosses origins, even a redirect back to the registry stays unauthenticated.
        if (next.origin !== target.origin) retainAuthentication = false;
        target = next;
    }
}

function expectedRepository(value) {
    const source = typeof value === 'string' ? value : record(value)?.url;
    if (typeof source !== 'string') return false;
    try {
        const url = new URL(source.replace(/^git\+/u, '').replace(/^git@github\.com:/u, 'https://github.com/'));
        return (
            ['https:', 'ssh:'].includes(url.protocol) &&
            url.hostname.toLowerCase() === 'github.com' &&
            !url.port &&
            !url.password &&
            (!url.username || (url.protocol === 'ssh:' && url.username === 'git')) &&
            !url.search &&
            !url.hash &&
            url.pathname
                .replace(/\.git\/?$/u, '')
                .replace(/\/$/u, '')
                .toLowerCase() === `/${repository}`
        );
    } catch {
        return false;
    }
}

function validArchiveUrl(value) {
    if (typeof value !== 'string') return false;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === 'npm.pkg.github.com' && !url.port && !url.username && !url.password && !url.hash;
    } catch {
        return false;
    }
}

function selectedGroups(groups = Object.keys(groupProjects)) {
    const values = typeof groups === 'string' ? groups.split(',') : groups;
    if (
        !Array.isArray(values) ||
        values.length === 0 ||
        values.length > 2 ||
        new Set(values).size !== values.length ||
        values.some((name) => !Object.hasOwn(groupProjects, name))
    ) {
        throw new Error('Select platform and/or prisma-generators without unknown or duplicate release groups.');
    }
    return values;
}
function validVersion(value) {
    return typeof value === 'string' && value.length <= 128 && versionPattern.test(value);
}
function validIntegrity(value) {
    if (typeof value !== 'string' || !/^sha512-[A-Za-z0-9+/]{86}==$/u.test(value)) return false;
    return Buffer.from(value.slice(7), 'base64').length === 64;
}
function integrity(bytes) {
    return `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
}
function record(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value) ? value : undefined;
}
function inside(root, file) {
    const local = relative(root, file);
    return Boolean(local) && local !== '..' && !local.startsWith(`..${sep}`) && !isAbsolute(local);
}
async function readBytes(file, budget) {
    const handle = await open(file, 'r');
    try {
        const metadata = await handle.stat();
        if (!metadata.isFile() || metadata.size > budget) throw new Error('Release input exceeds its byte budget or is not a regular file.');
        const bytes = new Uint8Array(metadata.size + 1);
        let length = 0;
        while (length < bytes.length) {
            const result = await handle.read(bytes, length, bytes.length - length, null);
            if (!result.bytesRead) break;
            length += result.bytesRead;
        }
        if (length > metadata.size) throw new Error('Release input changed while reading.');
        return Buffer.from(bytes.subarray(0, length));
    } finally {
        await handle.close();
    }
}
async function readJson(file) {
    try {
        return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readBytes(file, 1024 * 1024)));
    } catch {
        throw new Error('Cannot read bounded JSON release metadata.');
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values } = parseArgs({ options: { groups: { type: 'string' }, 'expected-manifest': { type: 'string' }, 'artifacts-dir': { type: 'string' } } });
        await verifyPublishedPackages({ groups: values.groups, expectedManifest: values['expected-manifest'], artifactsDir: values['artifacts-dir'] });
    } catch (cause) {
        process.stderr.write(`${cause instanceof Error ? cause.message : 'Published package verification failed.'}\n`);
        process.exitCode = 1;
    }
}
