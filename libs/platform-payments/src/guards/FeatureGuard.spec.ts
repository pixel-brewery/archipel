// #region Imports

import { type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureAccessBase } from '../abstracts/FeatureAccessBase.js';
import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';
import type { IFeatureAccessResult } from '../contracts/IFeatureAccessResult.js';
import { FEATURE_KEY_METADATA, FeatureGuard } from './FeatureGuard.js';

// #endregion

describe('FeatureGuard', () => {
    // #region Fields

    let guard: FeatureGuard;
    let mockFeatureAccess: Partial<FeatureAccessBase>;
    let mockReflector: Partial<Reflector>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFeatureAccess = {
            checkAccess: vi.fn(),
        };

        mockReflector = {
            getAllAndOverride: vi.fn(),
        };

        guard = new FeatureGuard(mockFeatureAccess as FeatureAccessBase, mockReflector as Reflector);
    });

    describe('canActivate', () => {
        it('should allow when no feature key metadata is set', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue(undefined);
            const context = createMockContext();

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(mockFeatureAccess.checkAccess).not.toHaveBeenCalled();
        });

        it('should resolve handler and class metadata', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue(undefined);
            const handler = function handler(): void {
                /* noop */
            };
            const controller = class Controller {};

            await guard.canActivate(createMockContext({}, handler, controller));

            expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(FEATURE_KEY_METADATA, [handler, controller]);
        });

        it('should deny when no user is present on request', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('RECIPE_CREATION');
            const context = createMockContext({ user: null });

            const result = await guard.canActivate(context);

            expect(result).toBe(false);
        });

        it('should deny when user has no id', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('RECIPE_CREATION');
            const context = createMockContext({ user: {} });

            const result = await guard.canActivate(context);
            expect(result).toBe(false);
        });

        it('should allow when feature access is granted', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('RECIPE_CREATION');
            const subject = { id: 'user-1', tenantId: 12 };
            const request = { user: subject } as Record<string, unknown>;
            const context = createMockContext(request);
            const accessResult = createAccessResult(true);

            vi.mocked(mockFeatureAccess.checkAccess!).mockResolvedValue(accessResult);

            const result = await guard.canActivate(context);

            expect(result).toBe(true);
            expect(mockFeatureAccess.checkAccess).toHaveBeenCalledWith('user-1', 'RECIPE_CREATION', {
                userId: 'user-1',
                tenantId: 12,
                subject,
            } satisfies IFeatureAccessContext);
            expect(request['featureAccess']).toBe(accessResult);
        });

        it('should stringify numeric user ids for the access port', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('AI_REQUESTS');
            const subject = { id: 123, tenantId: 456 };

            vi.mocked(mockFeatureAccess.checkAccess!).mockResolvedValue(createAccessResult(true));

            await guard.canActivate(createMockContext({ user: subject }));

            expect(mockFeatureAccess.checkAccess).toHaveBeenCalledWith('123', 'AI_REQUESTS', {
                userId: '123',
                tenantId: 456,
                subject,
            } satisfies IFeatureAccessContext);
        });

        it('should deny when feature access is not allowed', async () => {
            vi.mocked(mockReflector.getAllAndOverride!).mockReturnValue('WORKOUT_PLANS');
            const context = createMockContext({ user: { id: 'user-2' } });

            vi.mocked(mockFeatureAccess.checkAccess!).mockResolvedValue(createAccessResult(false));

            const result = await guard.canActivate(context);
            expect(result).toBe(false);
        });
    });

    // #endregion
});

function createAccessResult(allowed: boolean): IFeatureAccessResult {
    return {
        allowed,
        used: allowed ? 2 : 3,
        limit: 3,
        remaining: allowed ? 1 : 0,
        resetAt: new Date('2026-01-01T00:00:00.000Z'),
    };
}

function createMockContext(
    request: Record<string, unknown> = {},
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
