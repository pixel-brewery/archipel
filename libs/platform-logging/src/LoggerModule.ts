// #region Imports

import { ConfigModule, ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ConsoleLogger, Global, Logger, Module, type LogLevel } from '@nestjs/common';
import { ContextLogger } from './ContextLogger.js';
import { APP_LOG_LEVEL, PLATFORM_LOGGING_CONFIG_ENTRIES } from './env.js';
import { RequestIdMiddleware } from './RequestIdMiddleware.js';

// #endregion

/**
 * Global logging module that configures the NestJS Logger with an application-wide log level
 * and provides request-scoped context propagation via {@link RequestIdMiddleware}.
 *
 * @remarks
 * Apply {@link RequestIdMiddleware} in your `AppModule.configure()` to enable
 * automatic `requestId` propagation to all log entries via {@link ContextLogger}.
 *
 * @public
 */
@Global()
@Module({
    imports: [ConfigModule.register('platform-logging', PLATFORM_LOGGING_CONFIG_ENTRIES)],
    providers: [
        {
            useFactory: (configService: ConfigService) => {
                const level = configService.tryGet<LogLevel>(APP_LOG_LEVEL.key, 'warn');
                const validLevels: ReadonlyArray<string> = ['log', 'error', 'warn', 'debug', 'verbose'];
                if (!validLevels.includes(level)) {
                    throw new Error(`Invalid log level '${level}'. Must be one of: ${validLevels.join(', ')}`);
                }
                Logger.overrideLogger(
                    new ConsoleLogger({
                        logLevels: [level],
                        structuredParams: true,
                    }),
                );
                return new Logger();
            },
            provide: Logger,
            inject: [ConfigService],
        },
        RequestIdMiddleware,
        ContextLogger,
    ],
    exports: [Logger, RequestIdMiddleware, ContextLogger],
})
export class LoggerModule {}
