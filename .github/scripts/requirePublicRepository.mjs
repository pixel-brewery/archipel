// #region Imports

import { requestDependabotGitHub } from './requestDependabotGitHub.mjs';
import { resolveDependabotRepository } from './resolveDependabotRepository.mjs';

// #endregion

const identity = await resolveDependabotRepository(
    {
        repository: process.env.GITHUB_REPOSITORY,
        repositoryId: process.env.GITHUB_REPOSITORY_ID,
        defaultBranch: 'main',
    },
    requestDependabotGitHub,
);

if (!identity || process.env.GITHUB_REF !== 'refs/heads/main') {
    process.stderr.write('This operation requires the public Pixel Brewery Archipel repository on main.\n');
    process.exitCode = 1;
} else {
    process.stdout.write('Verified the immutable public Archipel repository on main.\n');
}
