import { describe, expect, it } from 'vitest';
import { describeDatabaseFailure } from './describeDatabaseFailure.js';

describe('describeDatabaseFailure', () => {
    it('classifies a pool acquisition timeout without a provider code', () => {
        // arrange
        const error = new Error('timeout exceeded when trying to connect');

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'pool_timeout',
            'error.code': 'POOL_ACQUIRE_TIMEOUT',
            'cause.code': 'POOL_ACQUIRE_TIMEOUT',
        });
    });

    it.each([
        ['start failure', 'Unable to start a transaction in the given time.'],
        ['closed transaction', 'Transaction already closed: A query cannot be executed on an expired transaction.'],
        ['rollback failure', 'Failed to rollback transaction.'],
        ['unrecognized transaction failure', 'private provider transaction detail'],
    ])('classifies a Prisma %s without inferring its lifecycle phase or exporting its message', (_scenario, message) => {
        // arrange
        const error = Object.assign(new Error(message), { code: 'P2028' });

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'transaction',
            'error.code': 'P2028',
            'cause.code': 'P2028',
        });
    });

    it('retains the outer provider and nested transaction codes', () => {
        // arrange
        const error = { code: 'P2039', cause: { code: 'P2028', message: 'private transaction state' } };

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'transaction',
            'error.code': 'P2039',
            'cause.code': 'P2028',
        });
    });

    it('prefers an observed pool acquisition timeout over a transaction failure', () => {
        // arrange
        const error = { code: 'P2028', cause: new Error('timeout exceeded when waiting for connection') };

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'pool_timeout',
            'error.code': 'P2028',
            'cause.code': 'P2028',
        });
    });

    it('classifies Prisma pool acquisition failures without message inspection', () => {
        // arrange
        const error = { code: 'P2024' };

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'pool_timeout',
            'error.code': 'P2024',
            'cause.code': 'P2024',
        });
    });

    it('retains the PostgreSQL rule code inside a wrapped Prisma driver failure without private text', () => {
        // arrange
        const error = {
            code: 'P2039',
            message: 'private SQL credentials',
            meta: {
                driverAdapterError: { cause: { originalCode: 'P0001', message: 'private row data' } },
            },
        };
        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'database_rule',
            'error.code': 'P2039',
            'cause.code': 'P0001',
        });
    });

    it('handles circular causes without replacing the original failure', () => {
        // arrange
        const circular: { cause?: unknown; code: string } = { code: 'ECONNRESET' };
        circular.cause = circular;

        // act
        const failure = describeDatabaseFailure(circular);

        // assert
        expect(failure['failure.kind']).toBe('connection');
    });

    it('handles malicious accessors without replacing the original failure', () => {
        // arrange
        const hostile = Object.defineProperty({}, 'code', {
            get: () => {
                throw new Error('getter failed');
            },
        });

        // act
        const failure = describeDatabaseFailure(hostile);

        // assert
        expect(failure['error.code']).toBe('UNKNOWN');
    });

    it('does not export primitive thrown values', () => {
        // arrange
        const error = 'private SQL';

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'unknown',
            'error.code': 'UNKNOWN',
            'cause.code': 'UNKNOWN',
        });
    });

    it('stops inspecting causes after twelve distinct objects', () => {
        // arrange
        let error: { code?: string; cause?: unknown } = { code: 'P2028' };
        for (let depth = 0; depth < 12; depth++) {
            error = { cause: error };
        }

        // act
        const failure = describeDatabaseFailure(error);

        // assert
        expect(failure).toEqual({
            'failure.kind': 'unknown',
            'error.code': 'UNKNOWN',
            'cause.code': 'UNKNOWN',
        });
    });
});
