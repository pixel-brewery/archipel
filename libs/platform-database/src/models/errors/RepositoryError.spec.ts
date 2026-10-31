// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from './RepositoryError.js';
import { RepositoryErrorKinds } from './RepositoryErrorKinds.js';

// #endregion

// #region Tests

describe('RepositoryError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should set the message', () => {
        // arrange / act
        const error = new RepositoryError('something failed');

        // assert
        expect(error.message).toBe('something failed');
    });

    it('should have the name "RepositoryError"', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error.name).toBe('RepositoryError');
    });

    it('should have the code "REPOSITORY_ERROR"', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error.code).toBe('REPOSITORY_ERROR');
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(RepositoryError);
    });

    it('should store the optional originalCode', () => {
        // arrange / act
        const error = new RepositoryError('fail', 'P2002');

        // assert
        expect(error.originalCode).toBe('P2002');
    });

    it('should store optional meta', () => {
        // arrange
        const meta = { target: ['email'] };

        // act
        const error = new RepositoryError('fail', 'P2002', meta);

        // assert
        expect(error.meta).toEqual({ target: ['email'] });
    });

    it('should leave originalCode and meta undefined when not provided', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error.originalCode).toBeUndefined();
        expect(error.meta).toBeUndefined();
    });

    it('should have a stack trace', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error.stack).toBeDefined();
    });

    it('should be unclassified when no kind is given', () => {
        // arrange / act
        const error = new RepositoryError('fail');

        // assert
        expect(error.kind).toBe(RepositoryErrorKinds.Unclassified);
    });

    it('should carry the given classification', () => {
        // arrange / act
        const error = new RepositoryError('fail', 'R_KNOWN', { code: 'P2002' }, RepositoryErrorKinds.UniqueConstraintViolation);

        // assert
        expect(error.kind).toBe(RepositoryErrorKinds.UniqueConstraintViolation);
    });
});

// #endregion
