// #region Imports

import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { LocalAuthGuard } from './LocalAuthGuard.js';

// #endregion

describe('LocalAuthGuard', () => {
    // #region Methods

    it('should resolve without explicit Passport module options', async () => {
        // arrange
        const testingModuleBuilder = Test.createTestingModule({
            providers: [LocalAuthGuard],
        });

        // act
        const moduleRef = await testingModuleBuilder.compile();

        // assert
        expect(moduleRef.get(LocalAuthGuard)).toBeInstanceOf(LocalAuthGuard);
    });

    // #endregion
});
