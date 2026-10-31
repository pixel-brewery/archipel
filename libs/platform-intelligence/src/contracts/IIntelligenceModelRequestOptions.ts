// #region Imports

import type { IIntelligenceModelReference } from './IIntelligenceModelReference.js';
import type { IntelligenceProviderOptions } from './IntelligenceProviderOptions.js';

// #endregion

/**
 * Shared provider/model controls for intelligence operations.
 *
 * @remarks
 * Provider APIs do not expose one portable idempotency-key contract across all
 * capabilities. A provider operation can therefore be billed or materialize an
 * asset more than once after ambiguous transport failure. Consumers must
 * deduplicate the owning business operation and persist usage or generated
 * assets idempotently.
 *
 * @public
 */
export interface IIntelligenceModelRequestOptions {
    // #region Properties

    /** Optional provider/model override. */
    readonly model?: IIntelligenceModelReference;

    /** Correlation identifier included in structured Archipel logs. */
    readonly requestId?: string;

    /** Total provider-operation timeout in milliseconds. */
    readonly timeoutMs?: number;

    /** Optional provider-specific settings. */
    readonly providerOptions?: IntelligenceProviderOptions;

    // #endregion
}
