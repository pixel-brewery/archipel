import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { ContextLogger } from './ContextLogger.js';
import { LoggerModule } from './LoggerModule.js';

describe('LoggerModule (DI Integration)', () => {
    // #region Methods

    it('should resolve Logger when the module is imported', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: { APP_LOG_LEVEL: 'warn' },
                }),
                LoggerModule,
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({
                get: (key: string) => (key === 'APP_LOG_LEVEL' ? 'warn' : undefined),
                tryGet: (_key: string, defaultValue?: unknown) => (defaultValue !== undefined ? defaultValue : undefined),
                has: () => false,
            })
            .overrideProvider(ContextLogger)
            .useValue(new ContextLogger('test'))
            .compile();

        // act
        const logger = moduleRef.get(Logger);

        // assert
        expect(logger).toBeInstanceOf(Logger);
    });

    // #endregion
});
