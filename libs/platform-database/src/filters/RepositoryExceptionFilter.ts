// #region Imports

import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { RepositoryError } from '../models/errors/RepositoryError.js';

// #endregion

/**
 * Represents the Prisma client exception filter.
 *
 * @public
 */
@Catch(RepositoryError)
export class RepositoryExceptionFilter implements ExceptionFilter<RepositoryError> {
    // #region Methods

    /**
     * Catches the exception.
     *
     * @public
     * @param exception - The exception.
     * @param host - The host.
     */
    public catch(_exception: RepositoryError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            timestamp: new Date().toISOString(),
            error: 'Repository Error',
            path: request.url,
        });
    }

    // #endregion
}
