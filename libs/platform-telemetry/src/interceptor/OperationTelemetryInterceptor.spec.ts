import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ITelemetryFacade } from '../core/NoopTelemetryFacade.js';
import { OperationTelemetryInterceptor } from './OperationTelemetryInterceptor.js';

describe('OperationTelemetryInterceptor', () => {
    // #region Fields

    let interceptor: OperationTelemetryInterceptor;
    let facadeMock: ITelemetryFacade;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        facadeMock = {
            runOperation: vi.fn().mockImplementation(async (_name: string, fn: () => Promise<unknown>) => fn()),
        };

        interceptor = new OperationTelemetryInterceptor(facadeMock);
    });

    it('should wrap the handler execution in a telemetry operation', async () => {
        // arrange
        const executionContext = {
            getHandler: () => ({ name: 'getUser' }),
            getClass: () => ({ name: 'UsersController' }),
        } as unknown as ExecutionContext;

        const callHandler: CallHandler = {
            handle: () => of({ id: 1 }),
        };

        // act
        const result = await firstValueFrom(interceptor.intercept(executionContext, callHandler));

        // assert
        expect(facadeMock.runOperation).toHaveBeenCalledWith('UsersController.getUser', expect.any(Function));
        expect(result).toEqual({ id: 1 });
    });

    // #endregion
});
