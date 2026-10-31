import type { IIntelligencePromptEffectivePolicy } from '../IIntelligencePromptEffectivePolicy.js';
import type { IIntelligencePromptPolicyRequest } from '../IIntelligencePromptPolicyRequest.js';

/**
 * Resolves provider-neutral prompt requirements into effective generation settings.
 *
 * This abstract class also serves as the NestJS dependency injection token.
 *
 * @public
 */
export abstract class IntelligencePromptPolicyBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public abstract resolve(request: IIntelligencePromptPolicyRequest): Promise<IIntelligencePromptEffectivePolicy>;

    // #endregion
}
