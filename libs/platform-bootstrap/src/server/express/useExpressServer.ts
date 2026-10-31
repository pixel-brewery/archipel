import { INestApplication } from '@nestjs/common';
import compression from 'compression';
import express from 'express';
import { PlatformBootstrapStep } from '../../types/PlatformBootstrapStep.js';
import { IExpressServerStepOptions } from './IExpressServerStepOptions.js';

/**
 * Creates an Express-compatible server bootstrap step.
 *
 * @public
 * @param options - Express server options.
 * @returns A platform bootstrap step.
 */
export function useExpressServer<TApplication extends INestApplication = INestApplication>(
    options?: IExpressServerStepOptions,
): PlatformBootstrapStep<TApplication> {
    return async function expressServerStep(context, next): Promise<void> {
        const resolvedOptions = options ?? {};

        if (resolvedOptions.json !== false) {
            context.app.use(express.json(resolveMiddlewareOptions(resolvedOptions.json, { limit: '1mb' })));
        }

        if (resolvedOptions.urlEncoded !== false) {
            context.app.use(express.urlencoded(resolveMiddlewareOptions(resolvedOptions.urlEncoded, { extended: true, limit: '1mb' })));
        }

        if (resolvedOptions.compression !== false) {
            context.app.use(compression(resolveMiddlewareOptions(resolvedOptions.compression, {})));
        }

        await next();
    };
}

function resolveMiddlewareOptions<TOptions extends object>(value: boolean | TOptions | undefined, fallback: TOptions): TOptions {
    if (typeof value === 'object') {
        return value;
    }

    return fallback;
}
