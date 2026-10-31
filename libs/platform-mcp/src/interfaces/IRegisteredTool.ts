import type { IMcpToolMetadata } from './IMcpToolMetadata.js';

/**
 * Entry for a registered tool handler.
 */
export interface IRegisteredTool {
    /** Tool metadata supplied by the decorator or explicit registration. */
    readonly metadata: IMcpToolMetadata;
    /** Bound application handler invoked with parsed protocol arguments. */
    readonly handler: (...args: unknown[]) => unknown;
}
