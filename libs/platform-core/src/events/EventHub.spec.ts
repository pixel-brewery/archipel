import { describe, expect, it, vi } from 'vitest';
import { EventHub } from './EventHub.js';
import { createEventKey } from './EventKey.js';
import { IEventMap } from './IEventMap.js';

interface ITestEvents extends IEventMap {
    ping: number;
    message: string;
}

const PING_EVENT_KEY = createEventKey<ITestEvents, 'ping'>('ping');
const MESSAGE_EVENT_KEY = createEventKey<ITestEvents, 'message'>('message');

describe('EventHub', () => {
    it('delivers the payload to the subscribed handler', () => {
        const service = new EventHub();
        const handler = vi.fn();
        const subscription = service.subscribe(PING_EVENT_KEY, handler);

        service.publish(PING_EVENT_KEY, 42);

        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler).toHaveBeenCalledWith(42);

        subscription.unsubscribe();
    });

    it('does not notify handlers subscribed to other events', () => {
        const service = new EventHub();
        const pingHandler = vi.fn();
        const messageHandler = vi.fn();

        const pingSubscription = service.subscribe(PING_EVENT_KEY, pingHandler);
        const messageSubscription = service.subscribe(MESSAGE_EVENT_KEY, messageHandler);

        service.publish(PING_EVENT_KEY, 21);

        expect(pingHandler).toHaveBeenCalledTimes(1);
        expect(messageHandler).not.toHaveBeenCalled();

        pingSubscription.unsubscribe();
        messageSubscription.unsubscribe();
    });

    it('completes active subscriptions when the module is destroyed', () => {
        const service = new EventHub();
        const completeSpy = vi.fn();

        const subscription = service.observe(PING_EVENT_KEY).subscribe({
            complete: completeSpy,
        });

        service.onModuleDestroy();

        expect(completeSpy).toHaveBeenCalledTimes(1);

        subscription.unsubscribe();
    });
});
