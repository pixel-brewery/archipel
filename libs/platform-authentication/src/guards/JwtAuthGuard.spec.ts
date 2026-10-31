// #region Imports

import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { JwtAuthGuard } from './JwtAuthGuard.js';

// #endregion

describe('JwtAuthGuard', () => {
    // #region Methods

    it('should resolve with its declared reflector dependency', async () => {
        // arrange
        const testingModuleBuilder = Test.createTestingModule({
            providers: [JwtAuthGuard, Reflector],
        });

        // act
        const moduleRef = await testingModuleBuilder.compile();

        // assert
        expect(moduleRef.get(JwtAuthGuard)).toBeInstanceOf(JwtAuthGuard);
    });

    // #endregion
});
