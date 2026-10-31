import { HelmetOptions } from 'helmet';
import { PlatformContentSecurityPolicyMode } from './PlatformContentSecurityPolicyMode.js';
import { PlatformCorsOptions } from './PlatformCorsOptions.js';
import { SecurityRateLimitOptions } from './SecurityRateLimitOptions.js';

/**
 * Options for the generic security bootstrap step.
 *
 * @public
 */
export interface ISecurityStepOptions {
    /** CORS options, or `false` to skip CORS setup. */
    readonly cors?: boolean | PlatformCorsOptions;

    /** Helmet options, or `false` to skip security headers. */
    readonly headers?: boolean | HelmetOptions;

    /** Content-security-policy mode used when Helmet is enabled. */
    readonly contentSecurityPolicy?: false | PlatformContentSecurityPolicyMode | HelmetOptions['contentSecurityPolicy'];

    /** Rate-limit options, or `false` to skip rate limiting. */
    readonly rateLimit?: boolean | SecurityRateLimitOptions;
}
