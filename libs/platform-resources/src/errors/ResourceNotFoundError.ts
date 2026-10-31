/**
 * Error thrown when a Resource with a specified ID is not found.
 *
 * @public
 */
export class ResourceNotFoundError extends Error {
    public constructor(public readonly key: string) {
        super(`Resource with name '${key}' not found.`);
    }

    public readonly code = 'RESOURCE_NOT_FOUND';
}
