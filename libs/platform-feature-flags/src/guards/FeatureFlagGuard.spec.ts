import { type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagReaderBase } from '../abstracts/FeatureFlagReaderBase.js';
import { FeatureFlagGuard } from './FeatureFlagGuard.js';

describe('FeatureFlagGuard', () => {
    // #region Fields

    let guard: FeatureFlagGuard;
    let mockReflectorGet: ReturnType<typeof vi.fn>;
    let mockIsEnabled: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockReflectorGet = vi.fn();
        mockIsEnabled = vi.fn();

        guard = new FeatureFlagGuard({ isEnabled: mockIsEnabled } as unknown as FeatureFlagReaderBase, { get: mockReflectorGet } as unknown as Reflector);
    });

    describe('canActivate', () => {
        it('should allow access when no flag key metadata is set', async () => {
            // arrange
            mockReflectorGet.mockReturnValue(undefined);
            const context = createMockContext();

            // act
            const result = await guard.canActivate(context);

            // assert
            expect(result).toBe(true);
            expect(mockIsEnabled).not.toHaveBeenCalled();
        });

        it('should evaluate the feature flag when metadata is present', async () => {
            // arrange
            mockReflectorGet.mockReturnValue('new-checkout');
            mockIsEnabled.mockResolvedValue(true);
            const context = createMockContext({ id: 'user-123' });

            // act
            const result = await guard.canActivate(context);

            // assert
            expect(result).toBe(true);
            expect(mockIsEnabled).toHaveBeenCalledWith('new-checkout', { userId: 'user-123' });
        });

        it('should deny access when the feature flag is disabled', async () => {
            // arrange
            mockReflectorGet.mockReturnValue('beta-feature');
            mockIsEnabled.mockResolvedValue(false);
            const context = createMockContext({ id: 'user-456' });

            // act
            const result = await guard.canActivate(context);

            // assert
            expect(result).toBe(false);
        });

        it('should pass undefined userId when no user is on the request', async () => {
            // arrange
            mockReflectorGet.mockReturnValue('some-flag');
            mockIsEnabled.mockResolvedValue(true);
            const context = createMockContext(undefined);

            // act
            const result = await guard.canActivate(context);

            // assert
            expect(result).toBe(true);
            expect(mockIsEnabled).toHaveBeenCalledWith('some-flag', { userId: undefined });
        });

        it('should return false and log when the client throws an error', async () => {
            // arrange
            mockReflectorGet.mockReturnValue('failing-flag');
            mockIsEnabled.mockRejectedValue(new Error('provider unreachable'));
            const context = createMockContext({ id: 'user-789' });

            // act
            const result = await guard.canActivate(context);

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});

function createMockContext(user?: { id: string }): ExecutionContext {
    return {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
            getRequest: vi.fn().mockReturnValue({ user }),
        }),
    } as unknown as ExecutionContext;
}
