import { NotFoundException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SseHub } from './SseHub.js';

describe('SseHub', () => {
    // #region Fields

    let hub: SseHub;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        hub = new SseHub();
    });

    describe('registerEvent', () => {
        it('should register an event', () => {
            hub.registerEvent('event-1');
            expect(hub.isEventActive('event-1')).toBe(true);
        });

        it('should throw when registering a duplicate event', () => {
            hub.registerEvent('event-1');
            expect(() => hub.registerEvent('event-1')).toThrow();
        });
    });

    describe('unregisterEvent', () => {
        it('should remove a registered event', () => {
            hub.registerEvent('event-1');
            hub.unregisterEvent('event-1');
            expect(hub.isEventActive('event-1')).toBe(false);
        });

        it('should be a no-op for unknown events', () => {
            expect(() => hub.unregisterEvent('unknown')).not.toThrow();
        });
    });

    describe('emitEvent', () => {
        it('should emit event data to subscribers', async () => {
            // arrange
            hub.registerEvent('event-1');
            const observable = hub.getObservable('event-1');
            const payloadPromise = firstValueFrom(observable);

            // act
            hub.emitEvent('event-1', { action: 'test:emit', payload: { value: 42 } });

            // assert
            const data = await payloadPromise;
            expect(data).toEqual({ action: 'test:emit', payload: { value: 42 } });
        });

        it('should auto-register events on emit if not registered', () => {
            hub.emitEvent('auto-event', { action: 'create:item', payload: null });
            expect(hub.isEventActive('auto-event')).toBe(true);
        });
    });

    describe('clearEvent', () => {
        it('should remove and complete the event subject', () => {
            hub.registerEvent('event-1');
            hub.clearEvent('event-1');
            expect(hub.isEventActive('event-1')).toBe(false);
        });
    });

    describe('getObservable', () => {
        it('should throw NotFoundException for unregistered events', () => {
            expect(() => hub.getObservable('unknown')).toThrow(NotFoundException);
        });
    });

    // #endregion
});
