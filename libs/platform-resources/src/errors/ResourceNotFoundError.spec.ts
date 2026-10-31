// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResourceNotFoundError } from './ResourceNotFoundError.js';

// #endregion

// #region Tests

describe('ResourceNotFoundError', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have code RESOURCE_NOT_FOUND', () => {
        // arrange / act
        const error = new ResourceNotFoundError('my-key');

        // assert
        expect(error.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should store the key', () => {
        // arrange / act
        const error = new ResourceNotFoundError('template.html');

        // assert
        expect(error.key).toBe('template.html');
    });

    it('should include key in the message', () => {
        // arrange / act
        const error = new ResourceNotFoundError('missing-resource');

        // assert
        expect(error.message).toContain('missing-resource');
    });

    it('should be an instance of Error', () => {
        // arrange / act
        const error = new ResourceNotFoundError('key');

        // assert
        expect(error).toBeInstanceOf(Error);
    });
});

// #endregion
