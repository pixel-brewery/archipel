// #region Imports

import type { IIntelligenceAgentConfiguration } from './contracts/IIntelligenceAgentConfiguration.js';
import type { IIntelligenceLanguageCompletion } from './contracts/IIntelligenceLanguageCompletion.js';
import type { IIntelligenceLanguageGenerationOptions } from './contracts/IIntelligenceLanguageGenerationOptions.js';
import type { IIntelligenceLanguageStream } from './contracts/IIntelligenceLanguageStream.js';
import type { IIntelligencePrompt } from './contracts/IIntelligencePrompt.js';
import { IntelligenceLanguageGenerator } from './generators/IntelligenceLanguageGenerator.js';

// #endregion

/**
 * Reusable provider-neutral agent backed by the language capability.
 *
 * @public
 */
export class IntelligenceAgent {
    // #region Fields

    private readonly _configuration: IIntelligenceAgentConfiguration;
    private readonly _languageGenerator: IntelligenceLanguageGenerator;

    // #endregion

    // #region Ctor

    public constructor(configuration: IIntelligenceAgentConfiguration, languageGenerator: IntelligenceLanguageGenerator) {
        this._configuration = Object.freeze({ ...configuration });
        this._languageGenerator = languageGenerator;
    }

    // #endregion

    // #region Properties

    /** Optional stable agent name used by application observability. */
    public get name(): string | undefined {
        return this._configuration.name;
    }

    // #endregion

    // #region Methods

    /** Executes one bounded agent run. */
    public generate(prompt: IIntelligencePrompt, options: IIntelligenceLanguageGenerationOptions = {}): Promise<IIntelligenceLanguageCompletion<string>> {
        return this._languageGenerator.generateText(this.createPrompt(prompt), this.createOptions(options));
    }

    /** Streams one agent run. */
    public stream(prompt: IIntelligencePrompt, options: IIntelligenceLanguageGenerationOptions = {}): Promise<IIntelligenceLanguageStream> {
        return this._languageGenerator.streamText(this.createPrompt(prompt), this.createOptions(options));
    }

    private createOptions(options: IIntelligenceLanguageGenerationOptions): IIntelligenceLanguageGenerationOptions {
        const toolExposure: Pick<IIntelligenceLanguageGenerationOptions, 'activeToolNames' | 'deferredToolLoading'> =
            options.activeToolNames !== undefined || options.deferredToolLoading !== undefined ? options : this._configuration;

        return {
            ...options,
            model: options.model ?? this._configuration.model,
            tools: {
                ...(this._configuration.tools ?? {}),
                ...(options.tools ?? {}),
            },
            activeToolNames: toolExposure.activeToolNames,
            deferredToolLoading: toolExposure.deferredToolLoading,
            maxSteps: options.maxSteps ?? this._configuration.maxSteps,
        };
    }

    private createPrompt(prompt: IIntelligencePrompt): IIntelligencePrompt {
        const instructions = [this._configuration.instructions, prompt.instructions].filter(
            (value): value is string => typeof value === 'string' && value.length > 0,
        );

        return {
            ...prompt,
            instructions: instructions.join('\n\n'),
        };
    }

    // #endregion
}
