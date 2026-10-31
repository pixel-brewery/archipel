// #region Imports

import { IHealthIndicator } from '@pixel-brewery/archipel-platform-health';
import { Injectable, Logger, Optional } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { IntelligenceCapabilityNames } from '../contracts/IntelligenceCapabilityNames.js';
import { IntelligenceProviderDiagnostics } from '../IntelligenceProviderDiagnostics.js';
import { IntelligenceProviderRegistry } from '../IntelligenceProviderRegistry.js';
import { IntelligenceRealtimeSessionFactory } from '../IntelligenceRealtimeSessionFactory.js';

// #endregion

/**
 * Health indicator for the intelligence infrastructure.
 * Performs a bounded remote readiness probe for the default language model and
 * reports the locally registered capability topology.
 *
 * @public
 */
@Injectable()
export class IntelligenceHealthIndicator implements IHealthIndicator {
    // #region Fields

    private static readonly _HEALTH_PROBE_TIMEOUT_MS = 3_000;
    private readonly _diagnostics?: IntelligenceProviderDiagnostics;
    private readonly _logger = new Logger(IntelligenceHealthIndicator.name);
    private readonly _providerRegistry?: IntelligenceProviderRegistry;
    private readonly _realtimeSessionFactory?: IntelligenceRealtimeSessionFactory;

    // #endregion

    // #region Ctor

    public constructor(
        @Optional() providerRegistry?: IntelligenceProviderRegistry,
        @Optional() diagnostics?: IntelligenceProviderDiagnostics,
        @Optional() realtimeSessionFactory?: IntelligenceRealtimeSessionFactory,
    ) {
        this._providerRegistry = providerRegistry;
        this._diagnostics = diagnostics;
        this._realtimeSessionFactory = realtimeSessionFactory;
    }

    // #endregion

    // #region Properties

    public readonly key: string = 'intelligence';

    // #endregion

    // #region Methods

    /**
     * Verifies that the provider configuration can be resolved.
     * Returns disabled status when no intelligence generator is configured.
     *
     * @public
     * @returns The health indicator result.
     */
    public async check(): Promise<HealthIndicatorResult<string>> {
        if (!this._providerRegistry || !this._diagnostics || this._providerRegistry.listProviders().length === 0) {
            return {
                intelligence: {
                    status: 'up',
                    disabled: true,
                },
            };
        }

        const startedAt = Date.now();

        try {
            const probe = await this._diagnostics.probe(IntelligenceCapabilityNames.Language, undefined, IntelligenceHealthIndicator._HEALTH_PROBE_TIMEOUT_MS);
            const capabilities = Object.fromEntries(
                Object.values(IntelligenceCapabilityNames).map((capability) => [capability, this._providerRegistry?.listProvidersFor(capability) ?? []]),
            );

            return {
                intelligence: {
                    status: probe.status === 'down' ? 'down' : 'up',
                    providerStatus: probe.status,
                    provider: probe.provider,
                    model: probe.model,
                    failureCode: probe.failureCode,
                    checkedAt: probe.checkedAt.toISOString(),
                    providers: this._providerRegistry.listProviders(),
                    capabilities,
                    duration: Date.now() - startedAt,
                    ...(this._realtimeSessionFactory
                        ? {
                              realtime: {
                                  enabled: this._realtimeSessionFactory.registeredProviders.length > 0,
                                  providers: this._realtimeSessionFactory.registeredProviders,
                                  activeSessions: this._realtimeSessionFactory.activeSessionCount,
                              },
                          }
                        : {}),
                },
            };
        } catch {
            this._logger.warn('Intelligence readiness check failed.', {
                requestId: 'health',
                module: 'platform-intelligence',
                operation: 'health.check',
                duration: Date.now() - startedAt,
            });

            return {
                intelligence: {
                    status: 'down',
                    failureCode: 'INTELLIGENCE_HEALTH_CHECK_FAILED',
                    duration: Date.now() - startedAt,
                },
            };
        }
    }

    // #endregion
}
