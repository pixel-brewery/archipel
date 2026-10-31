// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@prisma/client', () => {
    return {
        PrismaClient: class MockPrismaClient {
            public $connect = vi.fn().mockResolvedValue(undefined);
            public $disconnect = vi.fn().mockResolvedValue(undefined);
            constructor(_options?: unknown) {
                /* noop */
            }
        },
    };
});

import { PrismaService } from './PrismaService.js';

// #endregion

// #region Tests

describe('PrismaService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createService(tryGetReturn = true) {
        const configService = {
            tryGet: vi.fn().mockReturnValue(tryGetReturn),
        };

        return {
            service: new PrismaService(configService as never),
            configService,
        };
    }

    describe('onModuleInit', () => {
        it('should connect when auto-connection is not disabled', async () => {
            // arrange
            const { service, configService } = createService(false);
            configService.tryGet.mockReturnValue(false);

            // act
            await service.onModuleInit();

            // assert
            expect((service as unknown as Record<string, unknown>)['$connect']).toBeDefined();
        });

        it('should skip connection when auto-connection is disabled', async () => {
            // arrange
            const { service } = createService(true);
            const connectSpy = vi.spyOn(service as unknown as { $connect: () => Promise<void> }, '$connect');

            // act
            await service.onModuleInit();

            // assert
            expect(connectSpy).not.toHaveBeenCalled();
        });
    });

    describe('onModuleDestroy', () => {
        it('should disconnect when auto-connection is not disabled', async () => {
            // arrange
            const { service, configService } = createService(false);
            configService.tryGet.mockReturnValue(false);
            const disconnectSpy = vi.spyOn(service as unknown as { $disconnect: () => Promise<void> }, '$disconnect');

            // act
            await service.onModuleDestroy();

            // assert
            expect(disconnectSpy).toHaveBeenCalled();
        });

        it('should skip disconnect when auto-connection is disabled', async () => {
            // arrange
            const { service } = createService(true);
            const disconnectSpy = vi.spyOn(service as unknown as { $disconnect: () => Promise<void> }, '$disconnect');

            // act
            await service.onModuleDestroy();

            // assert
            expect(disconnectSpy).not.toHaveBeenCalled();
        });
    });
});

// #endregion
