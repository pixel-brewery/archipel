import { UnauthorizedException } from '@nestjs/common';
import type { Profile as PassportProfile } from 'passport';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { AppleConnector } from './AppleConnector.js';

vi.mock('passport-apple', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

type IAppleProfile = PassportProfile & { email?: string };

describe('AppleConnector', () => {
    // #region Fields

    let connector: AppleConnector;
    let mockFindOrCreateByProfile: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindOrCreateByProfile = vi.fn();

        connector = new AppleConnector(
            { findOrCreateByProfile: mockFindOrCreateByProfile } as unknown as SocialAuthBase,
            {
                get: vi.fn().mockImplementation((key: string) => {
                    if (key === 'AUTH_APPLE_PRIVATE_KEY') {
                        return '-----BEGIN PRIVATE KEY-----\\nMOCK\\n-----END PRIVATE KEY-----';
                    }

                    return 'mock-value';
                }),
                tryGet: vi.fn().mockImplementation((key: string, fallback: string) => {
                    if (key === 'AUTH_APPLE_SCOPE') {
                        return 'name,email';
                    }

                    return fallback;
                }),
            } as never,
        );
    });

    describe('validate', () => {
        it('should return a user for a valid profile with email and displayName', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({ emails: [{ value: 'dev@apple.com' }], displayName: 'John Doe' });

            // act
            const result = await connector.validate('access', 'refresh', 'idtoken', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith({
                provider: 'apple',
                email: 'dev@apple.com',
                userName: 'johndoe',
                displayName: 'John Doe',
            });
        });

        it('should fall back to profile.email when emails array is empty', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [],
                email: 'fallback@apple.com',
                displayName: 'John Doe',
            });

            // act
            await connector.validate('access', 'refresh', 'idtoken', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ email: 'fallback@apple.com' }));
        });

        it('should throw UnauthorizedException when no email is provided at all', async () => {
            // arrange
            const profile = createMockProfile({ emails: undefined, email: undefined, displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', 'idtoken', profile)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('access', 'refresh', 'idtoken', profile)).rejects.toThrow('No email provided from Apple');
        });

        it('should fall back to name.givenName when displayName is missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@apple.com' }],
                displayName: undefined as unknown as string,
                name: { givenName: 'John', familyName: 'Doe' },
            });

            // act
            await connector.validate('access', 'refresh', 'idtoken', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'John' }));
        });

        it('should fall back to email local-part when no displayName, givenName or familyName are provided', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@apple.com' }],
                displayName: undefined as unknown as string,
                name: undefined,
            });

            // act
            await connector.validate('access', 'refresh', 'idtoken', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'dev' }));
        });

        it('should derive userName from email when profile.username is undefined', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@apple.com' }],
                displayName: 'John Doe',
                username: undefined as unknown as string,
            });

            // act
            await connector.validate('access', 'refresh', 'idtoken', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ userName: 'dev' }));
        });

        it('should throw UnauthorizedException when displayName resolves to empty string', async () => {
            // arrange
            const profile = createMockProfile({
                emails: [{ value: '@apple.com' }],
                email: '@apple.com',
                displayName: undefined as unknown as string,
                name: undefined,
            });

            // act & assert
            await expect(connector.validate('access', 'refresh', 'idtoken', profile)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('access', 'refresh', 'idtoken', profile)).rejects.toThrow('No display name provided from Apple');
        });
    });

    // #endregion
});

// #region Helpers

function createMockUser(overrides: Partial<IAuthSubject> = {}): IAuthSubject {
    return {
        id: 'user-1',
        userName: 'johndoe',
        email: 'dev@apple.com',
        password: null,
        isVerified: true,
        isAnonymous: false,
        roles: ['user'],
        mfaEnabled: false,
        ...overrides,
    };
}

function createMockProfile(overrides: Partial<Pick<IAppleProfile, 'emails' | 'displayName' | 'username' | 'name' | 'email'>>): IAppleProfile {
    return {
        id: 'apple-123',
        provider: 'apple',
        displayName: 'John Doe',
        username: 'johndoe',
        name: { givenName: 'John', familyName: 'Doe' },
        emails: [{ value: 'dev@apple.com' }],
        photos: [],
        ...overrides,
    } as IAppleProfile;
}

// #endregion
