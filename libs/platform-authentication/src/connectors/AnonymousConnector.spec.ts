import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SEED_ANONYMOUS_USERNAME } from '../env.js';
import { AnonymousConnector } from './AnonymousConnector.js';

vi.mock('passport-custom', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('AnonymousConnector', () => {
    // #region Fields

    let connector: AnonymousConnector;
    let mockFindAnonymous: ReturnType<typeof vi.fn>;
    let mockGet: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindAnonymous = vi.fn();
        mockGet = vi.fn().mockReturnValue('anonymous-user');

        connector = new AnonymousConnector({ findAnonymous: mockFindAnonymous } as unknown as AuthSubjectBase, { get: mockGet } as never);
    });

    describe('validate', () => {
        it('should return the anonymous user when found', async () => {
            // arrange
            const user = createMockUser();
            mockFindAnonymous.mockResolvedValue(user);

            // act
            const result = await connector.validate();

            // assert
            expect(result).toBe(user);
            expect(mockGet).toHaveBeenCalledWith(SEED_ANONYMOUS_USERNAME.key);
            expect(mockFindAnonymous).toHaveBeenCalledWith('anonymous-user');
        });

        it('should throw NotFoundException when anonymous user is not found', async () => {
            // arrange
            mockFindAnonymous.mockResolvedValue(null);

            // act & assert
            await expect(connector.validate()).rejects.toThrow(NotFoundException);
            await expect(connector.validate()).rejects.toThrow('User not found');
        });
    });

    // #endregion
});

// #region Helpers

function createMockUser(overrides: Partial<IAuthSubject> = {}): IAuthSubject {
    return {
        id: 'anon-1',
        userName: 'anonymous-user',
        email: null,
        password: null,
        isVerified: false,
        isAnonymous: true,
        roles: ['anonymous'],
        mfaEnabled: false,
        ...overrides,
    };
}

// #endregion
