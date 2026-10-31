import { UnauthorizedException } from '@nestjs/common';
import { type Profile } from 'passport-github2';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { GithubConnector } from './GithubConnector.js';

vi.mock('passport-github2', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('GithubConnector', () => {
    // #region Fields

    let connector: GithubConnector;
    let mockFindOrCreateByProfile: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindOrCreateByProfile = vi.fn();

        connector = new GithubConnector(
            { findOrCreateByProfile: mockFindOrCreateByProfile } as unknown as SocialAuthBase,
            {
                get: vi.fn().mockReturnValue('mock-value'),
                tryGet: vi.fn().mockImplementation((key: string, fallback: string) => {
                    if (key === 'AUTH_GITHUB_SCOPE') {
                        return 'user:email';
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
            const profile = createMockProfile({ emails: [{ value: 'dev@github.com' }], displayName: 'John Doe' });

            // act
            const result = await connector.validate('access', 'refresh', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith({
                provider: 'github',
                email: 'dev@github.com',
                userName: 'johndoe',
                displayName: 'John Doe',
            });
        });

        it('should throw UnauthorizedException when emails array is undefined', async () => {
            // arrange
            const profile = createMockProfile({ emails: undefined, displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from GitHub');
        });

        it('should throw UnauthorizedException when emails array is empty', async () => {
            // arrange
            const profile = createMockProfile({ emails: [], displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from GitHub');
        });

        it('should not crash when first email entry has no value property', async () => {
            // arrange
            const profile = createMockProfile({
                emails: [{ value: undefined as unknown as string }],
                displayName: 'John Doe',
            });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from GitHub');
        });

        it('should fall back to username when displayName is missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@github.com' }],
                displayName: '',
                username: 'johndoe',
            });

            // act
            const result = await connector.validate('access', 'refresh', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'johndoe' }));
        });

        it('should throw UnauthorizedException when both displayName and username are missing', async () => {
            // arrange
            const profile = createMockProfile({
                emails: [{ value: 'dev@github.com' }],
                displayName: '',
                username: undefined as unknown as string,
            });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No display name provided from GitHub');
        });

        it('should pass null userName when profile.username is undefined', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@github.com' }],
                displayName: 'John Doe',
                username: undefined as unknown as string,
            });

            // act
            await connector.validate('access', 'refresh', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ userName: null }));
        });
    });

    // #endregion
});

// #region Helpers

function createMockUser(overrides: Partial<IAuthSubject> = {}): IAuthSubject {
    return {
        id: 'user-1',
        userName: 'johndoe',
        email: 'dev@github.com',
        password: null,
        isVerified: true,
        isAnonymous: false,
        roles: ['user'],
        mfaEnabled: false,
        ...overrides,
    };
}

function createMockProfile(overrides: Partial<Pick<Profile, 'emails' | 'displayName' | 'username'>>): Profile {
    return {
        id: 'gh-123',
        provider: 'github',
        profileUrl: 'https://github.com/johndoe',
        displayName: 'John Doe',
        username: 'johndoe',
        emails: [{ value: 'dev@github.com' }],
        photos: [],
        ...overrides,
    } as Profile;
}

// #endregion
