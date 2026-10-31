// #region Imports

import { describe, expect, it, vi } from 'vitest';
import { IntelligenceProviderDiagnostics } from './IntelligenceProviderDiagnostics.js';

// #endregion

describe('IntelligenceProviderDiagnostics', () => {
    // #region Methods

    it('delegates bounded availability checks to the selected provider adapter', async () => {
        // arrange
        const probeResult = {
            status: 'operational',
            provider: 'test',
            model: 'test-model',
            capability: 'language',
            checkedAt: new Date('2026-07-24T08:00:00.000Z'),
            failureCode: null,
        } as const;
        const probe = vi.fn().mockResolvedValue(probeResult);
        const request = {
            capability: 'language',
            configuration: {
                provider: 'test',
                model: 'test-model',
                apiKey: 'secret',
                baseUrl: null,
                temperature: 0,
                topP: 1,
                maxOutputTokens: 1_024,
            },
            operationTimeoutMs: 3_000,
            providerRequestTimeoutMs: 3_000,
        } as const;
        const diagnostics = new IntelligenceProviderDiagnostics({
            resolveRequest: vi.fn(() => ({
                adapter: { provider: 'test', capabilities: ['language'], load: vi.fn(), probe },
                request,
            })),
        } as never);

        // act
        const result = await diagnostics.probe();

        // assert
        expect(result).toBe(probeResult);
        expect(probe).toHaveBeenCalledWith(request);
    });

    it('reports degraded local readiness when a provider has no remote probe', async () => {
        // arrange
        const load = vi.fn().mockResolvedValue({});
        const diagnostics = new IntelligenceProviderDiagnostics({
            resolveRequest: vi.fn(() => ({
                adapter: { provider: 'test', capabilities: ['embedding'], load },
                request: {
                    capability: 'embedding',
                    configuration: {
                        provider: 'test',
                        model: 'embedding-model',
                        apiKey: null,
                        baseUrl: null,
                        temperature: 0,
                        topP: 1,
                        maxOutputTokens: 1_024,
                    },
                    operationTimeoutMs: 3_000,
                    providerRequestTimeoutMs: 3_000,
                },
            })),
        } as never);

        // act
        const result = await diagnostics.probe('embedding');

        // assert
        expect(result).toMatchObject({
            status: 'degraded',
            provider: 'test',
            model: 'embedding-model',
            capability: 'embedding',
            failureCode: 'REMOTE_PROBE_UNSUPPORTED',
        });
        expect(load).toHaveBeenCalledTimes(1);
    });

    // #endregion
});
