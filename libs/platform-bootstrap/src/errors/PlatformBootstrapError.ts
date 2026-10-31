import { IPlatformBootstrapErrorOptions } from './IPlatformBootstrapErrorOptions.js';

/**
 * Error raised when an Archipel platform bootstrap step fails.
 *
 * @public
 */
export class PlatformBootstrapError extends Error {
    // #region Fields

    private readonly _cause: unknown;
    private readonly _stepIndex: number | undefined;
    private readonly _stepName: string | undefined;

    // #endregion

    // #region Ctor

    public constructor(message: string, options?: IPlatformBootstrapErrorOptions) {
        super(message);
        this.name = 'PlatformBootstrapError';
        this._cause = options?.cause;
        this._stepIndex = options?.stepIndex;
        this._stepName = options?.stepName;
    }

    // #endregion

    // #region Properties

    /**
     * Original error that caused the bootstrap failure.
     *
     * @public
     */
    public override get cause(): unknown {
        return this._cause;
    }

    /**
     * Zero-based index of the failing bootstrap step.
     *
     * @public
     */
    public get stepIndex(): number | undefined {
        return this._stepIndex;
    }

    /**
     * Display name of the failing bootstrap step.
     *
     * @public
     */
    public get stepName(): string | undefined {
        return this._stepName;
    }

    // #endregion

    // #region Methods

    /**
     * Wraps an unknown thrown value in a platform bootstrap error.
     *
     * @public
     * @param cause - The thrown value.
     * @param stepName - Display name of the failing step.
     * @param stepIndex - Zero-based index of the failing step.
     * @returns A platform bootstrap error.
     */
    public static wrap(cause: unknown, stepName: string, stepIndex: number): PlatformBootstrapError {
        const detail = cause instanceof Error ? cause.message : 'Unknown bootstrap failure.';

        return new PlatformBootstrapError(`Bootstrap step "${stepName}" failed: ${detail}`, {
            cause,
            stepIndex,
            stepName,
        });
    }

    // #endregion
}
