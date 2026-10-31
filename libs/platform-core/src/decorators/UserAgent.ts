import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the User-Agent header from the incoming HTTP request.
 *
 * @public
 */
export const UserAgent = createParamDecorator((_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
});
