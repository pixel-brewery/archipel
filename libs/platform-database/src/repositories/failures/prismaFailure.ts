// #region Fields

const PRISMA_ERROR_CODE = /^P\d{4}$/;

interface IKnownPrismaFailure {
    readonly name: 'PrismaClientKnownRequestError';
    readonly message: string;
    readonly code: string;
    readonly clientVersion: string;
    readonly meta?: unknown;
    readonly batchRequestIdx?: number;
}

interface IUnknownPrismaFailure {
    readonly name: 'PrismaClientUnknownRequestError';
    readonly message: string;
    readonly clientVersion: string;
    readonly batchRequestIdx?: number;
}

// #endregion

// #region Methods

/**
 * Reads the error code of a raw Prisma request error.
 *
 * @remarks
 * The error is recognized by its Prisma error name, client version, and `P`
 * code rather than by class identity. A workspace can load several Prisma
 * client copies whose error classes are not `instanceof`-compatible.
 *
 * @param error - The thrown value.
 * @returns The Prisma error code, or `undefined` when the value is no Prisma request error.
 * @internal
 */
export function readPrismaErrorCode(error: unknown): string | undefined {
    return isKnownPrismaFailure(error) ? error.code : undefined;
}

/** @internal */
export function isKnownPrismaFailure(error: unknown): error is IKnownPrismaFailure {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const failure = error as Partial<IKnownPrismaFailure>;
    return (
        failure.name === 'PrismaClientKnownRequestError' &&
        typeof failure.message === 'string' &&
        typeof failure.clientVersion === 'string' &&
        typeof failure.code === 'string' &&
        PRISMA_ERROR_CODE.test(failure.code)
    );
}

/** @internal */
export function isUnknownPrismaFailure(error: unknown): error is IUnknownPrismaFailure {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    const failure = error as Partial<IUnknownPrismaFailure>;
    return failure.name === 'PrismaClientUnknownRequestError' && typeof failure.message === 'string' && typeof failure.clientVersion === 'string';
}

// #endregion
