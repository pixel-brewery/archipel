// #region Imports

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject, Injectable, Optional } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorTemplateService } from '../services/ErrorTemplateService.js';

// #endregion

/**
 * A global exception filter that handles all uncaught exceptions in the application.
 * Returns HTML error pages for browser requests and JSON for API requests.
 *
 * @public
 */
@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
    // #region Fields

    private readonly _errorTemplateService?: ErrorTemplateService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `GlobalExceptionFilter` class.
     *
     * @public
     * @param errorTemplateService - Optional error template service for HTML rendering.
     */
    public constructor(@Optional() @Inject(ErrorTemplateService) errorTemplateService?: ErrorTemplateService) {
        this._errorTemplateService = errorTemplateService;
    }

    // #endregion

    // #region Methods

    /**
     * Catches the exception and formats the response.
     *
     * @public
     * @param exception - The caught exception.
     * @param host - The arguments host.
     */
    public async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: string | object;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? { message: res } : res;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = { message: 'Internal server error' };
        }

        // Determine if client expects HTML (browser request) or JSON (API request)
        const acceptsHtml = this.acceptsHtml(request);

        if (acceptsHtml && this._errorTemplateService) {
            await this.renderHtmlError(response, request, status, message);
        } else {
            this.renderJsonError(response, request, status, message);
        }
    }

    /**
     * Renders an HTML error page.
     *
     * @private
     * @param response - The HTTP response object.
     * @param request - The HTTP request object.
     * @param status - The HTTP status code.
     * @param message - The error message.
     */
    private async renderHtmlError(response: Response, request: Request, status: number, message: string | object): Promise<void> {
        if (!this._errorTemplateService) {
            return;
        }

        const errorMessage =
            typeof message === 'string' ? message : ((message as { message?: string }).message ?? this._errorTemplateService.getErrorMessage(status));

        const html = await this._errorTemplateService.getErrorPageContent({
            statusCode: status,
            title: this._errorTemplateService.getErrorTitle(status),
            message: errorMessage,
            path: request.url,
            timestamp: new Date().toISOString(),
        });

        response.status(status).header('Content-Type', 'text/html').send(html);
    }

    /**
     * Renders a JSON error response.
     *
     * @private
     * @param response - The HTTP response object.
     * @param request - The HTTP request object.
     * @param status - The HTTP status code.
     * @param message - The error message.
     */
    private renderJsonError(response: Response, request: Request, status: number, message: string | object): void {
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: message,
        });
    }

    /**
     * Determines if the request accepts HTML responses.
     *
     * @private
     * @param request - The HTTP request object.
     * @returns True if the request accepts HTML.
     */
    private acceptsHtml(request: Request): boolean {
        const acceptHeader = request.headers.accept ?? '';
        return acceptHeader.includes('text/html');
    }

    // #endregion
}
