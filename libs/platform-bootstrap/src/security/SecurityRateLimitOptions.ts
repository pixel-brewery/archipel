import { IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { Options as RateLimitOptions } from 'express-rate-limit';

/**
 * Rate-limit options accepted by the security bootstrap step.
 *
 * @public
 */
export type SecurityRateLimitOptions = Partial<RateLimitOptions> & {
    /** Config key used for the rate-limit window duration. */
    readonly windowMsConfigKey?: IConfigKey<string | number | undefined>;

    /** Config key used for the request limit. */
    readonly limitConfigKey?: IConfigKey<string | number | undefined>;

    /** Fallback rate-limit window in milliseconds. */
    readonly fallbackWindowMs?: number;

    /** Fallback request limit. */
    readonly fallbackLimit?: number;
};
