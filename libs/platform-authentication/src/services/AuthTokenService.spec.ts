// #region Imports

import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { TokenEnricherBase } from '../abstracts/TokenEnricherBase.js';
import { AuthTokenService } from './AuthTokenService.js';

// #endregion

// #region Tests

describe('AuthTokenService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('createAccessToken', () => {
        it('should inject the configured token enricher through its port token', async () => {
            // arrange
            const mockJwtService = {
                signAsync: vi.fn().mockResolvedValue('injected.enriched.token'),
            };
            const mockEnricher = {
                enrichClaims: vi.fn().mockResolvedValue({ tenantId: 'tenant-42' }),
            };
            const moduleRef = await Test.createTestingModule({
                providers: [AuthTokenService, { provide: JwtService, useValue: mockJwtService }, { provide: TokenEnricherBase, useValue: mockEnricher }],
            }).compile();
            const service = moduleRef.get(AuthTokenService);
            const subject: IAuthSubject = {
                id: 'user-2',
                userName: 'jane',
                email: 'jane@example.com',
                password: null,
                isVerified: true,
                isAnonymous: false,
                roles: ['user'],
                mfaEnabled: false,
            };

            // act
            const result = await service.createAccessToken(subject, 'session-1');

            // assert
            expect(result).toBe('injected.enriched.token');
            expect(mockEnricher.enrichClaims).toHaveBeenCalledWith(subject);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                id: 'user-2',
                email: 'jane@example.com',
                roles: ['user'],
                tenantId: 'tenant-42',
                sid: 'session-1',
            });

            await moduleRef.close();
        });

        it('should sign a token with base claims from the subject', async () => {
            // arrange
            const mockJwtService = {
                signAsync: vi.fn().mockResolvedValue('signed.jwt.token'),
            };
            const service = new AuthTokenService(mockJwtService as never, null);
            const subject: IAuthSubject = {
                id: 'user-1',
                userName: 'john',
                email: 'john@example.com',
                password: null,
                isVerified: true,
                isAnonymous: false,
                roles: ['user', 'admin'],
                mfaEnabled: false,
            };

            // act
            const result = await service.createAccessToken(subject, 'session-1');

            // assert
            expect(result).toBe('signed.jwt.token');
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                id: 'user-1',
                email: 'john@example.com',
                roles: ['user', 'admin'],
                sid: 'session-1',
            });
        });

        it('should produce a fresh roles array to prevent mutation', async () => {
            // arrange
            const mockJwtService = {
                signAsync: vi.fn().mockResolvedValue('token'),
            };
            const roles = ['user'];
            const subject: IAuthSubject = {
                id: 'user-1',
                userName: null,
                email: null,
                password: null,
                isVerified: false,
                isAnonymous: false,
                roles,
                mfaEnabled: false,
            };
            const service = new AuthTokenService(mockJwtService as never, null);

            // act
            await service.createAccessToken(subject, 'session-1');

            // assert
            const signedClaims = mockJwtService.signAsync.mock.calls[0][0] as Record<string, unknown>;
            expect(signedClaims['roles']).not.toBe(roles);
            expect(signedClaims['roles']).toEqual(['user']);
        });

        it('should enrich claims when a token enricher is provided', async () => {
            // arrange
            const mockJwtService = {
                signAsync: vi.fn().mockResolvedValue('enriched.token'),
            };
            const mockEnricher = {
                enrichClaims: vi.fn().mockResolvedValue({ tenantId: 'tenant-42', isPro: true }),
            } as unknown as TokenEnricherBase;
            const service = new AuthTokenService(mockJwtService as never, mockEnricher);
            const subject: IAuthSubject = {
                id: 'user-2',
                userName: 'jane',
                email: 'jane@example.com',
                password: null,
                isVerified: true,
                isAnonymous: false,
                roles: ['user'],
                mfaEnabled: false,
            };

            // act
            const result = await service.createAccessToken(subject, 'session-1');

            // assert
            expect(result).toBe('enriched.token');
            expect(mockEnricher.enrichClaims).toHaveBeenCalledWith(subject);
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                id: 'user-2',
                email: 'jane@example.com',
                roles: ['user'],
                tenantId: 'tenant-42',
                isPro: true,
                sid: 'session-1',
            });
        });

        it('should not call enricher when none is provided', async () => {
            // arrange
            const mockJwtService = {
                signAsync: vi.fn().mockResolvedValue('basic.token'),
            };
            const service = new AuthTokenService(mockJwtService as never, null);
            const subject: IAuthSubject = {
                id: 'user-3',
                userName: null,
                email: null,
                password: null,
                isVerified: false,
                isAnonymous: true,
                roles: [],
                mfaEnabled: false,
            };

            // act
            await service.createAccessToken(subject, 'session-1');

            // assert
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                id: 'user-3',
                email: null,
                roles: [],
                sid: 'session-1',
            });
        });
    });
});

// #endregion
