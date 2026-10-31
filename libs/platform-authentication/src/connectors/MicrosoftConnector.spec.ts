import { UnauthorizedException } from '@nestjs/common';
import type { Profile as PassportProfile } from 'passport';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { MicrosoftConnector } from './MicrosoftConnector.js';

vi.mock('passport-microsoft', () => ({
    Strategy: class MockStrategy {},
}));

vi.mock('./abstracts/ConnectorBase', () => ({
    ConnectorBase: (strategy: unknown, _name?: string) => {
        return strategy as new (...args: unknown[]) => unknown;
    },
}));

describe('MicrosoftConnector', () => {
    // #region Fields

    let connector: MicrosoftConnector;
    let mockFindOrCreateByProfile: ReturnType<typeof vi.fn>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockFindOrCreateByProfile = vi.fn();

        connector = new MicrosoftConnector(
            { findOrCreateByProfile: mockFindOrCreateByProfile } as unknown as SocialAuthBase,
            {
                get: vi.fn().mockReturnValue('mock-value'),
                tryGet: vi.fn().mockImplementation((key: string, fallback: string) => {
                    if (key === 'AUTH_MICROSOFT_SCOPE') {
                        return 'user.read';
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
            const profile = createMockProfile({ emails: [{ value: 'dev@microsoft.com' }], displayName: 'John Doe' });

            // act
            const result = await connector.validate('access', 'refresh', profile);

            // assert
            expect(result).toBe(user);
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith({
                provider: 'microsoft',
                email: 'dev@microsoft.com',
                userName: 'johndoe',
                displayName: 'John Doe',
            });
        });

        it('should throw UnauthorizedException when emails array is undefined', async () => {
            // arrange
            const profile = createMockProfile({ emails: undefined, displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow(UnauthorizedException);
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from Microsoft');
        });

        it('should throw UnauthorizedException when emails array is empty', async () => {
            // arrange
            const profile = createMockProfile({ emails: [], displayName: 'John Doe' });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No email provided from Microsoft');
        });

        it('should fall back to name.givenName when displayName is missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@microsoft.com' }],
                displayName: undefined as unknown as string,
                name: { givenName: 'John', familyName: 'Doe' },
            });

            // act
            await connector.validate('access', 'refresh', profile);

            // assert
            expect(mockFindOrCreateByProfile).toHaveBeenCalledWith(expect.objectContaining({ displayName: 'John' }));
        });

        it('should fall back to name.familyName when displayName and givenName are missing', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@microsoft.com' }],
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
                emails: [{ value: 'dev@microsoft.com' }],
                displayName: undefined as unknown as string,
                name: undefined,
            });

            // act & assert
            await expect(connector.validate('access', 'refresh', profile)).rejects.toThrow('No display name provided from Microsoft');
        });

        it('should derive userName from email when profile.username is undefined', async () => {
            // arrange
            const user = createMockUser();
            mockFindOrCreateByProfile.mockResolvedValue(user);
            const profile = createMockProfile({
                emails: [{ value: 'dev@microsoft.com' }],
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
        email: 'dev@microsoft.com',
        password: null,
        isVerified: true,
        isAnonymous: false,
        roles: ['user'],
        mfaEnabled: false,
        ...overrides,
    };
}

function createMockProfile(overrides: Partial<Pick<PassportProfile, 'emails' | 'displayName' | 'username' | 'name'>>): PassportProfile {
    return {
        id: 'ms-123',
        provider: 'microsoft',
        displayName: 'John Doe',
        username: 'johndoe',
        name: { givenName: 'John', familyName: 'Doe' },
        emails: [{ value: 'dev@microsoft.com' }],
        photos: [],
        ...overrides,
    } as PassportProfile;
}

// #endregion
