// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { prepareReleaseVersions } from './prepareReleaseVersions.mjs';

// #endregion

const nx = vi.hoisted(() => ({ configure: vi.fn(), release: vi.fn() }));
vi.mock('nx/release', () => ({
    ReleaseClient: class {
        constructor(...args) {
            nx.configure(...args);
            this.release = nx.release;
        }
    },
}));

afterEach(() => vi.resetAllMocks());

describe('prepareReleaseVersions', () => {
    it('prepares the first two-group release without enabling Git writes or package publication', async () => {
        // Arrange
        const readTags = vi.fn().mockResolvedValue('');
        const result = { projectsVersionData: { platform: '0.1.24', generators: '0.1.24' } };
        nx.release.mockResolvedValue(result);
        // Act
        const actual = await prepareReleaseVersions({ specifier: 'patch' }, { readTags });
        // Assert
        expect(actual).toBe(result);
        expect(readTags.mock.calls).toEqual([['v[0-9]*'], ['prisma-generators-v[0-9]*']]);
        expect(nx.configure).toHaveBeenCalledExactlyOnceWith({ git: { commit: false, tag: false, push: false, stageChanges: false } });
        expect(nx.release).toHaveBeenCalledExactlyOnceWith({ specifier: 'patch', firstRelease: true, skipPublish: true });
    });

    it('preserves independent existing group baselines and the selected increment', async () => {
        // Arrange
        const readTags = vi.fn().mockResolvedValueOnce('v0.2.0\n').mockResolvedValueOnce('prisma-generators-v0.1.24\n');
        // Act
        await prepareReleaseVersions({ specifier: 'minor' }, { readTags });
        // Assert
        expect(nx.release).toHaveBeenCalledExactlyOnceWith({ specifier: 'minor', firstRelease: false, skipPublish: true });
    });

    it.each([
        ['v0.1.24', ''],
        ['', 'prisma-generators-v0.1.24'],
    ])('refuses partial group history before versioning: %s / %s', async (platform, generators) => {
        // Arrange
        const readTags = vi.fn().mockResolvedValueOnce(platform).mockResolvedValueOnce(generators);
        // Act
        const result = prepareReleaseVersions({ specifier: 'patch' }, { readTags });
        // Assert
        await expect(result).rejects.toThrow('refusing a partial tag history');
        expect(nx.configure).not.toHaveBeenCalled();
        expect(nx.release).not.toHaveBeenCalled();
    });

    it('rejects a specifier outside the maintained stable release choices before reading Git', async () => {
        // Arrange
        const readTags = vi.fn();
        // Act
        const result = prepareReleaseVersions({ specifier: 'prerelease' }, { readTags });
        // Assert
        await expect(result).rejects.toThrow('Select patch, minor or major');
        expect(readTags).not.toHaveBeenCalled();
        expect(nx.configure).not.toHaveBeenCalled();
    });

    it('does not retry a failed Nx version preparation', async () => {
        // Arrange
        const readTags = vi.fn().mockResolvedValue('');
        nx.release.mockRejectedValue(new Error('Synthetic version preparation failure.'));
        // Act
        const result = prepareReleaseVersions({ specifier: 'major' }, { readTags });
        // Assert
        await expect(result).rejects.toThrow('Synthetic version preparation failure.');
        expect(nx.release).toHaveBeenCalledTimes(1);
    });

    it('stops on unreadable tag history without exposing the Git diagnostic', async () => {
        // Arrange
        const readTags = vi.fn().mockRejectedValue(new Error('synthetic-private-git-diagnostic'));
        // Act
        const result = prepareReleaseVersions({ specifier: 'patch' }, { readTags });
        // Assert
        await expect(result).rejects.toThrow('Could not inspect both release group tag baselines.');
        await expect(result).rejects.not.toThrow('synthetic-private-git-diagnostic');
        expect(nx.release).not.toHaveBeenCalled();
    });
});
