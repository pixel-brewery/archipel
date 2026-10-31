// #region Imports

import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { requestDependabotGitHub } from './requestDependabotGitHub.mjs';
import { resolveDependabotRepository } from './resolveDependabotRepository.mjs';
import { verifyReleaseCandidate } from './verifyReleaseCandidate.mjs';

// #endregion

/**
 * Publishes one verified two-group candidate with explicit, repeatable durable stages.
 *
 * @param action - preflight, push, packages or releases.
 * @param directory - The current run's fully verified release artifact.
 * @param dependencies - Optional Git, REST, registry and npm boundaries for offline verification.
 * @returns Stage completion and whether the atomic metadata push is still required.
 * @remarks App credentials are used only for the atomic main/tag push. Partial registry uploads can resume the same run's failed publication job without incrementing or replacing any version.
 *
 * @internal
 */
export async function publishReleaseCandidate(action, directory, dependencies = {}) {
    if (!['preflight', 'push', 'packages', 'releases'].includes(action)) throw new Error('Unsupported release publication stage.');
    const context = dependencies.context ?? {
        repository: process.env.GITHUB_REPOSITORY,
        repositoryId: process.env.GITHUB_REPOSITORY_ID,
        defaultBranch: 'main',
        ref: process.env.GITHUB_REF,
        sourceCommit: process.env.GITHUB_SHA,
    };
    const request = dependencies.request ?? requestDependabotGitHub;
    const identity = await resolveDependabotRepository(context, request);
    if (!identity || context.ref !== 'refs/heads/main') throw new Error('Publication requires the immutable public repository on main.');
    const candidate = (dependencies.verify ?? verifyReleaseCandidate)(directory, { sourceCommit: context.sourceCommit, requirePacked: true });
    const git = dependencies.git ?? runGit;
    const expectedOrigin = `https://github.com/${identity.fullName}`;
    if (![expectedOrigin, `${expectedOrigin}.git`].includes(git(['remote', 'get-url', 'origin'])))
        throw new Error('Release origin does not match the canonical repository.');
    const state = inspectRemote(candidate, git);
    if (action === 'preflight') return { status: 'ready', needsPush: state.needsPush };

    if (action === 'push') {
        if (state.needsPush) {
            const token = dependencies.pushToken ?? process.env.RELEASE_PUSH_TOKEN;
            if (!token) throw new Error('The release App push token is required.');
            const authHeader = Buffer.from(`x-access-token:${token}`).toString('base64');
            if (!dependencies.git) process.stdout.write(`::add-mask::${authHeader}\n`);
            git([
                '-c',
                `http.https://github.com/.extraheader=AUTHORIZATION: basic ${authHeader}`,
                'push',
                '--atomic',
                'origin',
                `${candidate.preparedCommit}:refs/heads/main`,
                ...Object.values(candidate.tags).map((tag) => `refs/tags/${tag}`),
            ]);
            if (inspectRemote(candidate, git).needsPush) throw new Error('GitHub did not confirm the atomic release push.');
        }
        return { status: 'pushed', needsPush: false };
    }
    if (state.needsPush) throw new Error('Packages and announcements require the durable metadata commit and both release tags.');

    if (action === 'packages') {
        const registry = dependencies.registry ?? readRegistryVersion;
        const publish = dependencies.publish ?? publishTarball;
        let uploaded = 0;
        const pending = [];
        for (const item of candidate.packages) {
            const existing = await registry(item);
            if (existing) {
                if (existing.name !== item.name || existing.version !== item.version || existing.dist?.integrity !== item.integrity)
                    throw new Error('An existing package version differs from the verified release artifact.');
                continue;
            }
            pending.push(item);
        }
        for (const item of pending) {
            await publish(join(directory, item.filename));
            uploaded++;
        }
        return { status: 'packages-published', uploaded };
    }

    for (const group of ['platform', 'prisma-generators']) {
        const tag = candidate.tags[group];
        const releases = await releaseForTag(request, identity.path, tag);
        if (releases) {
            if (releases.target_commitish !== candidate.preparedCommit || releases.draft !== false || releases.prerelease !== false)
                throw new Error('An existing GitHub Release does not match the verified candidate.');
            continue;
        }
        const result = await request('POST', `${identity.path}/releases`, {
            tag_name: tag,
            target_commitish: candidate.preparedCommit,
            name: `Archipel ${group === 'platform' ? 'platform' : 'Prisma generators'} ${candidate.groups[group]}`,
            body: `Verified ${group} packages from the source revision ${candidate.sourceCommit}.\n\nInstall the exact ${candidate.groups[group]} package versions from GitHub Packages.`,
            draft: false,
            prerelease: false,
            make_latest: group === 'platform' ? 'true' : 'false',
        });
        if (result?.tag_name !== tag || result?.draft !== false || result?.prerelease !== false)
            throw new Error('GitHub did not confirm the release announcement.');
    }
    return { status: 'releases-published' };
}

function inspectRemote(candidate, git) {
    const names = Object.values(candidate.tags).map((tag) => `refs/tags/${tag}`);
    const lines = git(['ls-remote', 'origin', 'refs/heads/main', ...names, ...names.map((name) => `${name}^{}`)]);
    const refs = new Map(
        lines
            .split('\n')
            .filter(Boolean)
            .map((line) => {
                const [sha, name] = line.split(/\s+/u);
                return [name, sha];
            }),
    );
    const main = refs.get('refs/heads/main');
    const absent = names.every((name) => !refs.has(name));
    if (main === candidate.sourceCommit && absent) return { needsPush: true };
    const complete = names.every((name) => refs.get(name) === git(['rev-parse', name]) && refs.get(`${name}^{}`) === candidate.preparedCommit);
    if (main === candidate.preparedCommit && complete) return { needsPush: false };
    throw new Error('Main or a release tag changed; a newer release owns publication.');
}

async function releaseForTag(request, repositoryPath, tag) {
    for (let page = 1; page <= 10; page++) {
        const releases = await request('GET', `${repositoryPath}/releases?per_page=100&page=${page}`);
        if (!Array.isArray(releases) || releases.length > 100) throw new Error('Invalid release pagination.');
        const found = releases.find((release) => release.tag_name === tag);
        if (found) return found;
        if (releases.length < 100) return undefined;
    }
    throw new Error('Release metadata exceeded its pagination budget.');
}

function runGit(args) {
    try {
        return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 120_000, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    } catch {
        throw new Error('A release Git operation failed; inspect repository refs before retrying.');
    }
}

async function readRegistryVersion(item) {
    const token = process.env.NODE_AUTH_TOKEN;
    if (!token) throw new Error('The native package publishing token is required.');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    const budget = 4 * 1024 * 1024;
    let reader;
    try {
        const response = await fetch(`https://npm.pkg.github.com/${item.name.replace('/', '%2f')}`, {
            headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
            redirect: 'error',
            signal: controller.signal,
        });
        if (response.status === 404) return undefined;
        const declaredLength = response.headers.get('content-length');
        if (!response.ok || !response.body || (declaredLength !== null && (!/^\d+$/u.test(declaredLength) || Number(declaredLength) > budget)))
            throw new Error('Invalid registry response.');
        reader = response.body.getReader();
        const chunks = [];
        let length = 0;
        while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            length += chunk.value.byteLength;
            if (length > budget) throw new Error('Registry response exceeded its byte budget.');
            chunks.push(chunk.value);
        }
        const metadata = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks, length)));
        if (metadata?.name !== item.name || typeof metadata.versions !== 'object' || metadata.versions === null || Array.isArray(metadata.versions))
            throw new Error('Invalid registry metadata.');
        if (!Object.hasOwn(metadata.versions, item.version)) return undefined;
        const existing = metadata.versions[item.version];
        if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) throw new Error('Invalid registry version.');
        return existing;
    } catch {
        throw new Error('Could not inspect bounded registry metadata before publication.');
    } finally {
        clearTimeout(timer);
        controller.abort();
        reader?.releaseLock();
    }
}

function publishTarball(filename) {
    try {
        const env = { ...process.env };
        delete env.GH_TOKEN;
        delete env.RELEASE_PUSH_TOKEN;
        execFileSync('npm', ['publish', filename, '--ignore-scripts', '--registry=https://npm.pkg.github.com'], {
            env,
            encoding: 'utf8',
            maxBuffer: 4 * 1024 * 1024,
            timeout: 120_000,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    } catch {
        throw new Error('Registry publication failed; resume the same verified candidate after checking package permissions.');
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
    try {
        const { values, positionals } = parseArgs({ allowPositionals: true, options: { directory: { type: 'string' } } });
        if (positionals.length !== 1) throw new Error('Select exactly one release publication stage.');
        const result = await publishReleaseCandidate(positionals[0], values.directory);
        if (process.env.GITHUB_OUTPUT && positionals[0] === 'preflight') appendFileSync(process.env.GITHUB_OUTPUT, `needs_push=${result.needsPush}\n`, 'utf8');
        process.stdout.write(`${JSON.stringify(result)}\n`);
    } catch (error) {
        process.stderr.write(`${error instanceof Error ? error.message : 'Release publication failed.'}\n`);
        process.exitCode = 1;
    }
}
