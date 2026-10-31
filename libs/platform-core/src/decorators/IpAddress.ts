import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the client IP address from the current HTTP request.
 * Handles IPv6 (::1), proxy headers (X-Forwarded-For), and normalizes the output.
 *
 * Examples:
 *   "192.168.0.5"              -> "192.168.0.5"
 *   "::ffff:127.0.0.1"         -> "127.0.0.1"
 *   "::1" / "127.0.0.1"        -> "localhost"
 *   undefined / ""             -> undefined
 *
 * @public
 */
export const IpAddress = createParamDecorator<string | undefined>((_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<{
        headers?: Record<string, string | string[]>;
        ip?: string;
        connection?: { remoteAddress?: string };
    }>();

    // Check common proxy header first
    const forwarded = req.headers?.['x-forwarded-for'];
    const raw =
        (typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : Array.isArray(forwarded) ? forwarded[0] : req.ip || req.connection?.remoteAddress) ??
        '';

    if (!raw) return undefined;

    // Normalize IPv6-mapped IPv4 (e.g. "::ffff:127.0.0.1")
    let ip = raw.replace('::ffff:', '').trim();

    // Handle local addresses
    if (['::1', '127.0.0.1', '0.0.0.0'].includes(ip)) {
        return 'localhost';
    }

    // Strip potential IPv6 brackets
    ip = ip.replace(/^\[|\]$/g, '');

    return ip || undefined;
});
