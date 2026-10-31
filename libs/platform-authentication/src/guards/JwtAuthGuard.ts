// #region Imports

import { IS_PUBLIC_KEY } from '@pixel-brewery/archipel-platform-core';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

// #endregion

/**
 * The `JwtAuthGuard` protects routes using JWT-based authentication.
 * It checks for the `@Public()` decorator metadata.
 * When registered as `APP_GUARD`, all routes require JWT authentication by default.
 * Routes decorated with `@Public()` are exempt.
 *
 * @public
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // #region Ctor

    public constructor(private readonly reflector: Reflector) {
        super();
    }

    // #endregion

    // #region Methods

    public override canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    // #endregion
}
