// #region Imports

import { describe, expect, it, vi } from 'vitest';
import type { IIntelligenceProviderProbeResult } from '../contracts/IIntelligenceProviderProbeResult.js';
import { IntelligenceHealthIndicator } from './IntelligenceHealthIndicator.js';

// #endregion

describe('IntelligenceHealthIndicator', () => {
    // #region Methods

    it('should report disabled when no capability registry exists', async () => {
        // arrange
        const indicator = new IntelligenceHealthIndicator();

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            intelligence: {
                status: 'up',
                disabled: true,
            },
        });
    });

    it('should expose providers by capability and realtime session state', async () => {
        // arrange
        const providerRegistry = {
            listProviders: vi.fn().mockReturnValue(['openai', 'gateway']),
            listProvidersFor: vi.fn((capability: string) => (capability === 'image' ? ['openai', 'gateway'] : ['gateway'])),
        } as never;
        const diagnostics = {
            probe: vi.fn().mockResolvedValue({
                status: 'operational',
                provider: 'gateway',
                model: 'openai/gpt-5.6',
                capability: 'language',
                checkedAt: new Date('2026-07-24T08:00:00.000Z'),
                failureCode: null,
            } satisfies IIntelligenceProviderProbeResult),
        } as never;
        const realtimeSessionFactory = {
            registeredProviders: ['gateway'],
            activeSessionCount: 2,
        } as never;
        const indicator = new IntelligenceHealthIndicator(providerRegistry, diagnostics, realtimeSessionFactory);

        // act
        const result = await indicator.check();

        // assert
        expect(result['intelligence']).toEqual(
            expect.objectContaining({
                status: 'up',
                providerStatus: 'operational',
                provider: 'gateway',
                model: 'openai/gpt-5.6',
                failureCode: null,
                checkedAt: '2026-07-24T08:00:00.000Z',
                providers: ['openai', 'gateway'],
                capabilities: expect.objectContaining({
                    language: ['gateway'],
                    image: ['openai', 'gateway'],
                    realtime: ['gateway'],
                }),
                realtime: {
                    enabled: true,
                    providers: ['gateway'],
                    activeSessions: 2,
                },
            }),
        );
    });

    it('should report configuration failures as down without leaking provider errors', async () => {
        // arrange
        const providerRegistry = {
            listProviders: vi.fn().mockReturnValue(['openai']),
            listProvidersFor: vi.fn().mockReturnValue(['openai']),
        } as never;
        const diagnostics = {
            probe: vi.fn(() => {
                throw new Error('Invalid default model');
            }),
        } as never;
        const indicator = new IntelligenceHealthIndicator(providerRegistry, diagnostics);

        // act
        const result = await indicator.check();

        // assert
        expect(result).toEqual({
            intelligence: expect.objectContaining({
                status: 'down',
                failureCode: 'INTELLIGENCE_HEALTH_CHECK_FAILED',
            }),
        });
        expect(result['intelligence']).not.toHaveProperty('error');
    });

    // #endregion
});
