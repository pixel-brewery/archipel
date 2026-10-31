import { type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RolesGuard } from './RolesGuard.js';

describe('RolesGuard', () => {
    // #region Fields

    let guard: RolesGuard;
    let mockGetAllAndOverride: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockGetAllAndOverride = vi.fn();

        guard = new RolesGuard({ getAllAndOverride: mockGetAllAndOverride } as unknown as Reflector);
    });

    // #endregion

    // #region Methods

    describe('canActivate', () => {
        it('should allow when no roles are required', () => {
            // arrange
            mockGetAllAndOverride.mockReturnValue([]);
            const context = createMockContext({ roles: ['user'] });

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should allow when roles decorator is not applied', () => {
            // arrange
            mockGetAllAndOverride.mockReturnValue(undefined);
            const context = createMockContext({ roles: ['user'] });

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should allow when user has a matching role', () => {
            // arrange
            mockGetAllAndOverride.mockReturnValue(['admin']);
            const context = createMockContext({ roles: ['user', 'admin'] });

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should deny when user lacks required role', () => {
            // arrange
            mockGetAllAndOverride.mockReturnValue(['admin']);
            const context = createMockContext({ roles: ['user'] });

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});

function createMockContext(user: { roles: string[] }): ExecutionContext {
    return {
        getHandler: vi.fn(),
        getClass: vi.fn(),
        switchToHttp: vi.fn().mockReturnValue({
            getRequest: vi.fn().mockReturnValue({ user }),
        }),
    } as unknown as ExecutionContext;
}
