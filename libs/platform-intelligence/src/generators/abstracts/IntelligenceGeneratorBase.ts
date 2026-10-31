import { Logger } from '@nestjs/common';
import type { IntelligenceCapability } from '../../contracts/IntelligenceCapability.js';
import { IntelligenceProviderError } from '../../errors/IntelligenceProviderError.js';
import { IntelligenceModelResolver } from '../../IntelligenceModelResolver.js';
import { isRetryableIntelligenceProviderError } from '../../providers/isRetryableIntelligenceProviderError.js';

/**
 * Shared provider-resolution and failure boundary for capability generators.
 *
 * @internal
 */
export abstract class IntelligenceGeneratorBase {
    // #region Fields

    protected readonly modelResolver: IntelligenceModelResolver;

    private readonly _logger: Logger;

    // #endregion

    // #region Ctor

    protected constructor(modelResolver: IntelligenceModelResolver, loggerContext: string) {
        this.modelResolver = modelResolver;
        this._logger = new Logger(loggerContext);
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    protected createProviderError(
        error: unknown,
        provider: string,
        model: string,
        capability: IntelligenceCapability,
        operation: string,
        requestId: string | undefined,
        startedAt: number,
    ): IntelligenceProviderError {
        const retryable = isRetryableIntelligenceProviderError(error);
        this._logger.error({
            message: `Intelligence ${capability} call failed`,
            requestId: requestId ?? 'unknown',
            module: 'platform-intelligence',
            operation,
            provider,
            model,
            duration: Date.now() - startedAt,
            retryable,
        });

        return new IntelligenceProviderError(
            `The intelligence ${capability} provider request failed.`,
            provider,
            model,
            retryable,
            error instanceof Error ? error : undefined,
        );
    }

    // #endregion
}
