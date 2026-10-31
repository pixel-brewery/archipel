import { afterEach, describe, expect, it, vi } from 'vitest';
import { join } from 'node:path';
import { publishReleaseCandidate } from './publishReleaseCandidate.mjs';
import { releaseRepository } from './releaseRepository.mjs';

const sourceCommit = 'a'.repeat(40);
const preparedCommit = 'b'.repeat(40);
const context = { repository: releaseRepository.fullName, repositoryId: releaseRepository.id, defaultBranch: 'main', ref: 'refs/heads/main', sourceCommit };
function controlled({ alreadyPushed = false, main = undefined, existing = undefined } = {}) {
    const candidate = {
        sourceCommit,
        preparedCommit,
        tags: { platform: 'v0.1.24', 'prisma-generators': 'prisma-generators-v0.1.24' },
        groups: { platform: '0.1.24', 'prisma-generators': '0.1.24' },
        packages: [{ name: '@pixel-brewery/archipel-platform-core', version: '0.1.24', filename: 'core.tgz', integrity: 'sha512-verified' }],
    };
    let pushed = alreadyPushed;
    const git = vi.fn((args) => {
        if (args[0] === 'remote') return `https://github.com/${releaseRepository.fullName}.git`;
        if (args[0] === 'ls-remote')
            return [
                `${main ?? (pushed ? preparedCommit : sourceCommit)}\trefs/heads/main`,
                ...(pushed
                    ? Object.values(candidate.tags).flatMap((tag) => [`${'c'.repeat(40)}\trefs/tags/${tag}`, `${preparedCommit}\trefs/tags/${tag}^{}`])
                    : []),
            ].join('\n');
        if (args[0] === 'rev-parse') return 'c'.repeat(40);
        if (args.includes('push')) {
            pushed = true;
            return '';
        }
        throw new Error('Unexpected Git boundary.');
    });
    const request = vi.fn(async (method, endpoint, body) => {
        if (endpoint === `repositories/${releaseRepository.id}`)
            return { ...releaseRepository, full_name: releaseRepository.fullName, default_branch: 'main', fork: false, private: false, visibility: 'public' };
        if (method === 'GET' && endpoint.includes('/releases?')) return existing ? [existing] : [];
        if (method === 'POST') return { ...body, draft: false, prerelease: false };
        throw new Error('Unexpected REST boundary.');
    });
    return {
        context,
        request,
        git,
        verify: vi.fn().mockReturnValue(candidate),
        pushToken: 'synthetic-job-token',
        registry: vi.fn().mockResolvedValue(undefined),
        publish: vi.fn(),
        candidate,
    };
}

describe('publishReleaseCandidate', () => {
    it('preflights a fresh main without performing any durable write', async () => {
        // Arrange
        const boundary = controlled();
        // Act
        const result = await publishReleaseCandidate('preflight', '/artifact', boundary);
        // Assert
        expect(result).toEqual({ status: 'ready', needsPush: true });
        expect(boundary.git.mock.calls.some(([args]) => args.includes('push'))).toBe(false);
        expect(boundary.publish).not.toHaveBeenCalled();
    });
    it('uses one atomic fast-forward push for main and both exact release tags', async () => {
        // Arrange
        const boundary = controlled();
        // Act
        const result = await publishReleaseCandidate('push', '/artifact', boundary);
        // Assert
        expect(result.status).toBe('pushed');
        const writes = boundary.git.mock.calls.filter(([args]) => args.includes('push'));
        expect(writes).toHaveLength(1);
        expect(writes[0][0]).toEqual([
            '-c',
            expect.stringContaining('AUTHORIZATION: basic '),
            'push',
            '--atomic',
            'origin',
            `${preparedCommit}:refs/heads/main`,
            'refs/tags/v0.1.24',
            'refs/tags/prisma-generators-v0.1.24',
        ]);
        expect(writes[0][0].join(' ')).not.toContain('synthetic-job-token');
    });
    it('resumes the same already-pushed candidate without minting or using another App token', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        boundary.pushToken = undefined;
        // Act
        const result = await publishReleaseCandidate('push', '/artifact', boundary);
        // Assert
        expect(result.status).toBe('pushed');
        expect(boundary.git.mock.calls.some(([args]) => args.includes('push'))).toBe(false);
    });
    it('rejects a newer main before any publication or push', async () => {
        // Arrange
        const boundary = controlled({ main: 'd'.repeat(40) });
        // Act / Assert
        await expect(publishReleaseCandidate('push', '/artifact', boundary)).rejects.toThrow('Main or a release tag changed');
        expect(boundary.publish).not.toHaveBeenCalled();
        expect(boundary.git.mock.calls.some(([args]) => args.includes('push'))).toBe(false);
    });
    it('requires durable tags before attempting registry writes', async () => {
        // Arrange
        const boundary = controlled();
        // Act / Assert
        await expect(publishReleaseCandidate('packages', '/artifact', boundary)).rejects.toThrow('durable metadata');
        expect(boundary.registry).not.toHaveBeenCalled();
        expect(boundary.publish).not.toHaveBeenCalled();
    });
    it('publishes each absent verified tarball exactly once', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        // Act
        const result = await publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        expect(result).toEqual({ status: 'packages-published', uploaded: 1 });
        expect(boundary.publish).toHaveBeenCalledExactlyOnceWith(join('/artifact', 'core.tgz'));
    });
    it('skips immutable versions only when their integrity matches the verified candidate', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        boundary.registry.mockResolvedValue({ ...boundary.candidate.packages[0], dist: { integrity: 'sha512-verified' } });
        // Act
        const result = await publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        expect(result.uploaded).toBe(0);
        expect(boundary.publish).not.toHaveBeenCalled();
    });
    it('fails before any upload if an existing version has different bytes', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        boundary.registry.mockResolvedValue({ ...boundary.candidate.packages[0], dist: { integrity: 'sha512-tampered' } });
        // Act / Assert
        await expect(publishReleaseCandidate('packages', '/artifact', boundary)).rejects.toThrow('differs');
        expect(boundary.publish).not.toHaveBeenCalled();
    });
    it('creates two announcements while keeping the platform group as the default latest release', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        // Act
        const result = await publishReleaseCandidate('releases', '/artifact', boundary);
        // Assert
        expect(result.status).toBe('releases-published');
        const writes = boundary.request.mock.calls.filter(([method]) => method === 'POST');
        expect(writes.map(([, , body]) => [body.tag_name, body.make_latest, body.target_commitish])).toEqual([
            ['v0.1.24', 'true', preparedCommit],
            ['prisma-generators-v0.1.24', 'false', preparedCommit],
        ]);
    });
    it('fails closed before opening artifacts when the repository has not completed the public cutover', async () => {
        // Arrange
        const boundary = controlled();
        boundary.context = { ...context, repository: 'former-owner/archipel' };
        // Act / Assert
        await expect(publishReleaseCandidate('push', '/artifact', boundary)).rejects.toThrow('immutable public');
        expect(boundary.verify).not.toHaveBeenCalled();
        expect(boundary.git).not.toHaveBeenCalled();
    });
});

afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
});

function registryResponse(chunks, { declaredLength = null, status = 200 } = {}) {
    const read = vi.fn();
    for (const value of chunks) read.mockResolvedValueOnce({ done: false, value });
    read.mockResolvedValue({ done: true });
    const releaseLock = vi.fn();
    const reader = { read, releaseLock };
    const getReader = vi.fn().mockReturnValue(reader);
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: new Headers(declaredLength === null ? {} : { 'content-length': declaredLength }),
        body: { getReader },
        reader,
    };
}

describe('publishReleaseCandidate registry response boundary', () => {
    it('reads the existing version through the bounded stream and leaves its immutable bytes unchanged', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        delete boundary.registry;
        const item = boundary.candidate.packages[0];
        const metadata = { name: item.name, versions: { [item.version]: { name: item.name, version: item.version, dist: { integrity: item.integrity } } } };
        const response = registryResponse([Buffer.from(JSON.stringify(metadata))]);
        const fetch = vi.fn().mockResolvedValue(response);
        vi.stubGlobal('fetch', fetch);
        vi.stubEnv('NODE_AUTH_TOKEN', 'synthetic-registry-token');
        // Act
        const result = await publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        expect(result.uploaded).toBe(0);
        expect(boundary.publish).not.toHaveBeenCalled();
        expect(response.reader.releaseLock).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][1]).toMatchObject({ redirect: 'error', headers: { Authorization: 'Bearer synthetic-registry-token' } });
        expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    });

    it('stops reading at the chunk budget before parsing or uploading any package', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        delete boundary.registry;
        const response = registryResponse([Buffer.alloc(4 * 1024 * 1024), Buffer.from('x'), Buffer.from('must not be consumed')]);
        const fetch = vi.fn().mockResolvedValue(response);
        vi.stubGlobal('fetch', fetch);
        vi.stubEnv('NODE_AUTH_TOKEN', 'synthetic-registry-token');
        // Act
        const result = publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        await expect(result).rejects.toThrow('Could not inspect bounded registry metadata');
        expect(response.reader.read).toHaveBeenCalledTimes(2);
        expect(response.reader.releaseLock).toHaveBeenCalledTimes(1);
        expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
        expect(boundary.publish).not.toHaveBeenCalled();
    });

    it('rejects an oversized declared length before acquiring a response reader', async () => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        delete boundary.registry;
        const response = registryResponse([], { declaredLength: String(4 * 1024 * 1024 + 1) });
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
        vi.stubEnv('NODE_AUTH_TOKEN', 'synthetic-registry-token');
        // Act
        const result = publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        await expect(result).rejects.toThrow('Could not inspect bounded registry metadata');
        expect(response.body.getReader).not.toHaveBeenCalled();
        expect(boundary.publish).not.toHaveBeenCalled();
    });

    it.each([
        '{"private-fixture":"synthetic-registry-response-secret", invalid}',
        '{"name":"another-package","versions":{}}',
        '{"name":"@pixel-brewery/archipel-platform-core","versions":{"0.1.24":false}}',
    ])('normalizes malformed JSON and version metadata without exposing response content', async (body) => {
        // Arrange
        const boundary = controlled({ alreadyPushed: true });
        delete boundary.registry;
        const response = registryResponse([Buffer.from(body)]);
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
        vi.stubEnv('NODE_AUTH_TOKEN', 'synthetic-registry-token');
        // Act
        const result = publishReleaseCandidate('packages', '/artifact', boundary);
        // Assert
        await expect(result).rejects.toThrow('Could not inspect bounded registry metadata before publication.');
        await expect(result).rejects.not.toThrow('synthetic-registry-response-secret');
        expect(response.reader.releaseLock).toHaveBeenCalledTimes(1);
        expect(boundary.publish).not.toHaveBeenCalled();
    });
});
