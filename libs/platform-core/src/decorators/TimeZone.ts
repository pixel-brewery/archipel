//#region Imports

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//#endregion

/**
 * Request header through which a client announces its IANA time zone, for example `Europe/Berlin`.
 *
 * Browser applications send it with every API request so the server can resolve "today" and local times for the
 * current user. Allow it in the CORS `allowedHeaders` of cross-origin deployments.
 *
 * @public
 */
export const TIME_ZONE_HEADER = 'X-Time-Zone';

const MAX_TIME_ZONE_LENGTH = 100;

/**
 * Extracts the client's IANA time zone from the `X-Time-Zone` request header.
 *
 * The value is a client hint, not a trusted fact: an unknown, malformed or overlong zone resolves to `undefined` so the
 * endpoint can decide how to proceed without a time zone. A valid zone is returned in its canonical spelling.
 *
 * Examples:
 *   "Europe/Berlin"            -> "Europe/Berlin"
 *   "america/new_york"         -> "America/New_York"
 *   "Mars/Olympus"             -> undefined
 *   undefined / ""             -> undefined
 *
 * @public
 */
export const TimeZone = createParamDecorator<string | undefined>((_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<{ headers?: Record<string, string | string[] | undefined> }>();
    const raw = req.headers?.[TIME_ZONE_HEADER.toLowerCase()];
    const value = (Array.isArray(raw) ? raw[0] : raw)?.trim();

    if (!value || value.length > MAX_TIME_ZONE_LENGTH) return undefined;

    try {
        return new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone;
    } catch {
        // Intl rejects unknown zones with a RangeError; an unusable hint is treated like a missing one.
        return undefined;
    }
});
