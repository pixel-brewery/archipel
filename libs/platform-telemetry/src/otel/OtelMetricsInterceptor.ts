import { type CallHandler, type ExecutionContext, Injectable, type NestInterceptor } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { recordHttpRequest } from '../http/recordHttpRequest.js';
import { MetricsService } from './MetricsService.js';

/** Records completed HTTP requests through OpenTelemetry instruments. */
@Injectable()
export class OtelMetricsInterceptor implements NestInterceptor {
    // #region Fields

    private readonly _metrics: MetricsService;

    // #endregion

    // #region Ctor

    public constructor(metrics: MetricsService) {
        this._metrics = metrics;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return recordHttpRequest(context, next, (method, path, status, durationMs) => this._metrics.recordHttpRequest(method, path, status, durationMs));
    }

    // #endregion
}
