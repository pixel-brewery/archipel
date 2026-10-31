// #region Imports

import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContextStore } from './RequestContextStore.js';

// #endregion

/** Header name used to propagate the request correlation ID. */
export const REQUEST_ID_HEADER = 'x-request-id';

/**
 * NestJS middleware that extracts or generates a unique request ID
 * and stores it in the {@link RequestContextStore} via `AsyncLocalStorage`.
 *
 * @remarks
 * If the incoming request already carries a `x-request-id` header (e.g. from
 * an API gateway or load balancer), the middleware reuses that value.
 * Otherwise it generates a new UUID v4.
 *
 * The request ID is also set on the response headers for traceability.
 *
 * @public
 */
@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
    // #region Methods

    /**
     * @inheritDoc
     */
    public use(req: Request, res: Response, next: (error?: Error) => void): void {
        const requestId = (req.headers[REQUEST_ID_HEADER] as string) || randomUUID();

        res.setHeader(REQUEST_ID_HEADER, requestId);

        RequestContextStore.run({ requestId }, () => {
            next();
        });
    }

    // #endregion
}
