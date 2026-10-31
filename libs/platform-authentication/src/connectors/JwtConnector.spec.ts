import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { JwtPayloadBase } from '../models/abstracts/JwtPayloadBase.js';
import { JwtConnector } from './JwtConnector.js';

vi.mock('passport-jwt', () => ({
    Strategy: class MockStrategy {},
    ExtractJwt: {
        fromAuthHeaderAsBearerToken: vi.fn().mockReturnValue(vi.fn()),
    },
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('JwtConnector', () => {
    // #region Fields

    let connector: JwtConnector;
    let mockFindById: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindById = vi.fn();

        connector = new JwtConnector({ findById: mockFindById } as unknown as AuthSubjectBase, { get: vi.fn().mockReturnValue('test-jwt-secret') } as never);
    });

    describe('validate', () => {
        it('should return the user when the token subject exists', async () => {
            // arrange
            const user = createMockUser();
            mockFindById.mockResolvedValue(user);
            const payload = createMockPayload({ id: 'user-1' });

            // act
            const result = await connector.validate(payload);

            // assert
            expect(result).toBe(user);
            expect(mockFindById).toHaveBeenCalledWith('user-1');
        });

        it('should throw UnauthorizedException when user is not found', async () => {
            // arrange
            mockFindById.mockResolvedValue(null);
            const payload = createMockPayload({ id: 'deleted-user' });

            // act & assert
            await expect(connector.validate(payload)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate(payload)).rejects.toThrow('Invalid token subject');
        });

        it('should not throw NotFoundException for missing users', async () => {
            // arrange
            mockFindById.mockResolvedValue(null);
            const payload = createMockPayload({ id: 'deleted-user' });

            // act & assert
            await expect(connector.validate(payload)).rejects.not.toThrow('Not Found');
        });
    });

    // #endregion
});

// #region Helpers

function createMockUser(overrides: Partial<IAuthSubject> = {}): IAuthSubject {
    return {
        id: 'user-1',
        userName: 'testuser',
        email: 'test@example.com',
        password: '$2b$hashed',
        isVerified: true,
        isAnonymous: false,
        roles: ['user'],
        mfaEnabled: false,
        ...overrides,
    };
}

function createMockPayload(overrides: Partial<{ id: string; email: string | null; roles: ReadonlyArray<string> }> = {}): JwtPayloadBase {
    return {
        id: 'user-1',
        email: 'test@example.com',
        roles: ['user'],
        ...overrides,
    } as JwtPayloadBase;
}

// #endregion
