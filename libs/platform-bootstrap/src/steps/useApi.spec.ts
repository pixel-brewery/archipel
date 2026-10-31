import { ExecutionContext, StandardSchemaSerializerInterceptor, StandardSchemaValidationPipe, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProblemDetailExceptionFilter } from '@pixel-brewery/archipel-platform-core';
import { RepositoryExceptionFilter } from '@pixel-brewery/archipel-platform-database';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { firstValueFrom, of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IPlatformTestApplication } from '../testing/IPlatformTestApplication.js';
import { createPlatformTestApplication } from '../testing/createPlatformTestApplication.js';
import { useApi } from './useApi.js';

describe('useApi', () => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    it('configures prefix, filters, and validation by default', async (): Promise<void> => {
        // Arrange
        const app = createPlatformTestApplication();
        const step = useApi({ prefix: 'api' });

        // Act
        await step({ app } as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.setGlobalPrefix).toHaveBeenCalledWith('api');
        expect(app.useGlobalFilters).toHaveBeenCalledTimes(2);
        expect(app.useGlobalFilters).toHaveBeenNthCalledWith(1, expect.any(ProblemDetailExceptionFilter));
        expect(app.useGlobalFilters).toHaveBeenNthCalledWith(2, expect.any(RepositoryExceptionFilter));
        expect(app.useGlobalPipes).toHaveBeenNthCalledWith(1, expect.any(ValidationPipe));
        expect(app.useGlobalPipes).toHaveBeenNthCalledWith(2, expect.any(StandardSchemaValidationPipe));
        expect(app.get).toHaveBeenCalledWith(Reflector, { strict: false });
        expect(app.useGlobalInterceptors).toHaveBeenCalledWith(expect.any(StandardSchemaSerializerInterceptor));
    });

    it('keeps Standard Schema validation when legacy validation is disabled', async (): Promise<void> => {
        // Arrange
        const app = createPlatformTestApplication();
        const step = useApi({ validation: false });

        // Act
        await step({ app } as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.useGlobalPipes).toHaveBeenCalledOnce();
        expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(StandardSchemaValidationPipe));
    });

    it('keeps legacy validation when Standard Schema support is disabled', async (): Promise<void> => {
        // Arrange
        const app = createPlatformTestApplication();
        const step = useApi({ standardSchema: false });

        // Act
        await step({ app } as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.useGlobalPipes).toHaveBeenCalledOnce();
        expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
        expect(app.useGlobalInterceptors).not.toHaveBeenCalled();
        expect(app.get).not.toHaveBeenCalledWith(Reflector, { strict: false });
    });

    it('allows request validation and response serialization to be disabled independently', async (): Promise<void> => {
        // Arrange
        const app = createPlatformTestApplication();
        const step = useApi({
            standardSchema: {
                requestValidation: false,
                responseSerialization: false,
            },
        });

        // Act
        await step({ app } as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.useGlobalPipes).toHaveBeenCalledOnce();
        expect(app.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
        expect(app.useGlobalInterceptors).not.toHaveBeenCalled();
    });

    it('forwards request options and returns the value transformed by a Standard Schema', async (): Promise<void> => {
        // Arrange
        const input = { email: ' USER@EXAMPLE.COM ' };
        const output = { email: 'user@example.com' };
        const validateOptions = { locale: 'en' };
        const validate = vi.fn(() => ({ value: output }));
        const schema = createStandardSchema(validate);
        const app = createPlatformTestApplication();
        const step = useApi({
            standardSchema: {
                requestValidation: { transform: true, validateOptions },
                responseSerialization: false,
            },
        });
        await step({ app } as never, async (): Promise<void> => undefined);
        const pipe = getRegisteredStandardSchemaPipe(app);

        // Act
        const result = await pipe.transform(input, { type: 'body', schema });

        // Assert
        expect(result).toEqual(output);
        expect(validate).toHaveBeenCalledWith(input, validateOptions);
    });

    it('reports Standard Schema request failures as unprocessable entities', async (): Promise<void> => {
        // Arrange
        const schema = createStandardSchema(() => ({
            issues: [{ message: 'Invalid email address', path: ['email'] }],
        }));
        const app = createPlatformTestApplication();
        const step = useApi({ standardSchema: { responseSerialization: false } });
        await step({ app } as never, async (): Promise<void> => undefined);
        const pipe = getRegisteredStandardSchemaPipe(app);

        // Act / Assert
        await expect(pipe.transform({ email: 'invalid' }, { type: 'body', schema })).rejects.toMatchObject({ status: 422 });
    });

    it('forwards serializer options and returns the value transformed by a response schema', async (): Promise<void> => {
        // Arrange
        const input = { data: { name: '  Archipel  ' } };
        const output = { data: { name: 'Archipel' } };
        const validateOptions = { audience: 'public' };
        const validate = vi.fn(() => ({ value: output }));
        const schema = createStandardSchema(validate);
        const app = createPlatformTestApplication();
        const step = useApi({
            standardSchema: {
                requestValidation: false,
                responseSerialization: { schema, validateOptions },
            },
        });
        await step({ app } as never, async (): Promise<void> => undefined);
        const interceptor = getRegisteredStandardSchemaInterceptor(app);
        const context = createExecutionContext();

        // Act
        const result = await firstValueFrom(interceptor.intercept(context, { handle: () => of(input) }));

        // Assert
        expect(result).toEqual(output);
        expect(validate).toHaveBeenCalledWith(input, validateOptions);
    });

    it('rejects response values that do not satisfy the configured Standard Schema', async (): Promise<void> => {
        // Arrange
        const schema = createStandardSchema(() => ({ issues: [{ message: 'Missing response data' }] }));
        const app = createPlatformTestApplication();
        const step = useApi({
            standardSchema: {
                requestValidation: false,
                responseSerialization: { schema },
            },
        });
        await step({ app } as never, async (): Promise<void> => undefined);
        const interceptor = getRegisteredStandardSchemaInterceptor(app);
        const context = createExecutionContext();

        // Act / Assert
        await expect(firstValueFrom(interceptor.intercept(context, { handle: () => of({}) }))).rejects.toThrow('Serialization failed: Missing response data');
    });
});

function createStandardSchema(validate: StandardSchemaV1<unknown, unknown>['~standard']['validate']): StandardSchemaV1<unknown, unknown> {
    return {
        '~standard': {
            version: 1,
            vendor: 'archipel-test',
            validate,
        },
    };
}

function getRegisteredStandardSchemaPipe(app: IPlatformTestApplication): StandardSchemaValidationPipe {
    const pipe = vi
        .mocked(app.useGlobalPipes)
        .mock.calls.flat()
        .find((candidate): candidate is StandardSchemaValidationPipe => candidate instanceof StandardSchemaValidationPipe);

    if (!pipe) {
        throw new Error('Standard Schema validation pipe was not registered.');
    }

    return pipe;
}

function getRegisteredStandardSchemaInterceptor(app: IPlatformTestApplication): StandardSchemaSerializerInterceptor {
    const interceptor = vi
        .mocked(app.useGlobalInterceptors)
        .mock.calls.flat()
        .find((candidate): candidate is StandardSchemaSerializerInterceptor => candidate instanceof StandardSchemaSerializerInterceptor);

    if (!interceptor) {
        throw new Error('Standard Schema serializer interceptor was not registered.');
    }

    return interceptor;
}

function createExecutionContext(): ExecutionContext {
    class TestController {}
    const handler = (): void => undefined;

    return {
        getClass: () => TestController,
        getHandler: () => handler,
    } as ExecutionContext;
}
