// #region Imports

import { type FactoryProvider, type Type } from '@nestjs/common';
import { IntelligenceConfigurationError } from '../errors/IntelligenceConfigurationError.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import type { IIntelligenceTool } from '../interfaces/IIntelligenceTool.js';

// #endregion

/**
 * Creates a feature-owned Nest provider that contributes existing tool providers
 * to the application-wide intelligence registry during module bootstrap.
 *
 * The returned provider has a unique token, so unrelated feature modules cannot
 * overwrite one another. Tool-name collisions fail closed instead of silently
 * replacing another feature's implementation.
 *
 * @param toolTypes - Tool classes already provided by the owning feature module.
 * @returns A Nest factory provider that registers the injected tool instances.
 * @public
 */
export function provideIntelligenceTools(toolTypes: ReadonlyArray<Type<IIntelligenceTool>>): FactoryProvider<true> {
    if (toolTypes.length === 0) {
        throw new IntelligenceConfigurationError('At least one intelligence tool provider is required.');
    }

    if (new Set(toolTypes).size !== toolTypes.length) {
        throw new IntelligenceConfigurationError('Intelligence tool provider contributions must be unique.');
    }

    return {
        provide: Symbol('INTELLIGENCE_TOOL_CONTRIBUTION'),
        inject: [IntelligenceToolRegistry, ...toolTypes],
        useFactory: (registry: IntelligenceToolRegistry, ...tools: ReadonlyArray<IIntelligenceTool>): true => {
            for (const tool of tools) {
                if (registry.has(tool.name)) {
                    throw new IntelligenceConfigurationError(`Intelligence tool "${tool.name}" is already registered by another contribution.`);
                }

                registry.register(tool);

                if (registry.get(tool.name) !== tool) {
                    throw new IntelligenceConfigurationError(`Intelligence tool "${tool.name}" could not be registered.`);
                }
            }

            return true;
        },
    };
}
