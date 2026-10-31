// #region Imports

import { describe, expect, it } from 'vitest';

import { resolveMfaState } from './MfaState.js';

// #endregion

// #region Tests

describe('resolveMfaState', () => {
    it('should return typed state when raw has channels property', () => {
        // arrange
        const raw = {
            preferredMethod: 'totp',
            channels: {
                totp: { enabled: true, secret: 'abc' },
            },
            trustedDevices: ['device-1'],
        };

        // act
        const result = resolveMfaState(raw);

        // assert
        expect(result.preferredMethod).toBe('totp');
        expect(result.channels).toEqual({ totp: { enabled: true, secret: 'abc' } });
        expect(result.trustedDevices).toEqual(['device-1']);
    });

    it('should default trustedDevices to empty array when missing', () => {
        // arrange
        const raw = {
            channels: { sms: { enabled: false } },
        };

        // act
        const result = resolveMfaState(raw);

        // assert
        expect(result.trustedDevices).toEqual([]);
    });

    it('should default channels to empty object when null', () => {
        // arrange
        const raw = {
            channels: null,
        };

        // act
        const result = resolveMfaState(raw);

        // assert
        expect(result.channels).toEqual({});
    });

    it('should return empty state for null input', () => {
        // act
        const result = resolveMfaState(null);

        // assert
        expect(result).toEqual({ channels: {}, trustedDevices: [] });
    });

    it('should return empty state for undefined input', () => {
        // act
        const result = resolveMfaState(undefined);

        // assert
        expect(result).toEqual({ channels: {}, trustedDevices: [] });
    });

    it('should return empty state for a primitive value', () => {
        // act
        const result = resolveMfaState('some string');

        // assert
        expect(result).toEqual({ channels: {}, trustedDevices: [] });
    });

    it('should return empty state for an object without channels', () => {
        // arrange
        const raw = { preferredMethod: 'totp' };

        // act
        const result = resolveMfaState(raw);

        // assert
        expect(result).toEqual({ channels: {}, trustedDevices: [] });
    });

    it('should preserve preferredMethod from raw input', () => {
        // arrange
        const raw = {
            preferredMethod: 'email',
            channels: {},
            trustedDevices: [],
        };

        // act
        const result = resolveMfaState(raw);

        // assert
        expect(result.preferredMethod).toBe('email');
    });
});

// #endregion
