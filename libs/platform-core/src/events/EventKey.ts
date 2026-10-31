// #region Imports

import { IEventMap } from './IEventMap.js';

// #endregion

/**
 * Represents a strongly typed event key that encodes the payload type.
 *
 * @public
 */
export interface IEventKey<TEvents extends IEventMap, TKey extends keyof TEvents> {
    readonly _brand: 'EventKey';
    readonly _events: TEvents;
    readonly _payload: TEvents[TKey];
    readonly event: TKey;
}

/**
 * Creates a branded event key for the {@link EventHub}.
 *
 * @public
 * @param eventName The unique name of the event.
 * @returns The branded event key encoding the payload type.
 */
export function createEventKey<TEvents extends IEventMap, TKey extends keyof TEvents>(eventName: TKey): IEventKey<TEvents, TKey> {
    return {
        _brand: 'EventKey',
        _events: undefined as unknown as TEvents,
        _payload: undefined as unknown as TEvents[TKey],
        event: eventName,
    };
}
