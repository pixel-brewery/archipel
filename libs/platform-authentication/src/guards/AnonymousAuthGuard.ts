// #region Imports

import { Inject, Injectable, Optional } from '@nestjs/common';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

// #endregion

/**
 * The `AnonymousAuthGuard` protects routes using anonymous authentication.
 *
 * @public
 */
@Injectable()
export class AnonymousAuthGuard extends AuthGuard('anonymous') {
    // #region Ctor

    public constructor(
        @Optional()
        @Inject(AuthModuleOptions)
        options?: AuthModuleOptions,
    ) {
        super(options);
    }

    // #endregion
}
