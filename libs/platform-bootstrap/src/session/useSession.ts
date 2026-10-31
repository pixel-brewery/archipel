import { INestApplication } from '@nestjs/common';
import { DateTimeUtils, StringValue } from '@pixel-brewery/archipel-platform-core';
import session from 'express-session';
import { AUTH_SESSION_MAX_AGE, AUTH_SESSION_SECRET, AUTH_SESSION_SECURE } from '../env.js';
import { PlatformBootstrapError } from '../errors/PlatformBootstrapError.js';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';
import { ISessionStepOptions } from './ISessionStepOptions.js';

/**
 * Creates an Express-compatible session bootstrap step.
 *
 * @public
 * @param options - Session middleware options.
 * @returns A platform bootstrap step.
 */
export function useSession<TApplication extends INestApplication = INestApplication>(options?: ISessionStepOptions): PlatformBootstrapStep<TApplication> {
    return async function sessionStep(context, next): Promise<void> {
        const resolvedOptions = options ?? {};

        if (resolvedOptions.enabled === false) {
            await next();
            return;
        }

        const secret = context.getConfigValue(resolvedOptions.secretConfigKey ?? AUTH_SESSION_SECRET);
        const secure = context.tryGetConfigValue(resolvedOptions.secureConfigKey ?? AUTH_SESSION_SECURE, false);
        const maxAge = context.tryGetConfigValue<string | number>(resolvedOptions.maxAgeConfigKey ?? AUTH_SESSION_MAX_AGE, '1d');

        context.app.use(
            session({
                name: resolvedOptions.name,
                secret: secret,
                resave: resolvedOptions.resave ?? false,
                rolling: resolvedOptions.rolling ?? false,
                unset: 'keep',
                saveUninitialized: resolvedOptions.saveUninitialized ?? false,
                store: resolvedOptions.store,
                cookie: {
                    httpOnly: true,
                    sameSite: 'lax',
                    ...resolvedOptions.cookie,
                    secure: secure,
                    maxAge: parseSessionMaxAge(maxAge),
                },
            }),
        );

        await next();
    };
}

function parseSessionMaxAge(value: string | number): number {
    const maxAge = typeof value === 'number' ? value : DateTimeUtils.parse(value as StringValue);

    if (!Number.isFinite(maxAge) || maxAge < 1) {
        throw new PlatformBootstrapError('Session max age must resolve to a positive duration.');
    }

    return maxAge;
}
