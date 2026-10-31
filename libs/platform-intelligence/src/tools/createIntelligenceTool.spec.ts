// #region Imports

import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';
import { createIntelligenceTool } from './createIntelligenceTool.js';

// #endregion

describe('createIntelligenceTool', () => {
    it('should create a provider-neutral registry entry', () => {
        const definition: IIntelligenceToolDefinition = {
            description: 'Echoes a value.',
            inputSchema: z.object({ value: z.string() }),
        };

        expect(createIntelligenceTool('echo', definition)).toEqual({
            name: 'echo',
            tool: definition,
        });
    });
});
