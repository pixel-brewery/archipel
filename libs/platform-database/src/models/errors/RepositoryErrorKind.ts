// #region Imports

import type { RepositoryErrorKinds } from './RepositoryErrorKinds.js';

// #endregion

/**
 * Union type derived from {@link RepositoryErrorKinds}.
 *
 * @public
 */
export type RepositoryErrorKind = (typeof RepositoryErrorKinds)[keyof typeof RepositoryErrorKinds];
