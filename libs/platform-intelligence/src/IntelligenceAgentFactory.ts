// #region Imports

import { Injectable } from '@nestjs/common';
import type { IIntelligenceAgentConfiguration } from './contracts/IIntelligenceAgentConfiguration.js';
import { IntelligenceAgent } from './IntelligenceAgent.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';

// #endregion

/**
 * Creates reusable provider-neutral tool-loop agents.
 *
 * @public
 */
@Injectable()
export class IntelligenceAgentFactory {
    // #region Fields

    private readonly _languageGenerator: IntelligenceLanguageGenerator;

    // #endregion

    // #region Ctor

    public constructor(languageGenerator: IntelligenceLanguageGenerator) {
        this._languageGenerator = languageGenerator;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    /** Creates a reusable agent that resolves its provider model only when run. */
    public create(configuration: IIntelligenceAgentConfiguration): IntelligenceAgent {
        return new IntelligenceAgent(configuration, this._languageGenerator);
    }

    // #endregion
}
