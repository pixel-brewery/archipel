import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { HealthModule } from '@pixel-brewery/archipel-platform-health';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { DatabaseModule } from './DatabaseModule.js';
import { DatabaseService } from './services/DatabaseService.js';
import { PrismaService } from './services/PrismaService.js';

vi.mock('@prisma/client', () => {
    class MockPrismaClient {
        public adapter: unknown;
        public constructor(options?: { adapter?: unknown }) {
            this.adapter = options?.adapter;
        }
        public $connect(): Promise<void> {
            return Promise.resolve();
        }
        public $disconnect(): Promise<void> {
            return Promise.resolve();
        }
    }
    return { PrismaClient: MockPrismaClient };
});

const stubConfigService = {
    get: (key: string) => {
        const map: Record<string, string> = {
            DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        };
        return map[key];
    },
    tryGet: (_key: string, fallback: unknown) => fallback,
    has: () => false,
};

describe('DatabaseModule (DI Integration)', () => {
    // #region Methods

    it('should resolve DatabaseService when forRoot is called', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { DATABASE_URL: 'postgresql://test:test@localhost:5432/test' },
                }),
                HealthModule,
                DatabaseModule.forRoot(),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const service = moduleRef.get(DatabaseService);

        // assert
        expect(service).toBeInstanceOf(DatabaseService);
    });

    it('should resolve DatabaseService when register is called', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { DATABASE_URL: 'postgresql://test:test@localhost:5432/test' },
                }),
                HealthModule,
                DatabaseModule.register(),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const service = moduleRef.get(DatabaseService);

        // assert
        expect(service).toBeInstanceOf(DatabaseService);
    });

    it('should pass adapter config to PrismaService when forRoot is called with adapter', async () => {
        // arrange
        const mockAdapter = { isMockAdapter: true };
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { DATABASE_URL: 'postgresql://test:test@localhost:5432/test' },
                }),
                HealthModule,
                DatabaseModule.forRoot({ adapter: mockAdapter }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const prismaService = moduleRef.get(PrismaService);

        // assert
        expect((prismaService as unknown as { adapter: unknown }).adapter).toBe(mockAdapter);
    });

    it('should pass adapter config to DatabaseService when forRoot is called with adapter', async () => {
        // arrange
        const mockAdapter = { isMockAdapter: true };
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { DATABASE_URL: 'postgresql://test:test@localhost:5432/test' },
                }),
                HealthModule,
                DatabaseModule.forRoot({ adapter: mockAdapter }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const databaseService = moduleRef.get(DatabaseService);

        // assert
        expect((databaseService as unknown as { adapter: unknown }).adapter).toBe(mockAdapter);
    });

    it('should resolve PrismaService when forRoot is called', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { DATABASE_URL: 'postgresql://test:test@localhost:5432/test' },
                }),
                HealthModule,
                DatabaseModule.forRoot(),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const service = moduleRef.get(PrismaService);

        // assert
        expect(service).toBeInstanceOf(PrismaService);
    });

    // #endregion
});
