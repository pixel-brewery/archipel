import { INestApplication } from '@nestjs/common';
import { Options as RateLimitOptions, rateLimit } from 'express-rate-limit';
import { HelmetOptions, default as helmet } from 'helmet';
import { PlatformBootstrapContext } from '../context/PlatformBootstrapContext.js';
import { APP_RATE_LIMIT_MAX_REQUESTS, APP_RATE_LIMIT_WINDOW_MS } from '../env.js';
import { PlatformBootstrapError } from '../errors/PlatformBootstrapError.js';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';
import { ISecurityStepOptions } from './ISecurityStepOptions.js';
import { SecurityRateLimitOptions } from './SecurityRateLimitOptions.js';

/**
 * Creates the generic security bootstrap step.
 *
 * @public
 * @param options - Security bootstrap options.
 * @returns A platform bootstrap step.
 */
export function useSecurity<TApplication extends INestApplication = INestApplication>(options?: ISecurityStepOptions): PlatformBootstrapStep<TApplication> {
    return async function securityStep(context, next): Promise<void> {
        const resolvedOptions = options ?? {};

        if (resolvedOptions.cors !== false) {
            if (typeof resolvedOptions.cors === 'object' || typeof resolvedOptions.cors === 'function') {
                context.app.enableCors(resolvedOptions.cors);
            } else {
                context.app.enableCors();
            }
        }

        if (resolvedOptions.headers !== false) {
            context.app.use(helmet(resolveHelmetOptions(resolvedOptions)));
        }

        if (resolvedOptions.rateLimit !== false) {
            context.app.use(rateLimit(resolveRateLimitOptions(context, resolvedOptions.rateLimit)));
        }

        await next();
    };
}

function resolveHelmetOptions(options: ISecurityStepOptions): HelmetOptions {
    const baseOptions = typeof options.headers === 'object' ? options.headers : {};

    if (options.contentSecurityPolicy === false) {
        return { ...baseOptions, contentSecurityPolicy: false };
    }

    if (options.contentSecurityPolicy === 'swagger-compatible') {
        return {
            ...baseOptions,
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                },
            },
        };
    }

    if (options.contentSecurityPolicy && options.contentSecurityPolicy !== 'default') {
        return { ...baseOptions, contentSecurityPolicy: options.contentSecurityPolicy };
    }

    return baseOptions;
}

function resolveRateLimitOptions(context: PlatformBootstrapContext, options?: boolean | SecurityRateLimitOptions): Partial<RateLimitOptions> {
    const resolvedOptions = typeof options === 'object' ? options : {};
    const windowMs = context.tryGetConfigValue<string | number | undefined>(
        resolvedOptions.windowMsConfigKey ?? APP_RATE_LIMIT_WINDOW_MS,
        resolvedOptions.windowMs ?? resolvedOptions.fallbackWindowMs ?? 60000,
    );
    const limit = resolveRateLimit(context, resolvedOptions);

    return {
        standardHeaders: 'draft-8',
        legacyHeaders: false,
        ...resolvedOptions,
        windowMs: parsePositiveInteger(windowMs, 'rate limit window'),
        limit,
    };
}

function resolveRateLimit(context: PlatformBootstrapContext, options: SecurityRateLimitOptions): RateLimitOptions['limit'] {
    if (typeof options.limit === 'function') {
        return options.limit;
    }

    const limit = context.tryGetConfigValue<string | number | undefined>(
        options.limitConfigKey ?? APP_RATE_LIMIT_MAX_REQUESTS,
        options.limit ?? options.fallbackLimit ?? 100,
    );

    return parsePositiveInteger(limit, 'rate limit maximum request count');
}

function parsePositiveInteger(value: string | number | undefined, name: string): number {
    const parsedValue = typeof value === 'number' ? value : Number(value);

    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw new PlatformBootstrapError(`The ${name} must be a positive integer.`);
    }

    return parsedValue;
}
