/**
 * Describes why an upstream realtime connection closed.
 *
 * @public
 */
export interface IIntelligenceRealtimeCloseEvent {
    // #region Properties

    readonly code: number;
    readonly reason: string;
    readonly clean: boolean;

    // #endregion
}
