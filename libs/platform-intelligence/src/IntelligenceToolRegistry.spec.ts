// #region Imports

import { beforeEach, describe, expect, it } from 'vitest';
import { z } from 'zod';
import { IntelligenceToolBase } from './abstracts/IntelligenceToolBase.js';
import type { IIntelligenceToolDefinition } from './contracts/IIntelligenceToolDefinition.js';
import { IntelligenceToolRegistry } from './IntelligenceToolRegistry.js';
import { createIntelligenceProviderTool } from './providers/createIntelligenceProviderTool.js';

// #endregion

class EchoTool extends IntelligenceToolBase<{ readonly value: string }, { readonly value: string }> {
    // #region Fields

    private readonly _name: string;

    // #endregion

    // #region Ctor

    public constructor(name = 'echo') {
        super();
        this._name = name;
    }

    // #endregion

    // #region Properties

    public override get name(): string {
        return this._name;
    }

    public override get tool(): IIntelligenceToolDefinition<{ readonly value: string }, { readonly value: string }> {
        return {
            description: 'Echoes a value.',
            inputSchema: z.object({ value: z.string() }),
            execute: async (input) => ({ value: input.value }),
        };
    }

    // #endregion

    // #region Methods

    // #endregion
}

describe('IntelligenceToolRegistry', () => {
    let registry: IntelligenceToolRegistry;

    beforeEach(() => {
        registry = new IntelligenceToolRegistry();
    });

    it('should register, replace, and enumerate provider-neutral tools', () => {
        const first = new EchoTool();
        const replacement = new EchoTool();
        registry.register(first);
        registry.register(replacement);

        expect(registry.count).toBe(1);
        expect(registry.get('echo')).toBe(replacement);
        expect(registry.listNames()).toEqual(['echo']);
        expect(registry.toToolSet()['echo']?.description).toBe('Echoes a value.');
    });

    it('should keep provider-owned definitions out of the public neutral tool set', () => {
        registry.register(createIntelligenceProviderTool('native', { type: 'provider-defined' }));

        expect(registry.toToolSet()).toEqual({});
        expect(registry.toExecutionToolSet()).toHaveProperty('native');
    });

    it('should validate tool names', () => {
        expect(() => registry.register(new EchoTool(''))).toThrow('must not be empty');
        expect(() => registry.register(new EchoTool(' echo '))).toThrow('leading or trailing spaces');
    });

    it('should enforce a configured registry capacity without replacing registered tools', () => {
        // arrange
        registry = new IntelligenceToolRegistry(2);
        registry.register(new EchoTool('first'));
        registry.register(new EchoTool('second'));

        // act
        registry.register(new EchoTool('third'));

        // assert
        expect(registry.listNames()).toEqual(['first', 'second']);
        expect(registry.has('third')).toBe(false);
    });

    it('should reject an invalid registry capacity', () => {
        // arrange
        const action = (): IntelligenceToolRegistry => new IntelligenceToolRegistry(0);

        // act / assert
        expect(action).toThrow('capacity must be a positive safe integer');
    });
});
