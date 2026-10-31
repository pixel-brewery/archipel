import type { ISituationContext } from '../interfaces/ISituationContext.js';

/**
 * Application-owned reaction; async processors do not block other participants.
 *
 * @public
 */
export abstract class SituationProcessorBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Reacts to a matching event without blocking other participants' reactions.
     *
     * @remarks
     * The runtime isolates failures and reports them through drain. The application owns effect idempotency and
     * authorization.
     * @param context - Semantic event and the participant selected by the situation predicate.
     * @returns Completes synchronously or resolves after the reaction finishes.
     */
    public abstract apply(context: ISituationContext): void | Promise<void>;

    // #endregion
}
