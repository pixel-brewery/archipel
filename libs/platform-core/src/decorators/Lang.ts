import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the first language token from the Accept-Language header.
 *
 * Examples:
 *   "da, en-gb;q=0.8, en;q=0.7" -> "da"
 *   "en-US,en;q=0.9"            -> "en-US"
 *   undefined / ""              -> undefined
 *
 * @public
 */
export const Lang = createParamDecorator<string | undefined>((_data: unknown, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest<{ headers?: Record<string, string | string[]> }>();
    const raw = (req.headers?.['accept-language'] ?? req.headers?.['Accept-Language']) as string | string[] | undefined;

    if (!raw) return undefined;

    const header = Array.isArray(raw) ? raw.join(',') : raw;

    // Take the first comma-separated item, trim, then drop any ;q=... part.
    const firstItem = header.split(',')[0]?.trim();
    if (!firstItem) return undefined;

    const token = firstItem.split(';')[0]?.trim();
    return token || undefined;
});
