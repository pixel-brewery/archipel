// #region Imports

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// #endregion

/**
 * Represents the `Token` decorator.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function Token(): Function {
    return createParamDecorator((_: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>();
        const auth = request.headers.authorization?.split(' ')[1];
        return auth;
    })();
}
