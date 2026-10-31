// #region Imports

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { maskSensitive } from '../utils/MaskSensitiveUtils.js';

// #endregion

const isEmpty = (obj: unknown): boolean => JSON.stringify(obj) === '{}';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    // #region Fields

    private readonly _logger: Logger;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `HttpLoggerMiddleware` class.
     *
     * @public
     */
    public constructor() {
        this._logger = new Logger('HTTP');
    }

    // #endregion

    public use(req: Request, _res: Response, next: NextFunction): void {
        const { body, params, query } = req;

        const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        this.log('---------------------------------------------------------------------------------');
        this.log('request method:', req.method);
        this.log('request url: ', requestUrl);

        if (query && !isEmpty(query)) {
            this.log('request query: ', maskSensitive(query));
        }

        if (params && !isEmpty(params)) {
            this.log('request params: ', maskSensitive(params));
        }

        if (body && !isEmpty(body)) {
            this.log('request body: ', maskSensitive(body));
        }

        this.log('---------------------------------------------------------------------------------');
        next();
    }

    private log(message: string, ...optionalParams: unknown[]): void {
        const combined = optionalParams.length > 0 ? `${message} ${optionalParams.join(' ')}` : message;
        this._logger.log(combined);
    }
}
