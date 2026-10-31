import { type DynamicModule, Inject, type MiddlewareConsumer, Module, type NestModule, RequestMethod } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MeasurementSinkBase } from './abstracts/MeasurementSinkBase.js';
import { MeasurementsService } from './MeasurementsService.js';
import { MeasurementsInterceptor } from './MeasurementsInterceptor.js';
import type { IMeasurementsModuleOptions } from './MeasurementsModuleOptions.js';
import { DiagnosticsService } from './DiagnosticsService.js';
import { DIAGNOSTICS_OPTIONS } from './DiagnosticsToken.js';
import { MEASUREMENTS_OPTIONS } from './MeasurementsOptionsToken.js';
import { MeasurementsMiddleware } from './MeasurementsMiddleware.js';

/** Installs one direct measurement sink and optional HTTP instrumentation. */
@Module({})
export class MeasurementsModule implements NestModule {
    // #region Fields

    private readonly _options: IMeasurementsModuleOptions;

    // #endregion

    // #region Ctor

    public constructor(@Inject(MEASUREMENTS_OPTIONS) options: IMeasurementsModuleOptions) {
        this._options = options;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public static register(options: IMeasurementsModuleOptions): DynamicModule {
        return {
            module: MeasurementsModule,
            global: options.isGlobal ?? false,
            imports: options.imports,
            providers: [
                { provide: MEASUREMENTS_OPTIONS, useValue: options },
                ...(options.providers ?? []),
                options.sink,
                { provide: MeasurementSinkBase, useExisting: options.sink },
                MeasurementsService,
                ...(options.diagnostics ? [{ provide: DIAGNOSTICS_OPTIONS, useValue: options.diagnostics }, DiagnosticsService] : []),
                ...(options.httpLifecycle ? [MeasurementsMiddleware] : []),
                ...(options.httpInterceptor || options.httpLifecycle ? [{ provide: APP_INTERCEPTOR, useClass: MeasurementsInterceptor }] : []),
            ],
            exports: [
                MeasurementSinkBase,
                MeasurementsService,
                options.sink,
                ...(options.diagnostics ? [DiagnosticsService] : []),
                ...(options.httpLifecycle ? [MeasurementsMiddleware] : []),
            ],
        };
    }

    public configure(consumer: MiddlewareConsumer): void {
        if (this._options.httpLifecycle === true) consumer.apply(MeasurementsMiddleware).forRoutes({ path: '{*path}', method: RequestMethod.ALL });
    }

    // #endregion
}
