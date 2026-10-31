import type { IntelligenceRealtimeMeteringEvent } from '../contracts/IntelligenceRealtimeMeteringEvent.js';

/**
 * Application abstract base for idempotently persisting realtime billing and audit events.
 *
 * Implementations should treat `eventId` as an idempotency key and persist the
 * commercial debit and AI audit record in one application transaction.
 *
 * @public
 */
export abstract class IntelligenceRealtimeMeteringBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Persists one metering event.
     *
     * @param event - Normalized, idempotently identifiable metering event.
     */
    public abstract report(event: IntelligenceRealtimeMeteringEvent): Promise<void>;

    // #endregion
}
