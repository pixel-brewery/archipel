import { type CallHandler, type ExecutionContext, Inject, Injectable, type NestInterceptor, Optional } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { recordHttpRequest } from '../http/recordHttpRequest.js';
import { MeasurementsService } from './MeasurementsService.js';
import { DiagnosticsService } from './DiagnosticsService.js';
import { MEASUREMENTS_OPTIONS } from './MeasurementsOptionsToken.js';
import type { IMeasurementsModuleOptions } from './MeasurementsModuleOptions.js';

/** Records completed HTTP request values through the direct measurement path. */
@Injectable()
export class MeasurementsInterceptor implements NestInterceptor {
    // #region Fields

    private readonly _measurements: MeasurementsService;
    private readonly _diagnostics: DiagnosticsService | null;
    private readonly _lifecycle: boolean;

    // #endregion

    // #region Ctor

    public constructor(
        @Inject(MeasurementsService) measurements: MeasurementsService,
        @Optional() @Inject(DiagnosticsService) diagnostics: DiagnosticsService | null = null,
        @Optional() @Inject(MEASUREMENTS_OPTIONS) options?: IMeasurementsModuleOptions,
    ) {
        this._measurements = measurements;
        this._diagnostics = diagnostics;
        this._lifecycle = Boolean(options?.httpLifecycle);
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return recordHttpRequest(
            context,
            next,
            (method, path, status, durationMs) => {
                if (!this._lifecycle) this._measurements.recordHttpRequest(method, path, status, durationMs);
            },
            (error, method, path, status) => this._diagnostics?.failure('http', 'request', error, { method, path, status }),
        );
    }

    // #endregion
}
