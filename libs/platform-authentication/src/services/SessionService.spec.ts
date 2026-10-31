import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ISessionRecord } from '../contracts/ISessionRecord.js';
import { SessionRefreshOutcome } from '../models/SessionRefreshOutcome.js';
import { SessionService } from './SessionService.js';

describe('SessionService', () => {
    // #region Fields

    const REFRESH_LIFETIME_MILLIS = 7 * 24 * 60 * 60 * 1000;
    const now = new Date('2026-08-27T12:00:00.000Z');
    const activeAfter = new Date('2026-08-27T11:30:00.000Z');

    let service: SessionService;
    let mockSessionPersistence: Record<string, ReturnType<typeof vi.fn>>;
    let mockMappingService: Record<string, ReturnType<typeof vi.fn>>;

    // #endregion

    // #region Methods

    function createRecord(overrides: Partial<ISessionRecord> = {}): ISessionRecord {
        return {
            id: 'session-1',
            userId: 'user-1',
            ipAddress: '127.0.0.1',
            userAgent: null,
            deviceType: null,
            deviceName: null,
            browserName: null,
            browserVersion: null,
            osName: null,
            osVersion: null,
            location: null,
            clientName: null,
            refreshTokenHash: null,
            previousRefreshTokenHash: null,
            refreshTokenExpiresAt: null,
            lastActive: new Date('2026-08-27T11:59:00.000Z'),
            createdAt: new Date('2026-08-27T10:00:00.000Z'),
            ...overrides,
        };
    }

    beforeEach(() => {
        vi.restoreAllMocks();

        mockSessionPersistence = {
            create: vi.fn().mockResolvedValue(createRecord()),
            findById: vi.fn().mockResolvedValue(null),
            findByRefreshTokenHash: vi.fn().mockResolvedValue(null),
            findAllByUserId: vi.fn().mockResolvedValue([]),
            updateLastActive: vi.fn().mockResolvedValue(undefined),
            rotateRefreshToken: vi.fn().mockResolvedValue(true),
            invalidate: vi.fn().mockResolvedValue(false),
            invalidateById: vi.fn().mockResolvedValue(false),
            deleteInactive: vi.fn().mockResolvedValue(0),
        };

        mockMappingService = {
            map: vi.fn().mockReturnValue([]),
        };

        service = new SessionService(mockSessionPersistence as never, mockMappingService as never);
    });

    // #endregion

    // #region Methods

    describe('create', () => {
        it('should persist the refresh token only as a hash and return it once', async () => {
            // act
            const issued = await service.create('user-1', '127.0.0.1', REFRESH_LIFETIME_MILLIS, { now });

            // assert
            const args = mockSessionPersistence.create.mock.calls[0][0];
            expect(args.userId).toBe('user-1');
            expect(args.ipAddress).toBe('127.0.0.1');
            expect(args.refreshTokenHash).toBe(SessionService.hashRefreshToken(issued.refreshToken));
            expect(args.refreshTokenHash).not.toBe(issued.refreshToken);
            expect(args.refreshTokenExpiresAt).toEqual(new Date(now.getTime() + REFRESH_LIFETIME_MILLIS));
        });

        it('should forward device, location and client details', async () => {
            // act
            await service.create('user-1', '127.0.0.1', REFRESH_LIFETIME_MILLIS, {
                deviceInfo: { userAgent: 'agent' } as never,
                location: 'Berlin',
                clientName: 'mobile-app',
                now,
            });

            // assert
            expect(mockSessionPersistence.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    deviceInfo: { userAgent: 'agent' },
                    location: 'Berlin',
                    clientName: 'mobile-app',
                }),
            );
        });

        it('should issue a different refresh token for every session', async () => {
            // act
            const first = await service.create('user-1', '127.0.0.1', REFRESH_LIFETIME_MILLIS, { now });
            const second = await service.create('user-1', '127.0.0.1', REFRESH_LIFETIME_MILLIS, { now });

            // assert
            expect(first.refreshToken).not.toBe(second.refreshToken);
        });
    });

    describe('isActive', () => {
        it('should return true when the session was active after the cutoff', async () => {
            // arrange
            mockSessionPersistence.findById.mockResolvedValue(createRecord());

            // act
            const result = await service.isActive('session-1', activeAfter);

            // assert
            expect(mockSessionPersistence.findById).toHaveBeenCalledWith('session-1');
            expect(result).toBe(true);
        });

        it('should return false when the session is missing or older than the cutoff', async () => {
            // arrange
            mockSessionPersistence.findById.mockResolvedValueOnce(null);
            mockSessionPersistence.findById.mockResolvedValueOnce(createRecord({ lastActive: new Date('2026-08-27T11:00:00.000Z') }));

            // act
            const missing = await service.isActive('session-1', activeAfter);
            const idle = await service.isActive('session-1', activeAfter);

            // assert
            expect(missing).toBe(false);
            expect(idle).toBe(false);
        });
    });

    describe('updateLastActive', () => {
        it('should update lastActive when the session exists', async () => {
            // arrange
            mockSessionPersistence.findById.mockResolvedValue(createRecord());

            // act
            await service.updateLastActive('session-1');

            // assert
            expect(mockSessionPersistence.updateLastActive).toHaveBeenCalledWith('session-1', expect.any(Date));
        });

        it('should not update when the session does not exist', async () => {
            // act
            await service.updateLastActive('session-1');

            // assert
            expect(mockSessionPersistence.updateLastActive).not.toHaveBeenCalled();
        });
    });

    describe('refresh', () => {
        it('should rotate the credential and report the refreshed session', async () => {
            // arrange
            const presented = 'presented-refresh-token';
            const record = createRecord({ refreshTokenHash: SessionService.hashRefreshToken(presented) });
            mockSessionPersistence.findByRefreshTokenHash.mockResolvedValue(record);

            // act
            const result = await service.refresh(presented, REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Refreshed);
            expect(result.refreshToken).toBeTypeOf('string');
            expect(result.refreshToken).not.toBe(presented);
            expect(mockSessionPersistence.rotateRefreshToken).toHaveBeenCalledWith(
                expect.objectContaining({
                    sessionId: 'session-1',
                    expectedRefreshTokenHash: SessionService.hashRefreshToken(presented),
                    lastActive: now,
                }),
            );
        });

        it('should revoke the session when a already replaced credential is presented again', async () => {
            // arrange
            const replayed = 'replayed-refresh-token';
            const record = createRecord({
                refreshTokenHash: 'current-hash',
                previousRefreshTokenHash: SessionService.hashRefreshToken(replayed),
            });
            mockSessionPersistence.findByRefreshTokenHash.mockResolvedValue(record);

            // act
            const result = await service.refresh(replayed, REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Replayed);
            expect(mockSessionPersistence.invalidate).toHaveBeenCalledWith('session-1');
            expect(mockSessionPersistence.rotateRefreshToken).not.toHaveBeenCalled();
        });

        it('should report an unknown credential without touching any session', async () => {
            // act
            const result = await service.refresh('nobodys-token', REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Unknown);
            expect(mockSessionPersistence.invalidate).not.toHaveBeenCalled();
            expect(mockSessionPersistence.rotateRefreshToken).not.toHaveBeenCalled();
        });

        it('should refuse a session that left its inactivity window', async () => {
            // arrange
            const presented = 'presented-refresh-token';
            mockSessionPersistence.findByRefreshTokenHash.mockResolvedValue(
                createRecord({
                    refreshTokenHash: SessionService.hashRefreshToken(presented),
                    lastActive: new Date('2026-08-27T11:00:00.000Z'),
                }),
            );

            // act
            const result = await service.refresh(presented, REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Inactive);
            expect(mockSessionPersistence.rotateRefreshToken).not.toHaveBeenCalled();
        });

        it('should refuse a credential that outlived its own validity', async () => {
            // arrange
            const presented = 'presented-refresh-token';
            mockSessionPersistence.findByRefreshTokenHash.mockResolvedValue(
                createRecord({
                    refreshTokenHash: SessionService.hashRefreshToken(presented),
                    refreshTokenExpiresAt: new Date('2026-08-27T11:45:00.000Z'),
                }),
            );

            // act
            const result = await service.refresh(presented, REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Expired);
            expect(mockSessionPersistence.rotateRefreshToken).not.toHaveBeenCalled();
        });

        it('should report an unknown credential when a concurrent exchange won the rotation', async () => {
            // arrange
            const presented = 'presented-refresh-token';
            mockSessionPersistence.findByRefreshTokenHash.mockResolvedValue(createRecord({ refreshTokenHash: SessionService.hashRefreshToken(presented) }));
            mockSessionPersistence.rotateRefreshToken.mockResolvedValue(false);

            // act
            const result = await service.refresh(presented, REFRESH_LIFETIME_MILLIS, activeAfter, now);

            // assert
            expect(result.outcome).toBe(SessionRefreshOutcome.Unknown);
            expect(result.refreshToken).toBeUndefined();
        });
    });

    describe('hasActiveSession', () => {
        it('should return true when at least one session is inside the window', async () => {
            // arrange
            mockSessionPersistence.findAllByUserId.mockResolvedValue([createRecord({ lastActive: new Date('2026-08-27T11:00:00.000Z') }), createRecord()]);

            // act
            const result = await service.hasActiveSession('user-1', activeAfter);

            // assert
            expect(result).toBe(true);
        });

        it('should return false when every session left the window', async () => {
            // arrange
            mockSessionPersistence.findAllByUserId.mockResolvedValue([createRecord({ lastActive: new Date('2026-08-27T11:00:00.000Z') })]);

            // act
            const result = await service.hasActiveSession('user-1', activeAfter);

            // assert
            expect(result).toBe(false);
        });
    });

    describe('listSessions', () => {
        it('should mark the current session by identifier and delegate to the mapping service', async () => {
            // arrange
            mockSessionPersistence.findAllByUserId.mockResolvedValue([createRecord({ id: 'session-1' }), createRecord({ id: 'session-2' })]);

            // act
            await service.listSessions('user-1', 'session-2');

            // assert
            expect(mockMappingService.map).toHaveBeenCalledWith(expect.anything(), [
                expect.objectContaining({ isCurrent: false }),
                expect.objectContaining({ isCurrent: true }),
            ]);
        });
    });

    describe('invalidate', () => {
        it('should delegate removal by identifier', async () => {
            // arrange
            mockSessionPersistence.invalidate.mockResolvedValue(true);

            // act
            const result = await service.invalidate('session-1');

            // assert
            expect(mockSessionPersistence.invalidate).toHaveBeenCalledWith('session-1');
            expect(result).toBe(true);
        });

        it('should report when no session was removed', async () => {
            // act
            const result = await service.invalidate('session-1');

            // assert
            expect(result).toBe(false);
        });
    });

    describe('invalidateById', () => {
        it('should delegate removal by identifier and owner', async () => {
            // arrange
            mockSessionPersistence.invalidateById.mockResolvedValue(true);

            // act
            const result = await service.invalidateById('session-1', 'user-1');

            // assert
            expect(mockSessionPersistence.invalidateById).toHaveBeenCalledWith('session-1', 'user-1');
            expect(result).toBe(true);
        });

        it('should report when no session was removed', async () => {
            // act
            const result = await service.invalidateById('session-1', 'user-1');

            // assert
            expect(result).toBe(false);
        });
    });

    describe('findById', () => {
        it('should return the session when it exists', async () => {
            // arrange
            mockSessionPersistence.findById.mockResolvedValue(createRecord());

            // act
            const result = await service.findById('session-1');

            // assert
            expect(result?.id).toBe('session-1');
        });

        it('should return null when it does not exist', async () => {
            // act
            const result = await service.findById('session-1');

            // assert
            expect(result).toBeNull();
        });
    });

    describe('purgeInactive', () => {
        it('should delegate the cutoff to the persistence port', async () => {
            // arrange
            mockSessionPersistence.deleteInactive.mockResolvedValue(3);

            // act
            const removed = await service.purgeInactive('user-1', activeAfter);

            // assert
            expect(mockSessionPersistence.deleteInactive).toHaveBeenCalledWith('user-1', activeAfter);
            expect(removed).toBe(3);
        });

        it('should report zero when nothing was removed', async () => {
            // act
            const removed = await service.purgeInactive('user-1', activeAfter);

            // assert
            expect(removed).toBe(0);
        });
    });

    // #endregion
});
