// #region Imports

import { CustomDecorator, SetMetadata } from '@nestjs/common';

// #endregion

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * The `Public` decorator.
 *
 * @public
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
