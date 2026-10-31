// #region Imports

import type { FactoryProvider } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { IntelligenceToolBase } from '../abstracts/IntelligenceToolBase.js';
import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import { IntelligenceConfigurationError } from '../errors/IntelligenceConfigurationError.js';
import { IntelligenceToolRegistry } from '../IntelligenceToolRegistry.js';
import { provideIntelligenceTools } from './provideIntelligenceTools.js';

// #endregion

class EchoTool extends IntelligenceToolBase<Record<string, never>, string> {
    // #region Properties

    public override get name(): string {
        return 'echo';
    }

    public override get tool(): IIntelligenceToolDefinition<Record<string, never>, string> {
        return {
            description: 'Echo test tool.',
            inputSchema: z.object({}),
            execute: async () => 'echo',
        };
    }

    // #endregion
}

class OtherTool extends IntelligenceToolBase<Record<string, never>, string> {
    // #region Properties

    public override get name(): string {
        return 'other';
    }

    public override get tool(): IIntelligenceToolDefinition<Record<string, never>, string> {
        return {
            description: 'Other test tool.',
            inputSchema: z.object({}),
            execute: async () => 'other',
        };
    }

    // #endregion
}

describe('provideIntelligenceTools', () => {
    it('registers feature-owned tool instances through one unique provider', () => {
        const provider = provideIntelligenceTools([EchoTool, OtherTool]);
        const registry = new IntelligenceToolRegistry();

        const result = provider.useFactory?.(registry, new EchoTool(), new OtherTool());

        expect(result).toBe(true);
        expect(registry.listNames()).toEqual(['echo', 'other']);
        expect(provider.provide).toBeTypeOf('symbol');
    });

    it('rejects empty and duplicate provider declarations', () => {
        expect(() => provideIntelligenceTools([])).toThrow(IntelligenceConfigurationError);
        expect(() => provideIntelligenceTools([EchoTool, EchoTool])).toThrow(IntelligenceConfigurationError);
    });

    it('fails closed when another contribution already owns the tool name', () => {
        const provider: FactoryProvider<true> = provideIntelligenceTools([EchoTool]);
        const registry = new IntelligenceToolRegistry();
        registry.register(new EchoTool());

        expect(() => provider.useFactory?.(registry, new EchoTool())).toThrow('already registered by another contribution');
    });
});
