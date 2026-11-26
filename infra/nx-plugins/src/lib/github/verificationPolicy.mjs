/**
 * Defines the existing complete CI jobs and enforced native branch checks.
 *
 * @internal
 */
export const verificationPolicy = Object.freeze({
    reviewedCiSha256: 'fd4cf845c90ef84c4634355c4569227cd7fb80273ecc03f1459176c7384221ad',
    workflowFile: 'ci.yml',
    workflowPath: '.github/workflows/ci.yml',
    workflowName: 'Verify',
    requiredJobs: ['verify (ubuntu-latest)', 'verify (macos-latest)', 'verify (windows-latest)', 'Quality Gate'],
    requiredChecks: ['verify (ubuntu-latest)', 'verify (macos-latest)', 'verify (windows-latest)', 'Quality Gate'],
});
