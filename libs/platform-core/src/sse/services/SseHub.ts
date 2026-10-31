// #region Imports

import { Injectable, Logger, NotFoundException, OnModuleDestroy } from '@nestjs/common';
import { Observable, Subject, map } from 'rxjs';
import { ISseEventData } from './interfaces/ISseEventData.js';
import { ISseHub } from './interfaces/ISseHub.js';

// #endregion

/**
 * Represents a server-sent event service.
 *
 * @public
 */
@Injectable()
export class SseHub implements ISseHub, OnModuleDestroy {
    // #region Fields

    private static readonly _maxEventSubjects = 10_000;
    private readonly _eventSubjects: Map<string, Subject<ISseEventData>>;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `SseService` class.
     *
     * @public
     */
    public constructor() {
        this._eventSubjects = new Map<string, Subject<ISseEventData>>();
    }

    // #endregion

    // #region Methods

    /**
     * Completes all active event subjects and clears the registry on module destruction.
     *
     * @public
     */
    public onModuleDestroy(): void {
        for (const subject of this._eventSubjects.values()) {
            subject.complete();
        }
        this._eventSubjects.clear();
        Logger.debug('All event subjects cleared on module destroy', 'SseHub');
    }

    /**
     * Registers an event with the specified ID.
     *
     * @public
     * @param id - The ID of the event.
     */
    public registerEvent(id: string): void {
        if (this._eventSubjects.has(id)) {
            throw new Error(`Event with ID ${id} already exists`);
        }

        if (this._eventSubjects.size >= SseHub._maxEventSubjects) {
            throw new Error(`Maximum number of event subjects (${SseHub._maxEventSubjects}) reached`);
        }

        this._eventSubjects.set(id, new Subject<ISseEventData>());
        Logger.debug(`Registered event with ID ${id}`, 'SseHub');
    }

    /**
     * Unregisters an event with the specified ID.
     *
     * @public
     * @param id - The ID of the event.
     */
    public unregisterEvent(id: string): void {
        const eventSubject = this._eventSubjects.get(id);

        if (eventSubject) {
            eventSubject.complete();
            this._eventSubjects.delete(id);
            Logger.debug(`Unregistered event with ID ${id}`, 'SseHub');
        }
    }

    /**
     * Emits an event with the specified ID and data.
     *
     * @public
     * @param id - The ID of the event.
     * @param data - The data of the event.
     */
    public emitEvent(id: string, data: ISseEventData): void {
        let eventSubject = this._eventSubjects.get(id);

        if (!eventSubject) {
            if (this._eventSubjects.size >= SseHub._maxEventSubjects) {
                Logger.warn(`Cannot auto-register event '${id}': maximum subjects (${SseHub._maxEventSubjects}) reached`, 'SseHub');
                return;
            }
            eventSubject = new Subject<ISseEventData>();
            this._eventSubjects.set(id, eventSubject);
        }

        eventSubject.next({
            action: data.action,
            payload: data.payload,
        });
        Logger.debug(`Emitted event with ID ${id}:${data.action}`, 'SseHub');
    }

    /**
     * Clears the event with the specified ID.
     *
     * @public
     * @param id - The ID of the event.
     */
    public clearEvent(id: string): void {
        const eventSubject = this._eventSubjects.get(id);
        if (eventSubject) {
            eventSubject.complete();
            this._eventSubjects.delete(id);
        }

        Logger.debug(`Cleared event with ID ${id}`, 'SseHub');
    }

    /**
     * Determines whether the event with the specified ID is active.
     *
     * @public
     * @param id - The ID of the event.
     * @returns `true` if the event is active; otherwise, `false`.
     */
    public isEventActive(id: string): boolean {
        const eventSubject = this._eventSubjects.get(id);

        return !!eventSubject;
    }

    /**
     * Gets an observable for the event with the specified ID.
     *
     * @public
     * @param eventId - The ID of the event.
     * @returns An observable for the event.
     */
    public getObservable(eventId: string): Observable<ISseEventData> {
        const eventSubject = this._eventSubjects.get(eventId);
        if (!eventSubject) {
            throw new NotFoundException(`Event stream with ID ${eventId} not found`);
        }

        return eventSubject.asObservable().pipe(map((data) => data));
    }

    // #endregion
}
