// #region Imports

import { Inject, Injectable, type NestMiddleware } from '@nestjs/common';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { MeasurementsService } from './MeasurementsService.js';

// #endregion

/** Measures response completion, including guards, serialization, unmatched routes and client aborts. */
@Injectable()
export class MeasurementsMiddleware implements NestMiddleware {
    // #region Fields

    private readonly _measurements: MeasurementsService;

    // #endregion

    // #region Ctor

    public constructor(@Inject(MeasurementsService) measurements: MeasurementsService) {
        this._measurements = measurements;
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public use(request: IncomingMessage & { route?: { path?: string | readonly string[] } }, response: ServerResponse, next: () => void): void {
        const started = performance.now();
        let recorded = false;
        const complete = (): void => {
            if (recorded) return;
            recorded = true;
            response.off('finish', complete);
            response.off('close', complete);
            const template = request.route?.path;
            const path = typeof template === 'string' && !template.includes('*') ? template : 'unmatched';
            const method = /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS|CONNECT|TRACE)$/.test(request.method ?? '') ? request.method! : 'UNKNOWN';
            this._measurements.recordHttpRequest(method, path, String(response.writableFinished ? response.statusCode : 499), performance.now() - started);
        };
        response.once('finish', complete);
        response.once('close', complete);
        next();
    }

    // #endregion
}
