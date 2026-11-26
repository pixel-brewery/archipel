/**
 * Executes the trusted Nx-owned dependency workflow.
 *
 * @param mode - The external workflow operation.
 * @returns The completed credential-free workflow result.
 * @throws An Error when the requested operation cannot be verified.
 * @internal
 */
export declare function runDependabotAutomation(mode: 'merge' | 'reconcile' | 'continue'): Promise<unknown>;
