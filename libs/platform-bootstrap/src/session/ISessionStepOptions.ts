import { IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { SessionOptions } from 'express-session';

/**
 * Options for the Express-compatible session bootstrap step.
 *
 * @public
 */
export interface ISessionStepOptions {
    /** Whether the session middleware should be registered. */
    readonly enabled?: boolean;

    /** Config key containing the session secret. */
    readonly secretConfigKey?: IConfigKey<string>;

    /** Config key containing the secure-cookie flag. */
    readonly secureConfigKey?: IConfigKey<boolean>;

    /** Config key containing the session lifetime. */
    readonly maxAgeConfigKey?: IConfigKey<string | number>;

    /** Session cookie name. */
    readonly name?: string;

    /** Express-session `resave` option. */
    readonly resave?: boolean;

    /** Express-session `rolling` option. Renews the cookie max age on every response. */
    readonly rolling?: boolean;

    /** Express-session `saveUninitialized` option. */
    readonly saveUninitialized?: boolean;

    /** Optional persistent session store. */
    readonly store?: SessionOptions['store'];

    /** Cookie options merged into the generated session cookie settings. */
    readonly cookie?: SessionOptions['cookie'];
}
