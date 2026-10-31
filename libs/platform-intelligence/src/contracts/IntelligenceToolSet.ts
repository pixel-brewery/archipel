// #region Imports

import type { IIntelligenceToolDefinition } from './IIntelligenceToolDefinition.js';

// #endregion

/**
 * Provider-neutral named tool collection.
 *
 * @public
 */
export type IntelligenceToolSet = Readonly<Record<string, IIntelligenceToolDefinition>>;
