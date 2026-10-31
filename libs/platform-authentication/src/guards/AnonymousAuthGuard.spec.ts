// #region Imports

import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { AnonymousAuthGuard } from './AnonymousAuthGuard.js';

// #endregion

describe('AnonymousAuthGuard', () => {
    // #region Methods

    it('should resolve without explicit Passport module options', async () => {
        // arrange
        const testingModuleBuilder = Test.createTestingModule({
            providers: [AnonymousAuthGuard],
        });

        // act
        const moduleRef = await testingModuleBuilder.compile();

        // assert
        expect(moduleRef.get(AnonymousAuthGuard)).toBeInstanceOf(AnonymousAuthGuard);
    });

    // #endregion
});
