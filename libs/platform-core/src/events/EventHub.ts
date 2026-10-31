// #region Imports

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { IEventKey } from './EventKey.js';
import { IEventMap } from './IEventMap.js';

// #endregion

/**
 * Represents the notification envelope stored in the {@link EventHub}.
 *
 * @private
 */
type EventName = PropertyKey;

/**
 * @private
 */
type EventNotification<TKey extends EventName, TPayload> = {
    event: TKey;
    payload: TPayload;
};

/**
 * @private
 */
type AnyEventNotification = EventNotification<EventName, unknown>;

/**
 * Provides a strongly typed event hub that can publish and subscribe to events.
 *
 * @public
 */
@Injectable()
export class EventHub implements OnModuleDestroy {
    // #region Fields

    private readonly _eventSubject: Subject<AnyEventNotification>;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link EventHub} class.
     */
    public constructor() {
        this._eventSubject = new Subject<AnyEventNotification>();
    }

    // #endregion

    // #region Properties

    /**
     * Gets the observable sequence that exposes all events published within the hub.
     *
     * @public
     * @readonly
     */
    public get events(): Observable<AnyEventNotification> {
        return this._eventSubject.asObservable();
    }

    // #endregion

    // #region Methods

    /**
     * Publishes an event with the specified payload to all subscribers.
     *
     * @public
     * @param eventKey The event key identifying the target event
     * @param payload The payload associated with the event
     */
    public publish<TEvents extends IEventMap, TKey extends keyof TEvents>(eventKey: IEventKey<TEvents, TKey>, payload: TEvents[TKey]): void {
        if (eventKey === undefined || eventKey === null) {
            throw new Error('The event key is required.');
        }

        const notification: EventNotification<TKey, TEvents[TKey]> = {
            event: eventKey.event,
            payload,
        };

        this._eventSubject.next(notification);
    }

    /**
     * Subscribes to the specified event and invokes the handler whenever the event is published.
     *
     * @public
     * @param eventKey The event key to subscribe to
     * @param handler The handler that is invoked when the event is emitted
     * @returns The subscription that can be disposed to unsubscribe from the event stream
     */
    public subscribe<TEvents extends IEventMap, TKey extends keyof TEvents>(
        eventKey: IEventKey<TEvents, TKey>,
        handler: (payload: TEvents[TKey]) => void,
    ): Subscription {
        if (handler === undefined || handler === null) {
            throw new Error('The event handler is required.');
        }

        return this.observe<TEvents, TKey>(eventKey).subscribe({
            next: handler,
        });
    }

    /**
     * Returns an observable that emits payloads for the specified event.
     *
     * @public
     * @param eventKey The event key to observe
     * @returns An observable sequence that emits payloads of the specified event
     */
    public observe<TEvents extends IEventMap, TKey extends keyof TEvents>(eventKey: IEventKey<TEvents, TKey>): Observable<TEvents[TKey]> {
        if (eventKey === undefined || eventKey === null) {
            throw new Error('The event key is required.');
        }

        return this._eventSubject.pipe(
            filter(this.createEventFilter(eventKey.event)),
            map((notification) => notification.payload as TEvents[TKey]),
        );
    }

    /**
     * Completes the event stream when the module is destroyed.
     *
     * @public
     */
    public onModuleDestroy(): void {
        this._eventSubject.complete();
    }

    /**
     * Creates a type guard function to filter events by name.
     *
     * @private
     * @param eventName The name of the event to filter
     * @returns A type guard function that checks if a notification matches the specified event name
     */
    private createEventFilter<TKey extends EventName>(
        eventName: TKey,
    ): (notification: AnyEventNotification) => notification is EventNotification<TKey, unknown> {
        return (notification): notification is EventNotification<TKey, unknown> => notification.event === eventName;
    }

    // #endregion
}
