import { Injectable, NestMiddleware, PayloadTooLargeException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LimitRequestSizeMiddleware implements NestMiddleware {
    private readonly _maxSize: number;

    // public constructor(maxSizeInBytes: number) {
    //     this._maxSize = maxSizeInBytes;
    // }

    /**
     * Constructs a new instance of the `LimitRequestSizeMiddleware` class.
     *
     * @public
     */
    public constructor() {
        this._maxSize = 1024 * 1024 * 1; // 1MB
    }

    public use(request: Request, _response: Response, next: NextFunction): void {
        const contentLength = parseInt(request.headers['content-length'] ?? '0', 10);

        if (contentLength > this._maxSize) {
            throw new PayloadTooLargeException(`Payload too large. Maximum allowed size is ${this._maxSize} bytes.`);
        }

        let receivedBytes = 0;
        request.on('data', (chunk: Buffer) => {
            receivedBytes += chunk.length;
            if (receivedBytes > this._maxSize) {
                request.destroy();
                throw new PayloadTooLargeException(`Payload too large. Maximum allowed size is ${this._maxSize} bytes.`);
            }
        });

        next();
    }
}
