// #region Imports

import { describe, expect, it } from 'vitest';

import { JwtPayloadBase } from './JwtPayloadBase.js';

// #endregion

// #region Tests

describe('JwtPayloadBase', () => {
    describe('fromJSON', () => {
        it('should create an instance from a raw payload', () => {
            // arrange
            const raw = {
                id: 'user-1',
                email: 'john@example.com',
                roles: ['user', 'admin'],
            };

            // act
            const payload = JwtPayloadBase.fromJSON(raw);

            // assert
            expect(payload.id).toBe('user-1');
            expect(payload.email).toBe('john@example.com');
            expect(payload.roles).toEqual(['user', 'admin']);
        });

        it('should default email to null when missing', () => {
            // arrange
            const raw = { id: 'user-2', roles: ['user'] };

            // act
            const payload = JwtPayloadBase.fromJSON(raw);

            // assert
            expect(payload.email).toBeNull();
        });

        it('should default roles to empty array when missing', () => {
            // arrange
            const raw = { id: 'user-3', email: 'a@b.com' };

            // act
            const payload = JwtPayloadBase.fromJSON(raw);

            // assert
            expect(payload.roles).toEqual([]);
        });
    });

    describe('toJSON', () => {
        it('should serialize to a plain object with base claims', () => {
            // arrange
            const payload = JwtPayloadBase.fromJSON({
                id: 'user-1',
                email: 'john@example.com',
                roles: ['user'],
            });

            // act
            const json = payload.toJSON();

            // assert
            expect(json).toEqual({
                id: 'user-1',
                email: 'john@example.com',
                roles: ['user'],
            });
        });

        it('should produce a fresh roles array to prevent mutation', () => {
            // arrange
            const payload = JwtPayloadBase.fromJSON({
                id: 'user-1',
                email: null,
                roles: ['admin'],
            });

            // act
            const json = payload.toJSON();

            // assert
            expect(json['roles']).toEqual(['admin']);
            expect(json['roles']).not.toBe(payload.roles);
        });
    });
});

// #endregion
