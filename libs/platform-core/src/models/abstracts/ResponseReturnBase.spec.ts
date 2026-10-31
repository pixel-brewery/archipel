// #region Imports

import { HttpStatus } from '@nestjs/common';
import 'reflect-metadata';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResponseReturnBase } from './ResponseReturnBase.js';

// #endregion

// #region Test Classes

class TestResponse extends ResponseReturnBase<unknown> {}

class ItemDto {
    public id!: number;
    public name!: string;
}

// #endregion

// #region Tests

describe('ResponseReturnBase', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('ok', () => {
        it('should create a successful response with status 200', () => {
            // arrange
            const data = { id: 1, name: 'Test' };

            // act
            const result = TestResponse.ok(ItemDto, data);

            // assert
            expect(result.success).toBe(true);
            expect(result.status).toBe(HttpStatus.OK);
            expect(result.data).toBeDefined();
            expect(result.timestamp).toBeDefined();
        });

        it('should handle array data', () => {
            // arrange
            const data = [
                { id: 1, name: 'A' },
                { id: 2, name: 'B' },
            ];

            // act
            const result = TestResponse.ok(ItemDto, data);

            // assert
            expect(result.success).toBe(true);
            expect(result.status).toBe(HttpStatus.OK);
            expect(Array.isArray(result.data)).toBe(true);
        });
    });

    describe('created', () => {
        it('should create a response with status 201', () => {
            // act
            const result = TestResponse.created(ItemDto, { id: 1, name: 'New' });

            // assert
            expect(result.success).toBe(true);
            expect(result.status).toBe(HttpStatus.CREATED);
        });
    });

    describe('accepted', () => {
        it('should create a response with status 202', () => {
            // act
            const result = TestResponse.accepted(ItemDto, { id: 1, name: 'Pending' });

            // assert
            expect(result.success).toBe(true);
            expect(result.status).toBe(HttpStatus.ACCEPTED);
        });
    });

    describe('noContent', () => {
        it('should create a response with status 204 and no data', () => {
            // act
            const result = TestResponse.noContent();

            // assert
            expect(result.success).toBe(true);
            expect(result.status).toBe(HttpStatus.NO_CONTENT);
            expect(result.data).toBeUndefined();
        });
    });

    describe('badRequest', () => {
        it('should create an error response with status 400', () => {
            // act
            const result = TestResponse.badRequest();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.BAD_REQUEST);
            expect(result.error).toBe('Bad Request');
        });

        it('should accept custom message and details', () => {
            // act
            const result = TestResponse.badRequest('Validation failed', { field: 'email' });

            // assert
            expect(result.error).toBe('Validation failed');
            expect(result.details).toEqual({ field: 'email' });
        });
    });

    describe('unauthorized', () => {
        it('should create an error response with status 401', () => {
            // act
            const result = TestResponse.unauthorized();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.UNAUTHORIZED);
            expect(result.error).toBe('Unauthorized');
        });
    });

    describe('forbidden', () => {
        it('should create an error response with status 403', () => {
            // act
            const result = TestResponse.forbidden();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.FORBIDDEN);
            expect(result.error).toBe('Forbidden');
        });
    });

    describe('notFound', () => {
        it('should create an error response with status 404', () => {
            // act
            const result = TestResponse.notFound();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.NOT_FOUND);
            expect(result.error).toBe('Not Found');
        });
    });

    describe('conflict', () => {
        it('should create an error response with status 409', () => {
            // act
            const result = TestResponse.conflict();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.CONFLICT);
            expect(result.error).toBe('Conflict');
        });
    });

    describe('error', () => {
        it('should create a 500 error response', () => {
            // act
            const result = TestResponse.error();

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(result.error).toBe('Internal Server Error');
        });
    });

    describe('fromError', () => {
        it('should extract message from an Error object', () => {
            // arrange
            const err = new Error('Something failed');

            // act
            const result = TestResponse.fromError(err);

            // assert
            expect(result.success).toBe(false);
            expect(result.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(result.error).toBe('Something failed');
        });

        it('should use "Unexpected error" for non-Error objects', () => {
            // act
            const result = TestResponse.fromError('string error');

            // assert
            expect(result.error).toBe('Unexpected error');
        });

        it('should accept a custom default status', () => {
            // act
            const result = TestResponse.fromError(new Error('fail'), HttpStatus.BAD_GATEWAY);

            // assert
            expect(result.status).toBe(HttpStatus.BAD_GATEWAY);
        });

        it('should sanitize error details and exclude stack/config/request/response keys', () => {
            // arrange
            const err = { message: 'fail', name: 'TestError', stack: 'stack trace', code: 'ERR_TEST' };

            // act
            const result = TestResponse.fromError(err);

            // assert
            const details = result.details as Record<string, unknown>;
            expect(details).toBeDefined();
            expect(details['name']).toBe('TestError');
            expect(details['code']).toBe('ERR_TEST');
            expect(details['stack']).toBeUndefined();
        });
    });

    describe('timestamp', () => {
        it('should have a valid ISO timestamp on all responses', () => {
            // act
            const result = TestResponse.ok(ItemDto, { id: 1, name: 'Test' });

            // assert
            expect(() => new Date(result.timestamp).toISOString()).not.toThrow();
        });
    });
});

// #endregion
