import type { AgentEvent } from '../events/AgentEvent.js';

/**
 * Application-owned audit, telemetry or distributed-event adapter. No vendor cloud dependency.
 *
 * @public
 */
export abstract class AgentEventSinkBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Delivers a semantic event to an application-owned audit or transport boundary.
     *
     * @remarks
     * Delivery is asynchronous and does not provide a transactional outbox. Consumers own scoping, redaction,
     * deduplication and persistence.
     * @param event - Event selected for delivery, including participant and optional loop correlation.
     * @returns Completes synchronously or resolves after delivery finishes.
     */
    public abstract publish(event: AgentEvent): void | Promise<void>;

    // #endregion
}
