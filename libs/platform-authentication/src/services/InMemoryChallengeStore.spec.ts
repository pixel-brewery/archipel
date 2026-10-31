// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IMfaChallengeState } from './ChallengeService.js';
import { InMemoryChallengeStore } from './InMemoryChallengeStore.js';

// #endregion

// #region Tests

describe('InMemoryChallengeStore', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createChallenge(overrides?: Partial<IMfaChallengeState>): IMfaChallengeState {
        return {
            id: 'challenge-1',
            userId: 'user-1',
            allowedMethods: ['totp'],
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 60_000),
            attempts: 0,
            ...overrides,
        };
    }

    describe('set / get', () => {
        it('should store and retrieve a challenge', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            const challenge = createChallenge();

            // act
            await store.set('c1', challenge);
            const result = await store.get('c1');

            // assert
            expect(result).toBe(challenge);
        });

        it('should return undefined for a non-existent key', async () => {
            // arrange
            const store = new InMemoryChallengeStore();

            // act
            const result = await store.get('missing');

            // assert
            expect(result).toBeUndefined();
        });

        it('should overwrite an existing entry with the same key', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            const first = createChallenge({ userId: 'user-a' });
            const second = createChallenge({ userId: 'user-b' });

            // act
            await store.set('c1', first);
            await store.set('c1', second);
            const result = await store.get('c1');

            // assert
            expect(result?.userId).toBe('user-b');
        });
    });

    describe('delete', () => {
        it('should remove a stored challenge', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            await store.set('c1', createChallenge());

            // act
            await store.delete('c1');
            const result = await store.get('c1');

            // assert
            expect(result).toBeUndefined();
        });

        it('should not throw when deleting a non-existent key', async () => {
            // arrange
            const store = new InMemoryChallengeStore();

            // act & assert
            await expect(store.delete('missing')).resolves.toBeUndefined();
        });
    });

    describe('capacity guard', () => {
        it('should reject new entries when at max capacity', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            const maxEntries = 10_000;

            // Fill the store to capacity using internal map
            const internalMap = (store as unknown as { _store: Map<string, IMfaChallengeState> })._store;
            for (let i = 0; i < maxEntries; i++) {
                internalMap.set(`key-${i}`, createChallenge({ id: `c-${i}` }));
            }

            // act
            await store.set('overflow-key', createChallenge({ id: 'overflow' }));
            const result = await store.get('overflow-key');

            // assert
            expect(result).toBeUndefined();
            expect(internalMap.size).toBe(maxEntries);
        });

        it('should allow updating an existing key even at max capacity', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            const maxEntries = 10_000;

            const internalMap = (store as unknown as { _store: Map<string, IMfaChallengeState> })._store;
            for (let i = 0; i < maxEntries; i++) {
                internalMap.set(`key-${i}`, createChallenge({ id: `c-${i}` }));
            }

            const updated = createChallenge({ id: 'updated', userId: 'updated-user' });

            // act
            await store.set('key-0', updated);
            const result = await store.get('key-0');

            // assert
            expect(result?.userId).toBe('updated-user');
        });
    });

    describe('onModuleDestroy', () => {
        it('should clear all stored challenges', async () => {
            // arrange
            const store = new InMemoryChallengeStore();
            await store.set('c1', createChallenge());
            await store.set('c2', createChallenge({ id: 'c2' }));

            // act
            store.onModuleDestroy();

            // assert
            expect(await store.get('c1')).toBeUndefined();
            expect(await store.get('c2')).toBeUndefined();
        });
    });
});

// #endregion
