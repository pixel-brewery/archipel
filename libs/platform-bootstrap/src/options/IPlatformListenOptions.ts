import { IConfigKey } from '@pixel-brewery/archipel-platform-configuration';

/**
 * Options for resolving the HTTP listen port from typed configuration keys.
 *
 * @public
 */
export interface IPlatformListenOptions {
    /** Ordered list of port config keys. The first present value wins. */
    readonly portConfigKeys?: ReadonlyArray<IConfigKey<string | number | undefined>>;

    /** Fallback port used when none of the configured keys are present. */
    readonly fallbackPort?: number;

    /** Optional hostname/interface binding passed to NestJS `listen`. */
    readonly hostname?: string;
}
