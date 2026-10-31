import type { ModuleMetadata, Type } from '@nestjs/common';
import type { AgentInferenceBase } from '../abstracts/AgentInferenceBase.js';

/**
 * Consumer modules can provide an inference adapter; the default composes platform-intelligence.
 *
 * @public
 */
export interface IAgentsModuleOptions {
    /**
     * Consumer-configured NestJS modules exporting dependencies of the selected adapter.
     */
    readonly imports?: ModuleMetadata['imports'];
    /**
     * Injectable inference adapter class; defaults to IntelligenceInferenceAdapter.
     */
    readonly inference?: Type<AgentInferenceBase>;
}
