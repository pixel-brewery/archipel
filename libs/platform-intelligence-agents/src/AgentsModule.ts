import { Module, type DynamicModule } from '@nestjs/common';
import type { IAgentsModuleOptions } from './interfaces/IAgentsModuleOptions.js';
import { AgentRuntimeFactory } from './AgentRuntimeFactory.js';
import { AgentInferenceBase } from './abstracts/AgentInferenceBase.js';
import { IntelligenceInferenceAdapter } from './adapters/IntelligenceInferenceAdapter.js';

/**
 * Multi-agent orchestration layered above platform-intelligence. No global runtime or credentials.
 *
 * @public
 */
@Module({})
export class AgentsModule {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Imports the consumer's configured IntelligenceModule, or an application inference adapter's dependencies.
     *
     * @param options - Explicit owner configuration and operation budgets.
     * @returns A dynamic NestJS module exposing the inference abstract base and runtime factory.
     */
    public static register(options: IAgentsModuleOptions = {}): DynamicModule {
        return {
            module: AgentsModule,
            imports: options.imports ?? [],
            providers: [{ provide: AgentInferenceBase, useClass: options.inference ?? IntelligenceInferenceAdapter }, AgentRuntimeFactory],
            exports: [AgentInferenceBase, AgentRuntimeFactory],
        };
    }
    // #endregion
}
