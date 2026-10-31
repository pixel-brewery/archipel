// #region Imports

import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, LoggerService } from '@nestjs/common';
import { validateHeaderName, validateHeaderValue } from 'node:http';
import { ProblemDetailException } from './ProblemDetailException.js';
import type { ProblemDetailTypeUrlResolver } from './ProblemDetailTypeUrlResolver.js';

// #endregion

/**
 * Headers that frame the problem body. The filter owns them, so a problem can never override them.
 */
const RESERVED_HEADER_NAMES: ReadonlySet<string> = new Set(['content-type', 'content-length', 'transfer-encoding']);

/**
 * A NestJS exception filter that transforms exceptions into Problem Details
 * compliant responses as per RFC 7807.
 *
 * @public
 */
@Catch()
export class ProblemDetailExceptionFilter implements ExceptionFilter<HttpException> {
    // #region Fields

    private _logger: LoggerService | undefined;

    // #endregion

    // #region Ctor

    public constructor(protected urlResolver?: ProblemDetailTypeUrlResolver) {}

    // #endregion

    // #region Methods

    public catch(exception: Error, host: ArgumentsHost) {
        if (exception instanceof ProblemDetailException) return this.handleProblemDetail(exception, host);

        if (exception instanceof BadRequestException) return this.handleBadRequestException(exception, host);

        if (exception instanceof HttpException) return this.handleHttpException(exception, host);

        return this.handleRawError(exception, host);
    }

    public setLogger(logger: LoggerService) {
        this._logger = logger;
    }

    private getTypeUrlForCode(code: number, title: string): string {
        if (this.urlResolver) return this.urlResolver(code, title);
        return `https://httpstatuses.com/${code}`;
    }

    private handleProblemDetail(e: ProblemDetailException, host: ArgumentsHost) {
        const { type, title, detail, instance, ...additionalProperties } = e.getResponse();

        const response = {
            status: e.getStatus(),
            type: type || this.getTypeUrlForCode(e.getStatus(), title),
            title,
            detail,
            instance: instance || host.switchToHttp().getRequest().url,
            ...additionalProperties,
        };

        this.logException(e, e.getStatus());

        const httpResponse = host.switchToHttp().getResponse();
        this.applyHeaders(httpResponse, e.getHeaders());

        return httpResponse.status(e.getStatus()).header('Content-Type', 'application/problem+json').send(response);
    }

    private handleBadRequestException(e: BadRequestException, host: ArgumentsHost) {
        const title = e.name
            .replace('Exception', '')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim();

        const errorResponse = e.getResponse();
        const message =
            typeof errorResponse === 'object' && errorResponse !== null && 'message' in errorResponse
                ? (errorResponse as { message: string | string[] }).message
                : e.message;
        const detail = Array.isArray(message) ? message[0] : message;

        const response = {
            status: e.getStatus(),
            type: this.getTypeUrlForCode(e.getStatus(), title),
            title,
            detail,
            instance: host.switchToHttp().getRequest().url,
        };

        this.logException(e, e.getStatus());

        host.switchToHttp().getResponse().status(e.getStatus()).header('Content-Type', 'application/problem+json').send(response);
    }

    private handleHttpException(e: HttpException, host: ArgumentsHost) {
        const title = e.name
            .replace('Exception', '')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim();

        const response = {
            status: e.getStatus(),
            type: this.getTypeUrlForCode(e.getStatus(), title),
            title,
            detail: e.message,
            instance: host.switchToHttp().getRequest().url,
        };

        this.logException(e, e.getStatus());

        host.switchToHttp().getResponse().status(e.getStatus()).header('Content-Type', 'application/problem+json').send(response);
    }

    private handleRawError(e: Error, host: ArgumentsHost) {
        const title = 'Internal Server Error';

        const response = {
            status: 500,
            type: this.getTypeUrlForCode(500, title),
            title,
            detail: 'An unexpected error occurred.',
            instance: host.switchToHttp().getRequest().url,
        };

        this.logException(e, 500);

        host.switchToHttp().getResponse().status(500).header('Content-Type', 'application/problem+json').send(response);
    }

    private applyHeaders(response: { header(name: string, value: string): unknown }, headers: Readonly<Record<string, string>>): void {
        for (const [name, value] of Object.entries(headers)) {
            if (RESERVED_HEADER_NAMES.has(name.toLowerCase())) {
                continue;
            }

            try {
                validateHeaderName(name);
                validateHeaderValue(name, value);
            } catch {
                // The value is deliberately not logged: it may carry request-derived data.
                this._logger?.warn(`Ignoring the invalid problem header "${name}".`);
                continue;
            }

            response.header(name, value);
        }
    }

    private logException(exception: Error, status: number): void {
        if (!this._logger) {
            return;
        }

        if (status >= 500) {
            this._logger.error(exception);
            return;
        }

        this._logger.warn(exception);
    }

    // #endregion
}
