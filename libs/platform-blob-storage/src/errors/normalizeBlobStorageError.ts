// #region Imports

import { BlobObjectNotFoundError } from './BlobObjectNotFoundError.js';
import { BlobStorageError } from './BlobStorageError.js';
import { BlobStorageUnavailableError } from './BlobStorageUnavailableError.js';

// #endregion

interface IProviderErrorShape {
    readonly $metadata?: {
        readonly httpStatusCode?: unknown;
    };
    readonly code?: unknown;
    readonly name?: unknown;
    readonly response?: {
        readonly status?: unknown;
    };
    readonly status?: unknown;
    readonly statusCode?: unknown;
}

const NOT_FOUND_CODES = new Set(['ENOENT', 'NoSuchKey', 'NotFound', 'BlobNotFound', 'ContainerNotFound', 'ResourceNotFound']);
const UNAVAILABLE_CODES = new Set(['ECONNABORTED', 'ECONNREFUSED', 'ECONNRESET', 'EHOSTUNREACH', 'ENETDOWN', 'ENETUNREACH', 'EPIPE', 'ETIMEDOUT', 'EAI_AGAIN']);

/**
 * Converts provider-specific failures into stable blob storage errors.
 *
 * @internal
 */
export function normalizeBlobStorageError(error: unknown, providerId: string, operation: string, key: string): BlobStorageError {
    if (error instanceof BlobStorageError) {
        return error;
    }

    const details = isProviderErrorShape(error) ? error : undefined;
    const statusCode = resolveStatusCode(details);
    const providerCode = typeof details?.code === 'string' ? details.code : typeof details?.name === 'string' ? details.name : undefined;

    if (statusCode === 404 || (providerCode && NOT_FOUND_CODES.has(providerCode))) {
        return new BlobObjectNotFoundError(providerId, operation, key, error);
    }

    if (
        statusCode === 408 ||
        statusCode === 425 ||
        statusCode === 429 ||
        (typeof statusCode === 'number' && statusCode >= 500) ||
        (providerCode && UNAVAILABLE_CODES.has(providerCode)) ||
        providerCode === 'AbortError'
    ) {
        return new BlobStorageUnavailableError(providerId, operation, key, error);
    }

    return new BlobStorageError('BLOB_STORAGE_OPERATION_FAILED', `Blob storage operation '${operation}' failed.`, providerId, operation, key, error);
}

function isProviderErrorShape(value: unknown): value is IProviderErrorShape {
    return typeof value === 'object' && value !== null;
}

function resolveStatusCode(error: IProviderErrorShape | undefined): number | undefined {
    const candidates = [error?.statusCode, error?.status, error?.response?.status, error?.$metadata?.httpStatusCode];

    for (const candidate of candidates) {
        if (typeof candidate === 'number') {
            return candidate;
        }
    }

    return undefined;
}
