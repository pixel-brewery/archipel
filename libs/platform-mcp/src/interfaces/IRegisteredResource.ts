import type { IMcpResourceMetadata } from './IMcpResourceMetadata.js';

/**
 * Entry for a registered resource handler.
 */
export interface IRegisteredResource {
    /** Resource metadata supplied by the decorator or explicit registration. */
    readonly metadata: IMcpResourceMetadata;
    /** Bound application handler invoked with the requested URI and optional template parameters. */
    readonly handler: (...args: unknown[]) => unknown;
}
