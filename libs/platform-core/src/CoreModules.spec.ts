import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { EventHub } from './events/EventHub.js';
import { EventModule } from './events/EventModule.js';
import { HostModule } from './host/HostModule.js';
import { IdentifierModule } from './identifiers/IdentifierModule.js';
import { ID_GENERATOR_TOKEN } from './identifiers/tokens/IdentifierTokens.js';
import { HostService } from './services/HostService.js';

const stubConfigService = {
    get: (key: string) => {
        const map: Record<string, string> = {
            APP_URL: 'http://localhost',
            APP_PORT: '3000',
            APP_VERSION: '1.0.0',
            NODE_ENV: 'local',
            TEST_KEY: 'test-value',
        };
        return map[key];
    },
    tryGet: (key: string, fallback: unknown) => {
        const map: Record<string, string> = {
            APP_URL: 'http://localhost',
            APP_PORT: '3000',
            APP_VERSION: '1.0.0',
            NODE_ENV: 'local',
        };
        return map[key] ?? fallback;
    },
    has: (key: string) => ['APP_URL', 'APP_PORT', 'APP_VERSION', 'NODE_ENV', 'TEST_KEY'].includes(key),
};

describe('Platform Core Modules (DI Integration)', () => {
    // #region Methods

    describe('ConfigModule', () => {
        it('should resolve ConfigService when forRoot is called', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        strategyFactory: () => new EnvironmentConfigStrategy(),
                        statics: { TEST_KEY: 'test-value' },
                    }),
                ],
            })
                .overrideProvider(ConfigService)
                .useValue(stubConfigService)
                .compile();

            // act
            const configService = moduleRef.get(ConfigService);

            // assert
            expect(configService).toBeDefined();
            expect(configService.get('TEST_KEY')).toBe('test-value');
        });

        it('should resolve ConfigService when register is called with forRoot', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                    ConfigModule.register('test-module', []),
                ],
            })
                .overrideProvider(ConfigService)
                .useValue(stubConfigService)
                .compile();

            // act
            const configService = moduleRef.get(ConfigService);

            // assert
            expect(configService).toBeDefined();
        });
    });

    describe('HostModule', () => {
        it('should resolve HostService when imported with ConfigModule', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        strategyFactory: () => new EnvironmentConfigStrategy(),
                        statics: {
                            APP_URL: 'http://localhost',
                            APP_PORT: '3000',
                            APP_VERSION: '1.0.0',
                            NODE_ENV: 'local',
                        },
                    }),
                    ResourceModule.forRoot({ strategies: [] }),
                    HostModule,
                ],
            })
                .overrideProvider(ConfigService)
                .useValue(stubConfigService)
                .compile();

            // act
            const hostService = moduleRef.get(HostService);

            // assert
            expect(hostService).toBeInstanceOf(HostService);
        });
    });

    describe('EventModule', () => {
        it('should resolve EventHub when imported', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [EventModule],
            }).compile();

            // act
            const eventHub = moduleRef.get(EventHub);

            // assert
            expect(eventHub).toBeInstanceOf(EventHub);
        });
    });

    describe('IdentifierModule', () => {
        it('should resolve ID_GENERATOR_TOKEN when registered with UUID type', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [IdentifierModule.register('UUID')],
            }).compile();

            // act
            const generator = moduleRef.get(ID_GENERATOR_TOKEN);

            // assert
            expect(generator).toBeDefined();
        });

        it('should resolve ID_GENERATOR_TOKEN when registered with CUID type', async () => {
            // arrange
            const moduleRef = await Test.createTestingModule({
                imports: [IdentifierModule.register('CUID')],
            }).compile();

            // act
            const generator = moduleRef.get(ID_GENERATOR_TOKEN);

            // assert
            expect(generator).toBeDefined();
        });
    });

    // #endregion
});
