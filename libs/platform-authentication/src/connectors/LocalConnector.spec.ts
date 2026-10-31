import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { LocalConnector } from './LocalConnector.js';

vi.mock('passport-local', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('LocalConnector', () => {
    // #region Fields

    let connector: LocalConnector;
    let mockFindByLogin: ReturnType<typeof vi.fn>;
    let mockBcryptCompare: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindByLogin = vi.fn();
        mockBcryptCompare = vi.fn();

        connector = new LocalConnector({ findByLogin: mockFindByLogin } as unknown as AuthSubjectBase, { compare: mockBcryptCompare } as never);
    });

    describe('validate', () => {
        it('should return the user when credentials are valid', async () => {
            // arrange
            const user = createMockUser({ password: '$2b$hashed' });
            mockFindByLogin.mockResolvedValue(user);
            mockBcryptCompare.mockResolvedValue(true);

            // act
            const result = await connector.validate('testuser', 'correctPassword');

            // assert
            expect(result).toBe(user);
            expect(mockFindByLogin).toHaveBeenCalledWith('testuser');
            expect(mockBcryptCompare).toHaveBeenCalledWith('correctPassword', '$2b$hashed');
        });

        it('should throw UnauthorizedException when user does not exist', async () => {
            // arrange
            mockFindByLogin.mockResolvedValue(null);

            // act & assert
            await expect(connector.validate('unknown', 'password')).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('unknown', 'password')).rejects.toThrow('Invalid credentials');
        });

        it('should throw UnauthorizedException when user has no password', async () => {
            // arrange
            const user = createMockUser({ password: null });
            mockFindByLogin.mockResolvedValue(user);

            // act & assert
            await expect(connector.validate('social-user', 'password')).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('social-user', 'password')).rejects.toThrow('Invalid credentials');
        });

        it('should throw UnauthorizedException when password does not match', async () => {
            // arrange
            const user = createMockUser({ password: '$2b$hashed' });
            mockFindByLogin.mockResolvedValue(user);
            mockBcryptCompare.mockResolvedValue(false);

            // act & assert
            await expect(connector.validate('testuser', 'wrongPassword')).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('testuser', 'wrongPassword')).rejects.toThrow('Invalid credentials');
        });

        it('should use the same error message for non-existent user and wrong password', async () => {
            // arrange
            const nonExistentError = connector.validate('ghost', 'any').catch((error: Error) => error.message);

            const user = createMockUser({ password: '$2b$hashed' });
            mockFindByLogin.mockResolvedValue(user);
            mockBcryptCompare.mockResolvedValue(false);
            const wrongPasswordError = connector.validate('testuser', 'wrong').catch((error: Error) => error.message);

            // act
            const [message1, message2] = await Promise.all([nonExistentError, wrongPasswordError]);

            // assert
            expect(message1).toBe(message2);
            expect(message1).toBe('Invalid credentials');
        });

        it('should not call bcrypt compare when user is null', async () => {
            // arrange
            mockFindByLogin.mockResolvedValue(null);

            // act
            await connector.validate('unknown', 'password').catch((_: unknown) => undefined);

            // assert
            expect(mockBcryptCompare).not.toHaveBeenCalled();
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

// #endregion
