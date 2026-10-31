// #region Imports

import { describe, expect, it } from 'vitest';
import { createEventKey } from './EventKey.js';

// #endregion

// #region Tests

describe('createEventKey', () => {
    it('should return an object with the correct event name', () => {
        // arrange
        interface TestEvents {
            'user.created': { id: string };
        }

        // act
        const key = createEventKey<TestEvents, 'user.created'>('user.created');

        // assert
        expect(key.event).toBe('user.created');
    });

    it('should have the EventKey brand', () => {
        // arrange
        interface TestEvents {
            'order.placed': { orderId: string };
        }

        // act
        const key = createEventKey<TestEvents, 'order.placed'>('order.placed');

        // assert
        expect(key._brand).toBe('EventKey');
    });

    it('should create distinct instances for different event names', () => {
        // arrange
        interface TestEvents {
            'event.a': void;
            'event.b': void;
        }

        // act
        const keyA = createEventKey<TestEvents, 'event.a'>('event.a');
        const keyB = createEventKey<TestEvents, 'event.b'>('event.b');

        // assert
        expect(keyA).not.toBe(keyB);
        expect(keyA.event).not.toBe(keyB.event);
    });
});

// #endregion
