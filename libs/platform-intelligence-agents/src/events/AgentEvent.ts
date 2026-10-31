/**
 * Represents a semantic event with producer identity and optional loop correlation.
 *
 * @public
 */
export class AgentEvent<TPayload = unknown, TType extends string = string> {
    // #region Fields
    /**
     * Semantic discriminator used by participant situation predicates.
     */
    public readonly type: TType;
    /**
     * Identifier of the participant that produced the event.
     */
    public readonly producerId: string;
    /**
     * Occurrence timestamp copied from the constructor argument.
     */
    public readonly occurredAt: Date;
    /**
     * Event data whose authorization, redaction and retention are owned by the consumer.
     */
    public readonly payload: TPayload;
    /**
     * Correlation identifier of the originating agent loop, when applicable.
     */
    public readonly loopId?: string;
    // #endregion

    // #region Ctor
    /**
     * Creates a semantic event and defensively copies its occurrence timestamp.
     *
     * @param type - Semantic event type or state discriminator.
     * @param producerId - Identity of the participant that produced the event.
     * @param payload - Event data owned and authorized by the consuming application.
     * @param loopId - Identifier of the active or paused loop.
     * @param occurredAt - Occurrence timestamp to copy into the event.
     */
    public constructor(type: TType, producerId: string, payload: TPayload, loopId?: string, occurredAt: Date = new Date()) {
        this.type = type;
        this.producerId = producerId;
        this.payload = payload;
        this.loopId = loopId;
        this.occurredAt = new Date(occurredAt);
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
