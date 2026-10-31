/**
 * Provider-neutral browser setup needed before creating a WebRTC SDP offer.
 *
 * @public
 */
export interface IIntelligenceRealtimeWebRTCConfiguration {
    // #region Properties

    readonly connectionMode: 'webrtc';
    readonly provider: string;
    readonly model: string;
    readonly dataChannelLabel: string;

    // #endregion
}
