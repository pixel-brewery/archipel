// #region Imports

import { describe, expect, it, vi } from 'vitest';

import { SessionSerializer } from './SessionSerializer.js';

// #endregion

// #region Tests

describe('SessionSerializer', () => {
    describe('serializeUser', () => {
        it('should pass the user through unchanged', () => {
            // arrange
            const serializer = new SessionSerializer();
            const user = { id: 'user-1', email: 'test@example.com' };
            const done = vi.fn();

            // act
            serializer.serializeUser(user, done);

            // assert
            expect(done).toHaveBeenCalledWith(null, user);
        });
    });

    describe('deserializeUser', () => {
        it('should pass the payload through unchanged', () => {
            // arrange
            const serializer = new SessionSerializer();
            const payload = 'serialized-session-payload';
            const done = vi.fn();

            // act
            serializer.deserializeUser(payload, done);

            // assert
            expect(done).toHaveBeenCalledWith(null, payload);
        });
    });
});

// #endregion
