// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MappingModule } from './MappingModule.js';
import { MappingService } from './MappingService.js';

// #endregion

// #region Tests

describe('MappingModule', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return a DynamicModule from withProfiles', () => {
        // arrange
        const mockProfile = class TestProfile {
            public configure(): void {
                /* no-op */
            }
        };

        // act
        const result = MappingModule.withProfiles([mockProfile as never]);

        // assert
        expect(result.module).toBe(MappingModule);
        expect(result.exports).toContain(MappingService);
    });

    it('should include profile providers in the DynamicModule', () => {
        // arrange
        const mockProfile = class TestProfile {
            public configure(): void {
                /* no-op */
            }
        };

        // act
        const result = MappingModule.withProfiles([mockProfile as never]);

        // assert
        const providers = result.providers as Array<{ provide: unknown; useClass?: unknown; useFactory?: unknown }>;
        const profileProvider = providers.find((p) => p.provide === mockProfile);
        expect(profileProvider).toBeDefined();
        expect(profileProvider!.useClass).toBe(mockProfile);
    });

    it('should include MAPPING_PROFILE_BOOTSTRAP factory', () => {
        // arrange
        const mockProfile = class TestProfile {
            public configure(): void {
                /* no-op */
            }
        };

        // act
        const result = MappingModule.withProfiles([mockProfile as never]);

        // assert
        const providers = result.providers as Array<{ provide: unknown; useFactory?: unknown }>;
        const bootstrapProvider = providers.find((p) => p.provide === 'MAPPING_PROFILE_BOOTSTRAP');
        expect(bootstrapProvider).toBeDefined();
        expect(bootstrapProvider!.useFactory).toBeTypeOf('function');
    });

    it('should register profiles via the bootstrap factory', () => {
        // arrange
        const configureSpy = vi.fn();
        const mockProfile = class TestProfile {
            public configure = configureSpy;
        };
        const result = MappingModule.withProfiles([mockProfile as never]);
        const providers = result.providers as Array<{
            provide: unknown;
            useFactory?: (...args: unknown[]) => unknown;
            inject?: unknown[];
        }>;
        const bootstrapProvider = providers.find((p) => p.provide === 'MAPPING_PROFILE_BOOTSTRAP');
        const service = new MappingService();
        const profileInstance = new mockProfile();

        // act
        const factoryResult = bootstrapProvider!.useFactory!(service, profileInstance);

        // assert
        expect(factoryResult).toBe(true);
        expect(configureSpy).toHaveBeenCalled();
    });
});

// #endregion
