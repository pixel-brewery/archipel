// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import type { IIntelligenceModelReference } from './contracts/IIntelligenceModelReference.js';
import type { IIntelligenceProviderProbeResult } from './contracts/IIntelligenceProviderProbeResult.js';
import type { IntelligenceCapability } from './contracts/IntelligenceCapability.js';
import { IntelligenceCapabilityNames } from './contracts/IntelligenceCapabilityNames.js';
import { IntelligenceModelResolver } from './IntelligenceModelResolver.js';

// #endregion

/**
 * Performs bounded, provider-neutral provider availability diagnostics.
 *
 * @public
 */
@Injectable()
export class IntelligenceProviderDiagnostics {
    // #region Fields

    private readonly _modelResolver: IntelligenceModelResolver;
    private readonly _logger = new Logger(IntelligenceProviderDiagnostics.name);

    // #endregion

    // #region Ctor

    public constructor(modelResolver: IntelligenceModelResolver) {
        this._modelResolver = modelResolver;
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    public async probe(
        capability: IntelligenceCapability = IntelligenceCapabilityNames.Language,
        model?: IIntelligenceModelReference,
        timeoutMs?: number,
    ): Promise<IIntelligenceProviderProbeResult> {
        const startedAt = Date.now();
        const resolved = this._modelResolver.resolveRequest(capability, model, timeoutMs);

        try {
            if (resolved.adapter.probe) {
                return await resolved.adapter.probe(resolved.request);
            }

            await resolved.adapter.load(resolved.request);

            return {
                status: 'degraded',
                provider: resolved.request.configuration.provider,
                model: resolved.request.configuration.model,
                capability,
                checkedAt: new Date(),
                failureCode: 'REMOTE_PROBE_UNSUPPORTED',
            };
        } catch {
            this._logger.warn('Intelligence provider probe failed.', {
                requestId: 'health',
                module: 'platform-intelligence',
                operation: 'provider.probe',
                provider: resolved.request.configuration.provider,
                duration: Date.now() - startedAt,
            });

            return {
                status: 'degraded',
                provider: resolved.request.configuration.provider,
                model: resolved.request.configuration.model,
                capability,
                checkedAt: new Date(),
                failureCode: 'PROVIDER_UNAVAILABLE',
            };
        }
    }

    // #endregion
}
