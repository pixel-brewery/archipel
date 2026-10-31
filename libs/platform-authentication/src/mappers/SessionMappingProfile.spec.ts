// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';

import type { IMappingBuilder } from '@pixel-brewery/archipel-platform-mapping';
import type { ISessionRecord } from '../contracts/ISessionRecord.js';
import { SessionResponse } from '../models/responses/SessionResponse.js';
import { SESSION_LIST_MAPPING_KEY, SESSION_MAPPING_KEY, SessionMappingProfile } from './SessionMappingProfile.js';

// #endregion

// #region Tests

describe('SessionMappingProfile', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    function createSessionRecord(overrides?: Partial<ISessionRecord>): ISessionRecord {
        return {
            id: 'session-1',
            token: 'tok-abc',
            userId: 'user-1',
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0',
            deviceType: 'desktop',
            deviceName: 'macOS Chrome',
            browserName: 'Chrome',
            browserVersion: '120.0.0',
            osName: 'macOS',
            osVersion: '14.0',
            location: 'Berlin, DE',
            clientName: 'web-app',
            lastActive: new Date('2024-01-15T10:00:00Z'),
            createdAt: new Date('2024-01-01T08:00:00Z'),
            ...overrides,
        };
    }

    describe('mapping keys', () => {
        it('should export SESSION_MAPPING_KEY', () => {
            expect(SESSION_MAPPING_KEY).toBeDefined();
        });

        it('should export SESSION_LIST_MAPPING_KEY', () => {
            expect(SESSION_LIST_MAPPING_KEY).toBeDefined();
        });
    });

    describe('configure', () => {
        it('should register both keyed maps', () => {
            // arrange
            const profile = new SessionMappingProfile();
            const mockBuilder: IMappingBuilder = {
                createKeyedMap: vi.fn().mockReturnThis(),
            } as unknown as IMappingBuilder;

            // act
            profile.configure(mockBuilder);

            // assert
            expect(mockBuilder.createKeyedMap).toHaveBeenCalledTimes(2);
        });
    });

    describe('entity-to-response mapping', () => {
        it('should map a session entity to a SessionResponse', () => {
            // arrange
            const profile = new SessionMappingProfile();
            let mapFn: ((input: { session: ISessionRecord; isCurrent: boolean }) => SessionResponse) | undefined;
            const mockBuilder: IMappingBuilder = {
                createKeyedMap: vi.fn().mockImplementation((_key: unknown, fn: unknown) => {
                    if (!mapFn) {
                        mapFn = fn as typeof mapFn;
                    }
                    return mockBuilder;
                }),
            } as unknown as IMappingBuilder;
            profile.configure(mockBuilder);

            const session = createSessionRecord();

            // act
            const result = mapFn!({ session, isCurrent: true });

            // assert
            expect(result).toBeInstanceOf(SessionResponse);
            expect(result.id).toBe('session-1');
            expect(result.deviceType).toBe('desktop');
            expect(result.deviceName).toBe('macOS Chrome');
            expect(result.browserName).toBe('Chrome');
            expect(result.browserVersion).toBe('120.0.0');
            expect(result.osName).toBe('macOS');
            expect(result.osVersion).toBe('14.0');
            expect(result.location).toBe('Berlin, DE');
            expect(result.ipAddress).toBe('127.0.0.1');
            expect(result.isCurrent).toBe(true);
            expect(result.clientName).toBe('web-app');
            expect(result.lastActive).toEqual(new Date('2024-01-15T10:00:00Z'));
            expect(result.createdAt).toEqual(new Date('2024-01-01T08:00:00Z'));
        });

        it('should map nullable fields to null', () => {
            // arrange
            const profile = new SessionMappingProfile();
            let mapFn: ((input: { session: ISessionRecord; isCurrent: boolean }) => SessionResponse) | undefined;
            const mockBuilder: IMappingBuilder = {
                createKeyedMap: vi.fn().mockImplementation((_key: unknown, fn: unknown) => {
                    if (!mapFn) {
                        mapFn = fn as typeof mapFn;
                    }
                    return mockBuilder;
                }),
            } as unknown as IMappingBuilder;
            profile.configure(mockBuilder);

            const session = createSessionRecord({
                deviceType: null,
                deviceName: null,
                browserName: null,
                browserVersion: null,
                osName: null,
                osVersion: null,
                location: null,
                clientName: null,
            });

            // act
            const result = mapFn!({ session, isCurrent: false });

            // assert
            expect(result.deviceType).toBeNull();
            expect(result.deviceName).toBeNull();
            expect(result.browserName).toBeNull();
            expect(result.browserVersion).toBeNull();
            expect(result.osName).toBeNull();
            expect(result.osVersion).toBeNull();
            expect(result.location).toBeNull();
            expect(result.clientName).toBeNull();
            expect(result.isCurrent).toBe(false);
        });
    });

    describe('entity-list-to-response mapping', () => {
        it('should map an array of session entities to an array of responses', () => {
            // arrange
            const profile = new SessionMappingProfile();
            let listMapFn: ((inputs: Array<{ session: ISessionRecord; isCurrent: boolean }>) => Array<SessionResponse>) | undefined;
            const mockBuilder: IMappingBuilder = {
                createKeyedMap: vi.fn().mockImplementation((_key: unknown, fn: unknown) => {
                    listMapFn = fn as typeof listMapFn;
                    return mockBuilder;
                }),
            } as unknown as IMappingBuilder;
            profile.configure(mockBuilder);

            const sessions = [
                { session: createSessionRecord({ id: 's1' }), isCurrent: true },
                { session: createSessionRecord({ id: 's2' }), isCurrent: false },
            ];

            // act
            const result = listMapFn!(sessions);

            // assert
            expect(result).toHaveLength(2);
            expect(result[0].id).toBe('s1');
            expect(result[0].isCurrent).toBe(true);
            expect(result[1].id).toBe('s2');
            expect(result[1].isCurrent).toBe(false);
        });
    });
});

// #endregion
