/**
 * Error raised by a realtime session, transport, or metering adapter.
 *
 * @public
 */
export class IntelligenceRealtimeError extends Error {
    // #region Fields

    public readonly phase: 'configuration' | 'token' | 'connect' | 'send' | 'receive' | 'metering' | 'close';
    public readonly provider: string;
    public readonly model: string;
    public readonly sessionId: string;
    public readonly isRetryable: boolean;

    // #endregion

    // #region Ctor

    public constructor(
        message: string,
        phase: IntelligenceRealtimeError['phase'],
        provider: string,
        model: string,
        sessionId: string,
        isRetryable: boolean,
        cause?: Error,
    ) {
        super(message);
        this.name = 'IntelligenceRealtimeError';
        this.phase = phase;
        this.provider = provider;
        this.model = model;
        this.sessionId = sessionId;
        this.isRetryable = isRetryable;
        if (cause) {
            this.cause = cause;
        }
    }

    // #endregion

    // #region Properties

    // #endregion

    // #region Methods

    // #endregion
}
