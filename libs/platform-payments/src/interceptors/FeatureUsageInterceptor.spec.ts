// #region Imports

import { type CallHandler, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureAccessBase } from '../abstracts/FeatureAccessBase.js';
import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';
import { FEATURE_KEY_METADATA } from '../guards/FeatureGuard.js';
import { FeatureUsageInterceptor } from './FeatureUsageInterceptor.js';

// #endregion

describe('FeatureUsageInterceptor', () => {
    // #region Fields

    let interceptor: FeatureUsageInterceptor;
    let mockFeatureAccess: Partial<FeatureAccessBase>;
    let mockReflector: Partial<Reflector>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFeatureAccess = {
            recordUsage: vi.fn().mockResolvedValue(undefined),
        };

        mockReflector = {
            getAllAndOverride: vi.fn(),
        };

        interceptor = new FeatureUsageInterceptor(mockFeatureAccess as FeatureAccessBase, mockReflector as Reflector);
    });

    describe('intercept', () => {
        it('should pass through when no feature key metadata is set', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue(undefined);
            const context = createMockContext({});
            const next: CallHandler = { handle: () => of('result') };

            const result = await firstValueFrom(interceptor.intercept(context, next));

            expect(result).toBe('result');
            expect(mockFeatureAccess.recordUsage).not.toHaveBeenCalled();
        });

        it('should resolve handler and class metadata', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue(undefined);
            const handler = function handler(): void {
                /* noop */
            };
            const controller = class Controller {};

            await firstValueFrom(interceptor.intercept(createMockContext({}, handler, controller), { handle: () => of('ok') }));

            expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(FEATURE_KEY_METADATA, [handler, controller]);
        });

        it('should not record usage for a feature key that describes a stock', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('webhooks');
            const isStockFeature = vi.fn().mockReturnValue(true);
            const port = { recordUsage: vi.fn().mockResolvedValue(undefined), isStockFeature };
            const stockInterceptor = new FeatureUsageInterceptor(port as unknown as FeatureAccessBase, mockReflector as Reflector);
            const context = createMockContext({ user: { id: 'user-1', tenantId: 12 } });

            await firstValueFrom(stockInterceptor.intercept(context, { handle: () => of('ok') }));
            await Promise.resolve();

            expect(isStockFeature).toHaveBeenCalledWith('webhooks');
            expect(port.recordUsage).not.toHaveBeenCalled();
        });

        it('should still record usage when the implementation predates the stock declaration', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('exports');
            const context = createMockContext({ user: { id: 'user-1', tenantId: 12 } });

            await firstValueFrom(interceptor.intercept(context, { handle: () => of('ok') }));
            await Promise.resolve();

            expect(mockFeatureAccess.recordUsage).toHaveBeenCalled();
        });

        it('should increment feature usage after successful request', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('RECIPE_CREATION');
            const subject = { id: 'user-1', tenantId: 12 };
            const context = createMockContext({ user: subject });
            const next: CallHandler = { handle: () => of('response-data') };

            const result = await firstValueFrom(interceptor.intercept(context, next));

            await Promise.resolve();

            expect(result).toBe('response-data');
            expect(mockFeatureAccess.recordUsage).toHaveBeenCalledWith('user-1', 'RECIPE_CREATION', {
                userId: 'user-1',
                tenantId: 12,
                subject,
            } satisfies IFeatureAccessContext);
        });

        it('should stringify numeric user ids when recording usage', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('AI_REQUESTS');
            const subject = { id: 123, tenantId: 456 };

            await firstValueFrom(interceptor.intercept(createMockContext({ user: subject }), { handle: () => of('data') }));

            await Promise.resolve();

            expect(mockFeatureAccess.recordUsage).toHaveBeenCalledWith('123', 'AI_REQUESTS', {
                userId: '123',
                tenantId: 456,
                subject,
            } satisfies IFeatureAccessContext);
        });

        it('should not increment when user is missing', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('RECIPE_CREATION');
            const context = createMockContext({});
            const next: CallHandler = { handle: () => of('data') };

            await firstValueFrom(interceptor.intercept(context, next));
            await Promise.resolve();

            expect(mockFeatureAccess.recordUsage).not.toHaveBeenCalled();
        });
    });

    // #endregion
});

function createMockContext(
    request: Record<string, unknown>,
    handler: () => void = function handler(): void {
        /* noop */
    },
    controller: abstract new (...args: unknown[]) => unknown = class Controller {},
): ExecutionContext {
    return {
        getHandler: () => handler,
        getClass: () => controller,
        switchToHttp: vi.fn().mockReturnValue({
            getRequest: vi.fn().mockReturnValue(request),
        }),
    } as unknown as ExecutionContext;
}
