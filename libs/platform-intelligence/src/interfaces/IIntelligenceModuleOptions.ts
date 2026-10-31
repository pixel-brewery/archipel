// #region Imports

import type { IConfigRegistryEntry } from '@pixel-brewery/archipel-platform-configuration';
import type { Provider, Type } from '@nestjs/common';
import type { IntelligenceDefaultModels } from '../contracts/IntelligenceDefaultModels.js';
import type { IntelligenceRequestTimeouts } from '../contracts/IntelligenceRequestTimeouts.js';
import type { IntelligenceProviderAdapterBase } from '../providers/abstracts/IntelligenceProviderAdapterBase.js';
import type { IntelligencePromptPolicyBase } from '../prompts/abstracts/IntelligencePromptPolicyBase.js';
import type { IIntelligenceRealtimeModuleOptions } from '../realtime/interfaces/IIntelligenceRealtimeModuleOptions.js';
import type { IIntelligenceTool } from './IIntelligenceTool.js';

// #endregion

/**
 * Options for configuring the intelligence module.
 *
 * @public
 */
export interface IIntelligenceModuleOptions {
    // #region Properties

    /**
     * Tool instances, tool factory promises, class providers, or custom Nest providers registered at bootstrap.
     *
     * @public
     */
    readonly tools?: ReadonlyArray<IIntelligenceTool | Promise<IIntelligenceTool> | Type<IIntelligenceTool> | Provider<IIntelligenceTool>>;

    /**
     * Maximum number of application tools retained by the shared registry.
     *
     * This limits registered definitions, independently from the smaller
     * per-request exposure selected through `activeToolNames` or
     * `deferredToolLoading`.
     *
     * @defaultValue 128
     * @public
     */
    readonly maxTools?: number;

    /**
     * Provider-specific configuration entries to register with the config module.
     *
     * @public
     */
    readonly configEntries?: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>>;

    /**
     * Injectable provider adapter classes imported from tree-shakable provider subpaths.
     *
     * @public
     */
    readonly providerAdapters?: ReadonlyArray<Type<IntelligenceProviderAdapterBase>>;

    /** Capability-specific default provider and model references. */
    readonly defaultModels?: IntelligenceDefaultModels;

    /** Capability-specific total request timeout overrides. */
    readonly requestTimeouts?: IntelligenceRequestTimeouts;

    /**
     * Maximum duration of one outbound provider request.
     *
     * Long-running operations such as video generation use multiple bounded
     * provider requests under their capability-specific total timeout.
     *
     * @defaultValue 5000
     * @public
     */
    readonly providerRequestTimeoutMs?: number;

    /**
     * Server-owned realtime model sessions, resilience limits, and metering.
     *
     * @public
     */
    readonly realtime?: IIntelligenceRealtimeModuleOptions;

    /**
     * Optional application policy adapter for provider-neutral prompt requirements.
     *
     * @public
     */
    readonly promptPolicyAdapter?: Type<IntelligencePromptPolicyBase>;

    /**
     * When `true` the module is registered globally.
     *
     * @public
     */
    readonly isGlobal?: boolean;

    // #endregion
}
