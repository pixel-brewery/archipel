import { UnauthorizedException } from '@nestjs/common';
import { type Profile } from 'passport-google-oauth20';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { GoogleConnector } from './GoogleConnector.js';

vi.mock('passport-google-oauth20', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('GoogleConnector', () => {
    // #region Fields

    let connector: GoogleConnector;
    let mockFindOrCreateByProfile: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindOrCreateByProfile = vi.fn();

        connector = new GoogleConnector(
            { findOrCreateByProfile: mockFindOrCreateByProfile } as unknown as SocialAuthBase,
            {
                get: vi.fn().mockReturnValue('mock-value'),
                tryGet: vi.fn().mockImplementation((key: string, fallback: string) => {
                    if (key === 'AUTH_GOOGLE_SCOPE') {
                        return 'email,profile';
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
            const profile = createMockProfile({ emails: [{ value: 'dev@google.com' }], displayName: 'John Doe' });

            // act
            const result = await connector.validate('access', 'refresh', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith({
                provider: 'google',
                email: 'dev@google.com',
                userName: 'johndoe',
                displayName: 'John Doe',
            });
        });

        it('should throw UnauthorizedException when emails array is undefined', async () => {
            // arrange
            const profile = createMockProfile({ emails: undefined, displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from Google');
        });

        it('should throw UnauthorizedException when emails array is empty', async () => {
            // arrange
            const profile = createMockProfile({ emails: [], displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from Google');
        });

        it('should fall back to name.givenName when displayName is missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@google.com' }],
                displayName: undefined as unknown as string,
                name: { givenName: 'John', familyName: 'Doe' },
            });

            // act
            const result = await connector.validate('access', 'refresh', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'John' }));
        });

        it('should fall back to name.familyName when displayName and givenName are missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@google.com' }],
                displayName: undefined as unknown as string,
                name: { givenName: undefined as unknown as string, familyName: 'Doe' },
            });

            // act
            await connector.validate('access', 'refresh', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'Doe' }));
        });

        it('should throw UnauthorizedException when no displayName, givenName or familyName are provided', async () => {
            // arrange
            const profile = createMockProfile({
                emails: [{ value: 'dev@google.com' }],
                displayName: undefined as unknown as string,
                name: undefined,
            });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No display name provided from Google');
        });

        it('should derive userName from email when profile.username is undefined', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@google.com' }],
                displayName: 'John Doe',
                username: undefined as unknown as string,
            });

            // act
            await connector.validate('access', 'refresh', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ userName: 'dev' }));
        });
    });

    // #endregion
});

// #region Helpers

function createMockUser(overrides: Partial<IAuthSubject> = {}): IAuthSubject {
    return {
        id: 'user-1',
        userName: 'johndoe',
        email: 'dev@google.com',
        password: null,
        isVerified: true,
        isAnonymous: false,
        roles: ['user'],
        mfaEnabled: false,
        ...overrides,
    };
}

function createMockProfile(overrides: Partial<Pick<Profile, 'emails' | 'displayName' | 'username' | 'name'>>): Profile {
    return {
        id: 'g-123',
        provider: 'google',
        profileUrl: 'https://google.com/johndoe',
        displayName: 'John Doe',
        username: 'johndoe',
        name: { givenName: 'John', familyName: 'Doe' },
        emails: [{ value: 'dev@google.com' }],
        photos: [],
        ...overrides,
    } as Profile;
}

// #endregion
