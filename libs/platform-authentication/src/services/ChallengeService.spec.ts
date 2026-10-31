import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChallengeStoreBase } from '../abstracts/ChallengeStoreBase.js';
import { ChallengeService } from './ChallengeService.js';
import { InMemoryChallengeStore } from './InMemoryChallengeStore.js';

describe('ChallengeService', () => {
    // #region Fields

    let service: ChallengeService;
    let mockConfigService: Partial<ConfigService>;
    let store: ChallengeStoreBase;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockConfigService = {
            tryGet: vi.fn().mockImplementation((key: string, defaultValue: string) => {
                if (key === 'AUTH_MFA_CHALLENGE_EXPIRES_IN') return '5m';
                if (key === 'AUTH_MFA_MAX_ATTEMPTS') return '3';
                return defaultValue;
            }),
        };

        store = new InMemoryChallengeStore();
        service = new ChallengeService(mockConfigService as ConfigService, store);
    });

    // #endregion

    // #region Methods

    describe('create', () => {
        it('should create a challenge with all fields', async () => {
            // act
            const challenge = await service.create('user-1', ['totp', 'email'], 'totp', '127.0.0.1', 'Mozilla/5.0', 'Berlin', 'Web');

            // assert
            expect(challenge.id).toBeDefined();
            expect(challenge.userId).toBe('user-1');
            expect(challenge.allowedMethods).toEqual(['totp', 'email']);
            expect(challenge.preferredMethod).toBe('totp');
            expect(challenge.ipAddress).toBe('127.0.0.1');
            expect(challenge.attempts).toBe(0);
            expect(challenge.expiresAt.getTime()).toBeGreaterThan(Date.now());
        });

        it('should fall back to first method when preferred is not in allowed list', async () => {
            // act
            const challenge = await service.create('user-1', ['email'], 'totp');

            // assert
            expect(challenge.preferredMethod).toBe('email');
        });
    });

    describe('get', () => {
        it('should return a previously created challenge', async () => {
            // arrange
            const created = await service.create('user-1', ['totp']);

            // act
            const result = await service.get(created.id);

            // assert
            expect(result.id).toBe(created.id);
            expect(result.userId).toBe('user-1');
        });

        it('should throw UnauthorizedException for unknown challenge id', async () => {
            // act & assert
            await expect(service.get('non-existent')).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException for expired challenge', async () => {
            // arrange
            const created = await service.create('user-1', ['totp']);
            // Manually expire the challenge by manipulating internal state
            vi.spyOn(Date, 'now').mockReturnValue(created.expiresAt.getTime() + 1);

            // act & assert
            await expect(service.get(created.id)).rejects.toThrow('MFA challenge expired');
        });
    });

    describe('incrementAttempts', () => {
        it('should increment attempts counter', async () => {
            // arrange
            const created = await service.create('user-1', ['totp']);

            // act
            const updated = await service.incrementAttempts(created.id);

            // assert
            expect(updated.attempts).toBe(1);
        });

        it('should throw and delete challenge after max attempts', async () => {
            // arrange
            const created = await service.create('user-1', ['totp']);
            await service.incrementAttempts(created.id);
            await service.incrementAttempts(created.id);

            // act & assert (3rd attempt = maxAttempts)
            await expect(service.incrementAttempts(created.id)).rejects.toThrow('MFA challenge locked');
            // Challenge should be deleted
            await expect(service.get(created.id)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('invalidate', () => {
        it('should remove the challenge', async () => {
            // arrange
            const created = await service.create('user-1', ['totp']);

            // act
            await service.invalidate(created.id);

            // assert
            await expect(service.get(created.id)).rejects.toThrow(UnauthorizedException);
        });
    });

    // #endregion
});
