// #region Imports

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { releaseRepository } from '../.github/scripts/releaseRepository.mjs';
import { collectReleasePackages, verifyPublishedPackages } from './verify-published-packages.mjs';

// #endregion

const cli = vi.hoisted(() => vi.fn());
vi.mock('node:child_process', () => {
    const execFile = vi.fn();
    execFile[Symbol.for('nodejs.util.promisify.custom')] = cli;
    return { execFile };
});
const registry = 'https://npm.pkg.github.com';
const repositoryUrl = `https://github.com/${releaseRepository.fullName}.git`;
const version = '1.2.3';
const identities = [
    { group: 'platform', name: '@pixel-brewery/archipel-platform-core', sourceRoot: 'libs/platform-core' },
    { group: 'platform', name: '@pixel-brewery/archipel-mcp', sourceRoot: 'tools/mcp' },
    { group: 'prisma-generators', name: '@pixel-brewery/archipel-prisma-generator-entities', sourceRoot: 'tools/prisma-generator-entities' },
    { group: 'prisma-generators', name: '@pixel-brewery/archipel-prisma-generator-json-schema', sourceRoot: 'tools/prisma-generator-json-schema' },
];
let root;
let metadata;
let visibility;
let archives;
let fetchMock;
let output;
let candidate;

function write(relative, value) {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
    return file;
}
function writeJson(relative, value) {
    return write(relative, JSON.stringify(value));
}
function changePackage(identity, change) {
    const file = path.join(root, identity.sourceRoot, 'package.json');
    fs.writeFileSync(file, JSON.stringify({ ...JSON.parse(fs.readFileSync(file, 'utf8')), ...change }));
}
function candidatePath() {
    return writeJson('artifacts/release-candidate.json', candidate);
}
function options() {
    return { root, expectedManifest: candidatePath(), artifactsDir: path.join(root, 'artifacts') };
}
function printed() {
    return output.mock.calls.map(([value]) => value).join('');
}

beforeEach(() => {
    vi.clearAllMocks();
    for (const name of ['NODE_AUTH_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN']) vi.stubEnv(name, '');
    vi.stubEnv('NODE_AUTH_TOKEN', 'synthetic-node-token');
    root = fs.mkdtempSync(path.join(tmpdir(), 'archipel-published-verifier-'));
    writeJson('nx.json', {
        release: {
            groups: {
                platform: { projects: ['libs/*', 'tools/mcp'], projectsRelationship: 'fixed' },
                'prisma-generators': { projects: ['tools/prisma-generator-*'], projectsRelationship: 'fixed' },
            },
        },
    });
    metadata = new Map();
    visibility = new Map();
    archives = new Map();
    candidate = {
        schemaVersion: 1,
        repositoryId: releaseRepository.id,
        repository: releaseRepository.fullName,
        sourceCommit: 'a'.repeat(40),
        preparedCommit: 'b'.repeat(40),
        groups: { platform: version, 'prisma-generators': version },
        tags: { platform: `v${version}`, 'prisma-generators': `prisma-generators-v${version}` },
        packages: [],
    };
    for (const identity of identities) {
        const manifest = {
            ...identity,
            version,
            type: 'module',
            publishConfig: { registry, access: 'public' },
            repository: { type: 'git', url: repositoryUrl, directory: identity.sourceRoot },
        };
        writeJson(`${identity.sourceRoot}/package.json`, manifest);
        const bytes = Buffer.from(`synthetic archive bytes for ${identity.name}`);
        const integrity = `sha512-${createHash('sha512').update(bytes).digest('base64')}`;
        const filename = `${identity.name.slice(1).replace('/', '-')}-${version}.tgz`;
        write(`artifacts/${filename}`, bytes);
        candidate.packages.push({ ...identity, version, filename, integrity });
        metadata.set(identity.name, {
            'dist-tags': { latest: version },
            versions: {
                [version]: {
                    name: identity.name,
                    version,
                    repository: manifest.repository,
                    dist: { integrity, tarball: `${registry}/download/${encodeURIComponent(identity.name)}/${version}/fixture` },
                },
            },
        });
        visibility.set(identity.name, {
            name: identity.name.slice('@pixel-brewery/'.length),
            package_type: 'npm',
            owner: { login: 'pixel-brewery' },
            visibility: 'public',
            repository: { id: releaseRepository.id, full_name: releaseRepository.fullName, private: false },
        });
        archives.set(identity.name, bytes);
    }
    cli.mockResolvedValue({ stdout: 'synthetic-cli-token\n', stderr: '' });
    fetchMock = vi.fn(async (url) => {
        const endpoint = new URL(url);
        if (endpoint.hostname === 'api.github.com') {
            const name = `@pixel-brewery/${decodeURIComponent(endpoint.pathname.split('/').at(-1))}`;
            return new Response(JSON.stringify(visibility.get(name)), { headers: { 'content-type': 'application/json' } });
        }
        if (endpoint.pathname.startsWith('/download/')) {
            const name = decodeURIComponent(endpoint.pathname.split('/')[2]);
            return new Response(archives.get(name));
        }
        const name = decodeURIComponent(endpoint.pathname.slice(1));
        return new Response(JSON.stringify(metadata.get(name)), { headers: { 'content-type': 'application/json' } });
    });
    vi.stubGlobal('fetch', fetchMock);
    output = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
});

afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fs.rmSync(root, { recursive: true, force: true });
});

describe('canonical release inventory without Nx dependencies', () => {
    it('includes both generators and the MCP alongside all platform libraries', async () => {
        // Arrange
        const selected = { root };
        // Act
        const packages = await collectReleasePackages(selected);
        // Assert
        expect(packages.map(({ group, name }) => ({ group, name }))).toEqual(identities.map(({ group, name }) => ({ group, name })));
        expect(fetchMock).not.toHaveBeenCalled();
        expect(cli).not.toHaveBeenCalled();
    });

    it('honors a selected fixed group without accidentally verifying another version family', async () => {
        // Arrange
        changePackage(identities[0], { version: '1.2.4' });
        changePackage(identities[1], { version: '1.2.4' });
        // Act
        const packages = await collectReleasePackages({ root, groups: ['prisma-generators'] });
        // Assert
        expect(packages).toHaveLength(2);
        expect(packages.every((entry) => entry.version === version && entry.group === 'prisma-generators')).toBe(true);
    });

    it('rejects divergent versions inside one fixed family', async () => {
        // Arrange
        changePackage(identities[0], { version: '1.2.4' });
        // Act
        const result = collectReleasePackages({ root });
        // Assert
        await expect(result).rejects.toThrow('one fixed version');
    });

    it.each([
        { private: true },
        { name: '@foreign-owner/replacement' },
        { publishConfig: { registry: 'https://foreign.invalid', access: 'public' } },
        { repository: { url: 'https://github.com/former-owner/archipel', directory: 'libs/platform-core' } },
        { repository: { url: repositoryUrl, directory: 'another/directory' } },
    ])('rejects inconsistent local publication metadata before credential access: %j', async (change) => {
        // Arrange
        changePackage(identities[0], change);
        // Act
        const result = verifyPublishedPackages({ root });
        // Assert
        await expect(result).rejects.toThrow('inconsistent publication metadata');
        expect(fetchMock).not.toHaveBeenCalled();
        expect(cli).not.toHaveBeenCalled();
    });
});

describe('exact public registry publication', () => {
    it('verifies exact prepared versions, ACL, repository identity and local plus downloaded archive hashes', async () => {
        // Arrange
        const selected = options();
        // Act
        await verifyPublishedPackages(selected);
        // Assert
        expect(printed()).toContain('Verified 4 public Archipel packages');
        expect(fetchMock).toHaveBeenCalledTimes(12);
        expect(cli).not.toHaveBeenCalled();
        for (const [url, request] of fetchMock.mock.calls)
            expect(request).toMatchObject({
                redirect: new URL(url).pathname.startsWith('/download/') ? 'manual' : 'error',
                headers: { Authorization: 'Bearer synthetic-node-token' },
            });
        expect(printed()).not.toContain('synthetic-node-token');
    });

    it('also verifies archive bytes during read-only checks without a prepared candidate', async () => {
        // Arrange
        const selected = { root };
        // Act
        await verifyPublishedPackages(selected);
        // Assert
        expect(printed()).toContain('archive=verified');
        expect(fetchMock).toHaveBeenCalledTimes(12);
    });

    it.each(['private', 'foreign-owner', 'missing-version', 'different-latest', 'foreign-repository-id', 'foreign-repository-name', 'private-repository'])(
        'rejects insufficient publication evidence: %s',
        async (failure) => {
            // Arrange
            const name = identities[0].name;
            if (failure === 'private') visibility.get(name).visibility = 'private';
            if (failure === 'foreign-owner') visibility.get(name).owner.login = 'foreign-owner';
            if (failure === 'missing-version') delete metadata.get(name).versions[version];
            if (failure === 'different-latest') metadata.get(name)['dist-tags'].latest = '1.2.4';
            if (failure === 'foreign-repository-id') visibility.get(name).repository.id += 1;
            if (failure === 'foreign-repository-name') visibility.get(name).repository.full_name = 'foreign-owner/archipel';
            if (failure === 'private-repository') visibility.get(name).repository.private = true;
            // Act
            const result = verifyPublishedPackages(options());
            // Assert
            await expect(result).rejects.toThrow('Published package verification failed');
            expect(printed()).not.toContain('Verified 4');
        },
    );

    it('rejects altered downloaded bytes even when the registry metadata claims the expected integrity', async () => {
        // Arrange
        archives.set(identities[0].name, Buffer.from('different unverified bytes'));
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('archive integrity');
        expect(printed()).toContain('archive=mismatch');
    });

    it('rejects changed local artifact bytes before reading credentials or making requests', async () => {
        // Arrange
        write(`artifacts/${candidate.packages[0].filename}`, 'modified local bytes');
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Local archive integrity differs');
        expect(fetchMock).not.toHaveBeenCalled();
        expect(cli).not.toHaveBeenCalled();
    });

    it.each(['https://foreign.invalid/archive.tgz', 'https://synthetic-private-value@npm.pkg.github.com/archive.tgz', 'http://npm.pkg.github.com/archive.tgz'])(
        'does not send credentials to an invalid archive origin: %s',
        async (url) => {
            // Arrange
            metadata.get(identities[0].name).versions[version].dist.tarball = url;
            // Act
            const result = verifyPublishedPackages(options());
            // Assert
            await expect(result).rejects.toThrow('Published package verification failed');
            expect(fetchMock.mock.calls.some(([request]) => request === url)).toBe(false);
            expect(printed()).not.toContain(url);
            expect(printed()).not.toContain('synthetic-private-value');
        },
    );

    it('never prints credentialed or foreign source URLs from registry metadata', async () => {
        // Arrange
        metadata.get(identities[0].name).versions[version].repository.url = 'https://synthetic-private-value@github.com/foreign-owner/archipel';
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(printed()).toContain('source=mismatch');
        expect(printed()).not.toContain('synthetic-private-value');
    });

    it('sanitizes failed requests and never includes transport diagnostics or credentials', async () => {
        // Arrange
        fetchMock.mockRejectedValue(new Error('synthetic-private-value from transport'));
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(printed()).toContain('request or JSON validation failed');
        expect(printed()).not.toContain('synthetic-private-value');
    });

    it('rejects metadata exceeding its advertised byte budget', async () => {
        // Arrange
        fetchMock.mockResolvedValueOnce(new Response('{}', { headers: { 'content-length': String(4 * 1024 * 1024 + 1) } }));
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(printed()).toContain('byte budget');
    });

    it.each([
        (value) => {
            value.repositoryId += 1;
        },
        (value) => {
            value.preparedCommit = 'invalid';
        },
        (value) => {
            value.packages[0].filename = '../outside.tgz';
        },
        (value) => {
            value.packages[0].integrity = 'sha1-unacceptable';
        },
        (value) => {
            value.packages[0].name = value.packages[1].name;
        },
        (value) => {
            value.tags.platform = 'v1.2.4';
        },
    ])('rejects a candidate identity or integrity mismatch before network access', async (change) => {
        // Arrange
        change(candidate);
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow(/prepared/iu);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it.each([
        { values: [' synthetic-node-token ', 'synthetic-gh-token', 'synthetic-github-token'], expected: 'synthetic-node-token' },
        { values: [' ', ' synthetic-gh-token ', 'synthetic-github-token'], expected: 'synthetic-gh-token' },
        { values: ['', '', ' synthetic-github-token '], expected: 'synthetic-github-token' },
    ])('uses existing environment authentication without selecting an account: $expected', async ({ values, expected }) => {
        // Arrange
        ['NODE_AUTH_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'].forEach((name, index) => vi.stubEnv(name, values[index]));
        // Act
        await verifyPublishedPackages({ root });
        // Assert
        expect(cli).not.toHaveBeenCalled();
        expect(fetchMock.mock.calls.every(([, request]) => request.headers.Authorization === `Bearer ${expected}`)).toBe(true);
        expect(printed()).not.toContain(expected);
    });

    it('uses the active GitHub CLI account only as a bounded fallback', async () => {
        // Arrange
        vi.stubEnv('NODE_AUTH_TOKEN', '');
        // Act
        await verifyPublishedPackages({ root });
        // Assert
        expect(cli).toHaveBeenCalledExactlyOnceWith(
            'gh',
            ['auth', 'token', '--hostname', 'github.com'],
            expect.objectContaining({ timeout: 5000, killSignal: 'SIGKILL', maxBuffer: 16 * 1024 }),
        );
        expect(printed()).not.toContain('synthetic-cli-token');
    });
});

describe('bounded GitHub archive redirects', () => {
    it.each([302, 303])('downloads a verified CDN archive after HTTP %s without forwarding the registry token', async (status) => {
        // Arrange
        const name = identities[0].name;
        const initial = metadata.get(name).versions[version].dist.tarball;
        const destination = 'https://pkg-npm.githubusercontent.com/npmregistryv2prod/blobs/fixture?sig=synthetic-private-location';
        const original = fetchMock.getMockImplementation();
        const cancel = vi.fn();
        fetchMock.mockImplementation(async (url, request) => {
            if (url === initial) return new Response(new ReadableStream({ cancel }), { status, headers: { location: destination } });
            if (url === destination) return new Response(archives.get(name));
            return original(url, request);
        });
        // Act
        await verifyPublishedPackages(options());
        // Assert
        expect(cancel).toHaveBeenCalledOnce();
        const registryCall = fetchMock.mock.calls.find(([url]) => url === initial);
        const cdnCall = fetchMock.mock.calls.find(([url]) => url === destination);
        expect(registryCall[1].headers.Authorization).toBe('Bearer synthetic-node-token');
        expect(cdnCall[1].headers).not.toHaveProperty('Authorization');
        expect(cdnCall[1].redirect).toBe('manual');
        expect(printed()).toContain('Verified 4 public Archipel packages');
        expect(printed()).not.toContain('synthetic-private-location');
    });

    it('allows three redirects under one signal and never restores authentication after crossing origins', async () => {
        // Arrange
        const name = identities[0].name;
        const initial = metadata.get(name).versions[version].dist.tarball;
        const first = 'https://pkg-npm.githubusercontent.com/npmregistryv2prod/first';
        const second = 'https://pkg-npm.githubusercontent.com/npmregistryv2prod/second';
        const last = 'https://npm.pkg.github.com/download/anonymous-fixture';
        const chain = [initial, first, second, last];
        const original = fetchMock.getMockImplementation();
        let cancelled = 0;
        fetchMock.mockImplementation(async (url, request) => {
            const index = chain.indexOf(url);
            if (index < 0) return original(url, request);
            if (index === 3) return new Response(archives.get(name));
            return new Response(
                new ReadableStream({
                    cancel: () => {
                        cancelled++;
                    },
                }),
                { status: 302, headers: { location: chain[index + 1] } },
            );
        });
        // Act
        await verifyPublishedPackages(options());
        // Assert
        const calls = fetchMock.mock.calls.filter(([url]) => chain.includes(url));
        expect(calls.map(([url]) => url)).toEqual(chain);
        expect(calls[0][1].headers.Authorization).toBe('Bearer synthetic-node-token');
        expect(calls.slice(1).every(([, request]) => !Object.hasOwn(request.headers, 'Authorization'))).toBe(true);
        expect(new Set(calls.map(([, request]) => request.signal)).size).toBe(1);
        expect(cancelled).toBe(3);
    });

    it.each([
        'https://foreign.invalid/archive.tgz?sig=synthetic-private-location',
        'https://pkg-npm.githubusercontent.com.foreign.invalid/archive.tgz',
        'http://pkg-npm.githubusercontent.com/archive.tgz',
        'https://pkg-npm.githubusercontent.com:444/archive.tgz',
        'https://synthetic-user:synthetic-password@pkg-npm.githubusercontent.com/archive.tgz',
        'https://npm.pkg.github.com:444/archive.tgz',
        'https://pkg-npm.githubusercontent.com/archive.tgz#synthetic-private-location',
        'https://s3.amazonaws.com/archive.tgz',
        'https://npmregistryv2prod.blob.core.windows.net/archive.tgz',
    ])('rejects an unapproved archive redirect before requesting its destination: %s', async (destination) => {
        // Arrange
        const initial = metadata.get(identities[0].name).versions[version].dist.tarball;
        const original = fetchMock.getMockImplementation();
        const cancel = vi.fn();
        fetchMock.mockImplementation(async (url, request) =>
            url === initial ? new Response(new ReadableStream({ cancel }), { status: 302, headers: { location: destination } }) : original(url, request),
        );
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(cancel).toHaveBeenCalledOnce();
        expect(fetchMock.mock.calls.some(([url]) => url === destination)).toBe(false);
        expect(printed()).toContain('archive redirect rejected');
        expect(printed()).not.toContain(destination);
        expect(printed()).not.toContain('synthetic-private-location');
        expect(printed()).not.toContain('synthetic-password');
    });

    it('stops redirect loops after four requests and cancels every discarded body', async () => {
        // Arrange
        const initial = metadata.get(identities[0].name).versions[version].dist.tarball;
        const original = fetchMock.getMockImplementation();
        let cancelled = 0;
        fetchMock.mockImplementation(async (url, request) =>
            url === initial
                ? new Response(
                      new ReadableStream({
                          cancel: () => {
                              cancelled++;
                          },
                      }),
                      { status: 302, headers: { location: initial } },
                  )
                : original(url, request),
        );
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(fetchMock.mock.calls.filter(([url]) => url === initial)).toHaveLength(4);
        expect(cancelled).toBe(4);
    });

    it('does not follow redirects for registry or GitHub JSON metadata', async () => {
        // Arrange
        const destination = 'https://pkg-npm.githubusercontent.com/unexpected-metadata';
        const original = fetchMock.getMockImplementation();
        fetchMock.mockImplementation(async (url, request) =>
            new URL(url).pathname.startsWith('/download/') ? original(url, request) : new Response('{}', { status: 302, headers: { location: destination } }),
        );
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(fetchMock.mock.calls.some(([url]) => url === destination)).toBe(false);
        expect(fetchMock.mock.calls.every(([, request]) => request.redirect === 'error')).toBe(true);
    });

    it('retains the archive byte budget after a CDN redirect', async () => {
        // Arrange
        const initial = metadata.get(identities[0].name).versions[version].dist.tarball;
        const destination = 'https://pkg-npm.githubusercontent.com/npmregistryv2prod/oversized';
        const original = fetchMock.getMockImplementation();
        fetchMock.mockImplementation(async (url, request) => {
            if (url === initial) return new Response(null, { status: 302, headers: { location: destination } });
            if (url === destination) return new Response('synthetic bytes', { headers: { 'content-length': String(64 * 1024 * 1024 + 1) } });
            return original(url, request);
        });
        // Act
        const result = verifyPublishedPackages(options());
        // Assert
        await expect(result).rejects.toThrow('Published package verification failed');
        expect(printed()).toContain('byte budget');
    });

    it('does not reset its fifteen-second deadline between registry and CDN requests', async () => {
        // Arrange
        vi.useFakeTimers();
        const initial = metadata.get(identities[0].name).versions[version].dist.tarball;
        const destination = 'https://pkg-npm.githubusercontent.com/npmregistryv2prod/stalled?sig=synthetic-private-location';
        const original = fetchMock.getMockImplementation();
        let releaseRegistry;
        let registrySignal;
        let cdnSignal;
        let registryReady;
        let cdnReady;
        const registryStarted = new Promise((resolve) => {
            registryReady = resolve;
        });
        const cdnStarted = new Promise((resolve) => {
            cdnReady = resolve;
        });
        fetchMock.mockImplementation(async (url, request) => {
            if (url === initial) {
                registrySignal = request.signal;
                registryReady();
                return new Promise((resolve, reject) => {
                    releaseRegistry = () => resolve(new Response(null, { status: 302, headers: { location: destination } }));
                    request.signal.addEventListener('abort', () => reject(new Error('synthetic-private-location')));
                });
            }
            if (url === destination) {
                cdnSignal = request.signal;
                cdnReady();
                return new Promise((_, reject) => request.signal.addEventListener('abort', () => reject(new Error('synthetic-private-location'))));
            }
            return original(url, request);
        });
        const result = verifyPublishedPackages(options());
        const settled = result.catch((error) => error);
        await registryStarted;
        await vi.advanceTimersByTimeAsync(10_000);
        releaseRegistry();
        await cdnStarted;
        // Act
        await vi.advanceTimersByTimeAsync(5_000);
        // Assert
        expect(await settled).toBeInstanceOf(Error);
        expect(cdnSignal).toBe(registrySignal);
        expect(cdnSignal.aborted).toBe(true);
        expect(printed()).toContain('timed out or cancelled');
        expect(printed()).not.toContain('synthetic-private-location');
    });
});
