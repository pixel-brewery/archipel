// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MappingNotRegisteredError } from './MappingNotRegisteredError.js';
import { TypeMappingNotRegisteredError } from './TypeMappingNotRegisteredError.js';

// #endregion

// #region Tests

describe('MappingErrors', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('MappingNotRegisteredError', () => {
        it('should have code MAPPING_NOT_REGISTERED', () => {
            // arrange / act
            const error = new MappingNotRegisteredError('my-key');

            // assert
            expect(error.code).toBe('MAPPING_NOT_REGISTERED');
        });

        it('should include the key in the message', () => {
            // arrange / act
            const error = new MappingNotRegisteredError('my-key');

            // assert
            expect(error.message).toContain('my-key');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new MappingNotRegisteredError('key');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('TypeMappingNotRegisteredError', () => {
        it('should have code TYPE_MAPPING_NOT_REGISTERED', () => {
            // arrange / act
            const error = new TypeMappingNotRegisteredError('Source', 'Dest');

            // assert
            expect(error.code).toBe('TYPE_MAPPING_NOT_REGISTERED');
        });

        it('should include source and destination in the message', () => {
            // arrange / act
            const error = new TypeMappingNotRegisteredError('UserEntity', 'UserDto');

            // assert
            expect(error.message).toContain('UserEntity');
            expect(error.message).toContain('UserDto');
        });

        it('should be an instance of Error', () => {
            // arrange / act
            const error = new TypeMappingNotRegisteredError('A', 'B');

            // assert
            expect(error).toBeInstanceOf(Error);
        });
    });
});

// #endregion
