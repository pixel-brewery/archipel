// #region Imports

import { SetMetadata } from '@nestjs/common';

// #endregion

/**
 * Represents the key for the `UseRoles` decorator.
 *
 * @public
 */
export const ROLES_KEY = 'use_roles';

/**
 * Represents the `UseRoles` decorator.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function UseRoles(...roles: Array<string>): Function {
    return SetMetadata(ROLES_KEY, roles);
}
