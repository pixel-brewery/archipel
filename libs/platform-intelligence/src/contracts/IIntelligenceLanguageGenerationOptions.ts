// #region Imports

import type { IIntelligenceDeferredToolLoadingOptions } from './IIntelligenceDeferredToolLoadingOptions.js';
import type { IIntelligenceGenerationStepStartEvent } from './IIntelligenceGenerationStepStartEvent.js';
import type { IIntelligenceProviderCallStartEvent } from './IIntelligenceProviderCallStartEvent.js';
import type { IIntelligenceRequestOptions } from './IIntelligenceRequestOptions.js';
import type { IIntelligenceToolExecutionEndEvent } from './IIntelligenceToolExecutionEndEvent.js';
import type { IIntelligenceToolExecutionStartEvent } from './IIntelligenceToolExecutionStartEvent.js';
import type { IntelligenceToolChoice } from './IntelligenceToolChoice.js';
import type { IntelligenceToolSet } from './IntelligenceToolSet.js';

// #endregion

/**
 * Provider-neutral language generation controls.
 *
 * @public
 */
export interface IIntelligenceLanguageGenerationOptions extends IIntelligenceRequestOptions {
    // #region Properties

    readonly temperature?: number;
    readonly topP?: number;
    readonly maxOutputTokens?: number;
    readonly maxRetries?: number;
    readonly tools?: IntelligenceToolSet;
    readonly toolChoice?: IntelligenceToolChoice;
    /**
     * Includes tools from the application-wide registry in this call.
     *
     * Defaults to `true`. Set to `false` for calls that may use only the tools
     * supplied through {@link tools}.
     */
    readonly includeRegisteredTools?: boolean;
    /**
     * Names of the composed tools that are available to this call.
     *
     * When present, the AI SDK receives exactly this subset. Duplicate names
     * and names unavailable after registry/local composition are rejected with
     * `IntelligenceValidationError`. Cannot be combined with
     * {@link deferredToolLoading}.
     */
    readonly activeToolNames?: ReadonlyArray<string>;
    /**
     * Exposes the composed tool catalog on demand instead of sending every full
     * tool contract with each provider request.
     *
     * The AI SDK receives all composed tools plus a built-in loader tool, while
     * each step exposes only the loader, the initial tools, and the tools
     * loaded earlier in the same call. Cannot be combined with
     * {@link activeToolNames} and requires {@link maxSteps} of at least `2`, so
     * a loaded tool can be called in a later step. A specific
     * {@link toolChoice} must name an initial tool or the loader. Invalid
     * settings are rejected with `IntelligenceValidationError` before the
     * provider is called.
     */
    readonly deferredToolLoading?: IIntelligenceDeferredToolLoadingOptions;
    readonly maxSteps?: number;
    /**
     * Authoritative guard invoked after native prompt/tool preparation and
     * immediately before every provider attempt.
     *
     * A rejected promise or thrown error prevents that provider attempt. This
     * hook is suitable for durable fencing; `onStepStart` is telemetry only.
     */
    readonly beforeProviderCall?: (event: IIntelligenceProviderCallStartEvent) => void | Promise<void>;
    readonly onStepStart?: (event: IIntelligenceGenerationStepStartEvent) => void | Promise<void>;
    readonly onToolExecutionStart?: (event: IIntelligenceToolExecutionStartEvent) => void | Promise<void>;
    readonly onToolExecutionEnd?: (event: IIntelligenceToolExecutionEndEvent) => void | Promise<void>;

    // #endregion
}
