import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContextLogger } from './ContextLogger.js';
import { LoggerModule } from './LoggerModule.js';

describe('LoggerModule', () => {
    // #region Methods

    afterEach(() => {
        Logger.overrideLogger(undefined as never);
    });

    it('should provide a Logger with the configured log level', async () => {
        // arrange
        const configServiceMock = {
            tryGet: vi.fn().mockReturnValue('debug'),
        };
        const overrideSpy = vi.spyOn(Logger, 'overrideLogger');

        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }), LoggerModule],
        })
            .overrideProvider(ConfigService)
            .useValue(configServiceMock)
            .overrideProvider(ContextLogger)
            .useValue(new ContextLogger('test'))
            .compile();

        // act
        const logger = moduleRef.get(Logger);

        // assert
        expect(logger).toBeInstanceOf(Logger);
        expect(configServiceMock.tryGet).toHaveBeenCalledWith('APP_LOG_LEVEL', 'warn');
        expect(overrideSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                options: expect.objectContaining({
                    logLevels: ['debug'],
                    structuredParams: true,
                }),
            }),
        );
    });

    it('should fall back to warn when APP_LOG_LEVEL is not set', async () => {
        // arrange
        const configServiceMock = {
            tryGet: vi.fn().mockReturnValue('warn'),
        };
        const overrideSpy = vi.spyOn(Logger, 'overrideLogger');

        const moduleRef = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy() }), LoggerModule],
        })
            .overrideProvider(ConfigService)
            .useValue(configServiceMock)
            .overrideProvider(ContextLogger)
            .useValue(new ContextLogger('test'))
            .compile();

        // act
        const logger = moduleRef.get(Logger);

        // assert
        expect(logger).toBeInstanceOf(Logger);
        expect(overrideSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                options: expect.objectContaining({
                    logLevels: ['warn'],
                    structuredParams: true,
                }),
            }),
        );
    });

    // #endregion
});
