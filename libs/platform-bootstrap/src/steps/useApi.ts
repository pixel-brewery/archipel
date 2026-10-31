import { ProblemDetailExceptionFilter } from '@pixel-brewery/archipel-platform-core';
import { RepositoryExceptionFilter } from '@pixel-brewery/archipel-platform-database';
import {
    HttpStatus,
    INestApplication,
    StandardSchemaSerializerInterceptor,
    StandardSchemaValidationPipe,
    StandardSchemaValidationPipeOptions,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';
import { IApiStepOptions } from './IApiStepOptions.js';
import { IApiStandardSchemaOptions } from './IApiStandardSchemaOptions.js';
import { IApiValidationOptions } from './IApiValidationOptions.js';

/**
 * Creates the generic Archipel API bootstrap step.
 *
 * @public
 * @param options - API bootstrap options.
 * @returns A platform bootstrap step.
 */
export function useApi<TApplication extends INestApplication = INestApplication>(options?: IApiStepOptions): PlatformBootstrapStep<TApplication> {
    return async function apiStep(context, next): Promise<void> {
        const resolvedOptions = options ?? {};

        if (resolvedOptions.prefix) {
            context.app.setGlobalPrefix(resolvedOptions.prefix);
        }

        if (resolvedOptions.problemDetails ?? true) {
            context.app.useGlobalFilters(new ProblemDetailExceptionFilter());
        }

        // Nest evaluates global filters in reverse registration order.
        if (resolvedOptions.repositoryErrors ?? true) {
            context.app.useGlobalFilters(new RepositoryExceptionFilter());
        }

        if (resolvedOptions.validation !== false) {
            context.app.useGlobalPipes(createValidationPipe(resolvedOptions.validation));
        }

        if (resolvedOptions.standardSchema !== false) {
            registerStandardSchema(context.app, resolvedOptions.standardSchema);
        }

        await next();
    };
}

function registerStandardSchema(app: INestApplication, options?: boolean | IApiStandardSchemaOptions): void {
    const resolvedOptions = typeof options === 'object' ? options : {};

    if (resolvedOptions.requestValidation !== false) {
        app.useGlobalPipes(createStandardSchemaValidationPipe(resolvedOptions.requestValidation));
    }

    if (resolvedOptions.responseSerialization !== false) {
        const reflector = app.get(Reflector, { strict: false });
        const serializerOptions = typeof resolvedOptions.responseSerialization === 'object' ? resolvedOptions.responseSerialization : undefined;

        app.useGlobalInterceptors(new StandardSchemaSerializerInterceptor(reflector, serializerOptions));
    }
}

function createStandardSchemaValidationPipe(options?: boolean | StandardSchemaValidationPipeOptions): StandardSchemaValidationPipe {
    const resolvedOptions = typeof options === 'object' ? options : {};

    return new StandardSchemaValidationPipe({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        ...resolvedOptions,
    });
}

function createValidationPipe(options?: boolean | IApiValidationOptions): ValidationPipe {
    const resolvedOptions = typeof options === 'object' ? options : {};

    return new ValidationPipe({
        whitelist: resolvedOptions.whitelist ?? true,
        forbidNonWhitelisted: resolvedOptions.forbidNonWhitelisted ?? true,
        transform: resolvedOptions.transform ?? true,
        transformOptions: {
            enableImplicitConversion: resolvedOptions.enableImplicitConversion ?? true,
        },
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
}
