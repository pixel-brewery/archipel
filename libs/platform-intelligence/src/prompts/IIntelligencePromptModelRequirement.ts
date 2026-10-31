// #region Imports

import type { IIntelligenceModelReference } from '../contracts/IIntelligenceModelReference.js';

// #endregion

/**
 * Model selection requested by a reusable intelligence prompt.
 *
 * @public
 */
export type IIntelligencePromptModelRequirement =
    | {
          readonly strategy: 'automatic';
      }
    | {
          readonly strategy: 'preferred';
          readonly models: ReadonlyArray<IIntelligenceModelReference>;
      }
    | {
          readonly strategy: 'fixed';
          readonly model: IIntelligenceModelReference;
      };
