// #region Imports

import { Inject, Injectable, Optional } from '@nestjs/common';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';

// #endregion

/**
 * The `LocalAuthGuard` protects routes using local authentication.
 *
 * @public
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
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
