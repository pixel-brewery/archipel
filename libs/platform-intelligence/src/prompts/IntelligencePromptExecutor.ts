// #region Imports

import { Injectable } from '@nestjs/common';
import type { IIntelligenceModelMessage } from '../contracts/IIntelligenceModelMessage.js';
import type { IIntelligencePrompt } from '../contracts/IIntelligencePrompt.js';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';
import { IntelligenceLanguageGenerator } from '../generators/IntelligenceLanguageGenerator.js';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { validateIntelligenceSchema } from '../runtime/validateIntelligenceSchema.js';
import type { IIntelligencePromptExecutionContext } from './IIntelligencePromptExecutionContext.js';
import type { IIntelligencePromptExecutionPolicy } from './IIntelligencePromptExecutionPolicy.js';
import type { IIntelligencePromptExecutionResult } from './IIntelligencePromptExecutionResult.js';
import type { IIntelligencePromptInvocation } from './IIntelligencePromptInvocation.js';
import type { IntelligencePromptCapability } from './IntelligencePromptCapability.js';
import { IntelligencePromptPolicyBase } from './abstracts/IntelligencePromptPolicyBase.js';

// #endregion

const DEFAULT_EXECUTION_POLICY: IIntelligencePromptExecutionPolicy = {};

/**
 * Validates and executes reusable intelligence prompt invocations.
 *
 * @public
 */
@Injectable()
export class IntelligencePromptExecutor {
    // #region Fields

    private readonly _policy: IntelligencePromptPolicyBase;
    private readonly _languageGenerator: IntelligenceLanguageGenerator;

    // #endregion

    // #region Ctor

    public constructor(policy: IntelligencePromptPolicyBase, languageGenerator: IntelligenceLanguageGenerator) {
        this._policy = policy;
        this._languageGenerator = languageGenerator;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public execute<TInput, TMetadata>(
        invocation: IIntelligencePromptInvocation<TInput, string, 'text', TMetadata>,
        context?: IIntelligencePromptExecutionContext,
    ): Promise<IIntelligencePromptExecutionResult<string, TMetadata>>;
    public execute<TInput, TOutput, TMetadata>(
        invocation: IIntelligencePromptInvocation<TInput, TOutput, 'object', TMetadata>,
        context?: IIntelligencePromptExecutionContext,
    ): Promise<IIntelligencePromptExecutionResult<TOutput, TMetadata>>;
    public async execute<TInput, TOutput, TMetadata>(
        invocation: IIntelligencePromptInvocation<TInput, TOutput, 'text' | 'object', TMetadata>,
        context: IIntelligencePromptExecutionContext = {},
    ): Promise<IIntelligencePromptExecutionResult<TOutput | string, TMetadata>> {
        const definition = invocation.definition;
        const input = await this.validateInput(definition.name, definition.inputSchema, invocation.input);
        const renderContext = { input };
        const requestedPolicy = definition.execution ?? DEFAULT_EXECUTION_POLICY;
        const effectivePolicy = await this._policy.resolve({
            promptName: definition.name,
            promptVersion: definition.version,
            mode: definition.mode,
            requestedPolicy,
            context,
        });
        this.validateCapabilities(definition.name, definition.mode, requestedPolicy, effectivePolicy.capabilities);
        const prompt = this.createPrompt(definition.system(renderContext), definition.messages(renderContext));

        if (definition.mode === 'text') {
            const completion = await this._languageGenerator.generateText(prompt, effectivePolicy.options);

            return {
                output: completion.text,
                promptName: definition.name,
                promptVersion: definition.version,
                provider: completion.provider,
                model: completion.model,
                usage: completion.usage,
                ...(completion.stepUsage ? { stepUsage: completion.stepUsage } : {}),
                reasoningText: completion.reasoningText,
                finishReason: completion.finishReason,
                requestedPolicy,
                effectivePolicy,
                metadata: invocation.metadata,
            };
        }

        if (!definition.outputSchema) {
            throw new IntelligenceValidationError(`Object prompt "${definition.name}" does not define an output schema.`);
        }

        const completion = await this._languageGenerator.generateObject(prompt, definition.outputSchema, effectivePolicy.options);
        const validatedOutput = await this.validateValue(definition.name, 'output', definition.outputSchema, completion.output);

        return {
            output: validatedOutput,
            promptName: definition.name,
            promptVersion: definition.version,
            provider: completion.provider,
            model: completion.model,
            usage: completion.usage,
            ...(completion.stepUsage ? { stepUsage: completion.stepUsage } : {}),
            reasoningText: completion.reasoningText,
            finishReason: completion.finishReason,
            requestedPolicy,
            effectivePolicy,
            metadata: invocation.metadata,
        };
    }

    private createPrompt(system: string | ReadonlyArray<string>, messages: ReadonlyArray<IIntelligenceModelMessage>): IIntelligencePrompt {
        return {
            system: typeof system === 'string' ? system : system.join('\n'),
            messages: Array.from(messages),
        };
    }

    private async validateInput<TInput>(promptName: string, inputSchema: IIntelligenceSchema<TInput>, input: Readonly<TInput>): Promise<TInput> {
        return this.validateValue(promptName, 'input', inputSchema, input);
    }

    private validateCapabilities(
        promptName: string,
        mode: 'text' | 'object',
        requestedPolicy: IIntelligencePromptExecutionPolicy,
        effectiveCapabilities: ReadonlyArray<IntelligencePromptCapability>,
    ): void {
        const requiredCapabilities = new Set(requestedPolicy.requiredCapabilities ?? []);
        requiredCapabilities.add('textInput');
        requiredCapabilities.add('textOutput');
        if (mode === 'object') {
            requiredCapabilities.add('structuredOutput');
        }

        const missingCapabilities = Array.from(requiredCapabilities).filter((capability) => !effectiveCapabilities.includes(capability));
        if (missingCapabilities.length > 0) {
            throw new IntelligenceValidationError(`Prompt "${promptName}" requires unresolved capabilities: ${missingCapabilities.join(', ')}.`);
        }
    }

    private async validateValue<TValue>(
        promptName: string,
        valueName: 'input' | 'output',
        valueSchema: IIntelligenceSchema<TValue>,
        value: unknown,
    ): Promise<TValue> {
        // A provider answer that violates the output schema is unusable provider output, not an invalid request.
        return validateIntelligenceSchema(valueSchema, value, `${valueName === 'input' ? 'Input' : 'Output'} for prompt "${promptName}"`, valueName);
    }

    // #endregion
}
