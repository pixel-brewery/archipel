/**
 * Represents the shape of the event map used by the {@link EventHub}.
 *
 * @public
 */
export interface IEventMap {
    [eventName: string]: unknown;
}
