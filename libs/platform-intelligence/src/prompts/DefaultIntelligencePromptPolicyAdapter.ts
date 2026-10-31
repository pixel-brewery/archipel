// #region Imports

import { Injectable } from '@nestjs/common';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import type { IIntelligencePromptEffectivePolicy } from './IIntelligencePromptEffectivePolicy.js';
import type { IIntelligencePromptPolicyRequest } from './IIntelligencePromptPolicyRequest.js';
import { IntelligencePromptPolicyBase } from './abstracts/IntelligencePromptPolicyBase.js';

// #endregion

/**
 * Default prompt policy that supports native settings and automatic model selection.
 *
 * @public
 */
@Injectable()
export class DefaultIntelligencePromptPolicyAdapter extends IntelligencePromptPolicyBase {
    // #region Fields

    // #endregion

    // #region Ctor

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public override async resolve(request: IIntelligencePromptPolicyRequest): Promise<IIntelligencePromptEffectivePolicy> {
        const policy = request.requestedPolicy;
        const unsupportedRequirements = [
            policy.quality ? 'quality' : null,
            policy.reasoning ? 'reasoning' : null,
            policy.latency ? 'latency' : null,
            policy.model && policy.model.strategy !== 'automatic' ? 'model' : null,
        ].filter((value): value is string => value !== null);

        if (unsupportedRequirements.length > 0) {
            throw new IntelligenceValidationError(
                `Prompt "${request.promptName}" requires a custom policy adapter for: ${unsupportedRequirements.join(', ')}.`,
            );
        }

        const capabilities = new Set(policy.requiredCapabilities ?? []);
        capabilities.add('textInput');
        capabilities.add('textOutput');
        if (request.mode === 'object') {
            capabilities.add('structuredOutput');
        }

        return {
            options: policy.options ?? {},
            capabilities: Array.from(capabilities),
        };
    }

    // #endregion
}
