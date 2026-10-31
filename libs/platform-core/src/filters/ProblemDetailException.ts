// #region Imports

import { HttpException } from '@nestjs/common';
import type { IProblemDetailExceptionOptions } from './IProblemDetailExceptionOptions.js';
import type { ProblemDetail } from './ProblemDetail.js';

// #endregion

/**
 * A NestJS HttpException that represents a Problem Detail as per RFC 7807.
 *
 * @remarks
 * Response headers that belong to the problem, such as `Retry-After` or
 * `WWW-Authenticate`, travel with the exception and are sent by
 * {@link ProblemDetailExceptionFilter}.
 *
 * @example
 * ```typescript
 * throw new ProblemDetailException(
 *     HttpStatus.TOO_MANY_REQUESTS,
 *     { title: 'Rate Limit Exceeded', detail: 'Too many requests.', code: 'RATE_LIMIT' },
 *     { headers: { 'Retry-After': '42' } },
 * );
 * ```
 *
 * @public
 */
export class ProblemDetailException extends HttpException {
    // #region Fields

    private readonly _headers: Readonly<Record<string, string>>;

    // #endregion

    // #region Ctor

    constructor(responseCode: number, args: ProblemDetail, options?: IProblemDetailExceptionOptions) {
        super(args, responseCode);

        this._headers = Object.freeze({ ...options?.headers });
    }

    // #endregion

    // #region Methods

    public override getResponse(): ProblemDetail {
        return super.getResponse() as ProblemDetail;
    }

    /**
     * Returns the response headers that belong to this problem.
     *
     * @returns The headers, empty when the problem has none.
     */
    public getHeaders(): Readonly<Record<string, string>> {
        return this._headers;
    }

    // #endregion
}
