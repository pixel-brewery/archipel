import { BadRequestException, type ExecutionContext } from '@nestjs/common';
import * as passportModule from '@nestjs/passport';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SocialAuthGuard, socialAuthGuardFactory } from './SocialAuthGuard.js';

vi.mock('@nestjs/passport', async (importOriginal) => {
    const original = await importOriginal<typeof passportModule>();
    return {
        ...original,
        AuthGuard: vi.fn(() => {
            return class MockAuthGuard {
                public canActivate(): boolean {
                    return true;
                }
            };
        }),
    };
});

describe('SocialAuthGuard', () => {
    // #region Fields

    let guard: SocialAuthGuard;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('canActivate', () => {
        it('should resolve the provider from route params and delegate to passport', () => {
            // arrange
            guard = socialAuthGuardFactory(':provider');
            const context = createMockContext('github');

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should strip the colon prefix from the route param name', () => {
            // arrange
            guard = socialAuthGuardFactory(':provider');
            const context = createMockContext('google');

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should work when the route param is passed without colon prefix', () => {
            // arrange
            guard = socialAuthGuardFactory('provider');
            const context = createMockContext('microsoft');

            // act
            const result = guard.canActivate(context);

            // assert
            expect(result).toBe(true);
        });

        it('should throw BadRequestException for an unsupported provider', () => {
            // arrange
            guard = socialAuthGuardFactory(':provider');
            const context = createMockContext('unsupported');

            // act & assert
            expect(() => guard.canActivate(context)).toThrow(BadRequestException);
            expect(() => guard.canActivate(context)).toThrow('Unsupported OAuth provider: unsupported');
        });

        it('should throw BadRequestException when the route parameter is missing', () => {
            // arrange
            guard = socialAuthGuardFactory(':provider');
            const context = createMockContext(undefined);

            // act & assert
            expect(() => guard.canActivate(context)).toThrow(BadRequestException);
        });
    });

    // #endregion
});

// #region Helpers

function createMockContext(providerValue: string | undefined): ExecutionContext {
    return {
        switchToHttp: () => ({
            getRequest: () => ({
                params: { provider: providerValue },
            }),
            getResponse: () => ({}),
        }),
        getHandler: () => vi.fn(),
        getClass: () => vi.fn(),
        getArgs: () => [],
        getArgByIndex: () => undefined,
        switchToRpc: () => ({}) as never,
        switchToWs: () => ({}) as never,
        getType: () => 'http',
    } as unknown as ExecutionContext;
}

// #endregion
