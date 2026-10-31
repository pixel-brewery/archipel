// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResourceModule } from './ResourceModule.js';

// #endregion

// #region Tests

describe('ResourceModule', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return a DynamicModule from forRoot', () => {
        // arrange
        const config = { strategies: [] } as never;

        // act
        const result = ResourceModule.forRoot(config);

        // assert
        expect(result.module).toBe(ResourceModule);
    });

    it('should include ResourceManager in exports', () => {
        // arrange
        const config = { strategies: [] } as never;

        // act
        const result = ResourceModule.forRoot(config);

        // assert
        expect(result.exports).toBeDefined();
        expect((result.exports as unknown[]).length).toBeGreaterThan(0);
    });

    it('should include a factory provider', () => {
        // arrange
        const config = { strategies: [] } as never;

        // act
        const result = ResourceModule.forRoot(config);
        const providers = result.providers as Array<{ useFactory?: (...args: unknown[]) => unknown }>;
        const factoryProvider = providers.find((p) => p.useFactory);

        // assert
        expect(factoryProvider).toBeDefined();
        expect(factoryProvider!.useFactory).toBeTypeOf('function');
    });
});

// #endregion
