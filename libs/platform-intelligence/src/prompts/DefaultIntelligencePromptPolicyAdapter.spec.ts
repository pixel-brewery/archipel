// #region Imports

import { describe, expect, it } from 'vitest';
import { IntelligenceValidationError } from '../errors/IntelligenceValidationError.js';
import { DefaultIntelligencePromptPolicyAdapter } from './DefaultIntelligencePromptPolicyAdapter.js';

// #endregion

describe('default intelligence prompt policy', () => {
    // #region Methods

    it('should preserve native options and add mode capabilities', async () => {
        // arrange
        const adapter = new DefaultIntelligencePromptPolicyAdapter();

        // act
        const result = await adapter.resolve({
            promptName: 'crm.duplicate-detection',
            promptVersion: 1,
            mode: 'object',
            requestedPolicy: {
                options: {
                    temperature: 0,
                    maxOutputTokens: 800,
                },
                model: { strategy: 'automatic' },
            },
            context: {},
        });

        // assert
        expect(result).toEqual({
            options: {
                temperature: 0,
                maxOutputTokens: 800,
            },
            capabilities: ['textInput', 'textOutput', 'structuredOutput'],
        });
    });

    it('should require an application adapter for abstract model policy', async () => {
        // arrange
        const adapter = new DefaultIntelligencePromptPolicyAdapter();

        // act
        const promise = adapter.resolve({
            promptName: 'catalog.product.analysis',
            promptVersion: 1,
            mode: 'object',
            requestedPolicy: {
                quality: 'balanced',
                reasoning: 'low',
            },
            context: {},
        });

        // assert
        await expect(promise).rejects.toBeInstanceOf(IntelligenceValidationError);
    });

    // #endregion
});
