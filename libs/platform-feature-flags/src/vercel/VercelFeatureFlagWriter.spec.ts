import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';
import { VERCEL_API_TOKEN, VERCEL_EDGE_CONFIG_ID, VERCEL_TEAM_ID } from './env.js';
import { VercelFeatureFlagWriter } from './VercelFeatureFlagWriter.js';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

// ──────────────────────────────────────────────────────────────
// ConfigService stub
// ──────────────────────────────────────────────────────────────

function createMockConfigService(overrides: Record<string, unknown> = {}) {
    return {
        get: vi.fn((key: string) => overrides[key]),
    };
}

function createInitializedClient(configOverrides: Record<string, unknown> = {}): VercelFeatureFlagWriter {
    const config = {
        [VERCEL_API_TOKEN.key]: 'test-token',
        [VERCEL_EDGE_CONFIG_ID.key]: 'ecfg_123',
        ...configOverrides,
    };

    return new VercelFeatureFlagWriter(createMockConfigService(config) as never);
}

function mockReadResponse(flags: Record<string, unknown> | undefined, status = 200) {
    if (flags === undefined) {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: vi.fn().mockResolvedValue('Not Found'),
        });
    } else {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status,
            json: vi.fn().mockResolvedValue({ value: flags }),
        });
    }
}

function mockWriteResponse(ok = true, status = 200) {
    mockFetch.mockResolvedValueOnce({
        ok,
        status,
        text: vi.fn().mockResolvedValue(ok ? 'OK' : 'Error'),
    });
}

describe('VercelFeatureFlagWriter', () => {
    // #region Fields

    let client: VercelFeatureFlagWriter;

    // #endregion

    // #region Methods

    beforeEach(() => {
        mockFetch.mockReset();
    });

    // ──────────────────────────────────────────────────────────────
    // onModuleInit
    // ──────────────────────────────────────────────────────────────

    describe('onModuleInit', () => {
        it('should initialize with valid configuration', async () => {
            // arrange
            client = createInitializedClient();

            // act
            await client.onModuleInit();

            // assert — no error means success
        });

        it('should throw FeatureFlagError when API token is missing', async () => {
            // arrange
            client = createInitializedClient({
                [VERCEL_API_TOKEN.key]: undefined,
            });

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('VERCEL_API_TOKEN must be configured');
        });

        it('should throw FeatureFlagError when Edge Config ID is missing', async () => {
            // arrange
            client = createInitializedClient({
                [VERCEL_EDGE_CONFIG_ID.key]: undefined,
            });

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('VERCEL_EDGE_CONFIG_ID must be configured');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // getFlag
    // ──────────────────────────────────────────────────────────────

    describe('getFlag', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should return a flag definition for a boolean flag', async () => {
            // arrange
            mockReadResponse({ 'dark-mode': true });

            // act
            const result = await client.getFlag('dark-mode');

            // assert
            expect(result).toEqual({ key: 'dark-mode', enabled: true });
        });

        it('should return a flag definition for an object flag', async () => {
            // arrange
            mockReadResponse({
                'beta-feature': { enabled: false, description: 'Beta test', label: 'staging' },
            });

            // act
            const result = await client.getFlag('beta-feature');

            // assert
            expect(result).toEqual({
                key: 'beta-feature',
                enabled: false,
                description: 'Beta test',
                label: 'staging',
                variant: undefined,
            });
        });

        it('should return undefined when the flag does not exist', async () => {
            // arrange
            mockReadResponse({});

            // act
            const result = await client.getFlag('nonexistent');

            // assert
            expect(result).toBeUndefined();
        });

        it('should return undefined when edge config key does not exist', async () => {
            // arrange
            mockReadResponse(undefined);

            // act
            const result = await client.getFlag('nonexistent');

            // assert
            expect(result).toBeUndefined();
        });

        it('should throw FeatureFlagError when not initialized', async () => {
            // arrange
            const uninitializedClient = new VercelFeatureFlagWriter({
                get: vi.fn(),
            } as never);

            // act & assert
            await expect(uninitializedClient.getFlag('any')).rejects.toThrow(FeatureFlagError);
            await expect(uninitializedClient.getFlag('any')).rejects.toThrow('has not been initialized');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // listFlags
    // ──────────────────────────────────────────────────────────────

    describe('listFlags', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should return all feature flags', async () => {
            // arrange
            mockReadResponse({
                'dark-mode': true,
                'beta-feature': { enabled: false, description: 'Beta' },
            });

            // act
            const result = await client.listFlags();

            // assert
            expect(result).toHaveLength(2);
            expect(result[0]?.key).toBe('dark-mode');
            expect(result[1]?.key).toBe('beta-feature');
        });

        it('should return empty array when no flags exist', async () => {
            // arrange
            mockReadResponse(undefined);

            // act
            const result = await client.listFlags();

            // assert
            expect(result).toEqual([]);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // createFlag
    // ──────────────────────────────────────────────────────────────

    describe('createFlag', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should create a new feature flag', async () => {
            // arrange
            const definition: IFeatureFlagDefinition = {
                key: 'new-feature',
                enabled: true,
                description: 'A new feature',
            };

            mockReadResponse({}); // read existing flags
            mockWriteResponse(); // write updated flags

            // act
            await client.createFlag(definition);

            // assert
            const writeCall = mockFetch.mock.calls[1] as [string, RequestInit];
            expect(writeCall[1]?.method).toBe('PATCH');
        });

        it('should throw FeatureFlagError when flag already exists', async () => {
            // arrange
            mockReadResponse({ 'existing-flag': true });

            // act & assert
            await expect(client.createFlag({ key: 'existing-flag', enabled: true })).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // updateFlag
    // ──────────────────────────────────────────────────────────────

    describe('updateFlag', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should update an existing flag', async () => {
            // arrange
            mockReadResponse({ 'my-flag': true }); // read existing flags
            mockWriteResponse(); // write updated flags

            // act
            await client.updateFlag('my-flag', { enabled: false });

            // assert
            const writeCall = mockFetch.mock.calls[1] as [string, RequestInit];
            expect(writeCall[1]?.method).toBe('PATCH');
        });

        it('should throw FeatureFlagError when flag does not exist', async () => {
            // arrange
            mockReadResponse({});

            // act & assert
            await expect(client.updateFlag('missing', { enabled: true })).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // deleteFlag
    // ──────────────────────────────────────────────────────────────

    describe('deleteFlag', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should delete an existing flag', async () => {
            // arrange
            mockReadResponse({ 'old-feature': false }); // read existing flags
            mockWriteResponse(); // write updated flags

            // act
            await client.deleteFlag('old-feature');

            // assert
            const writeCall = mockFetch.mock.calls[1] as [string, RequestInit];
            expect(writeCall[1]?.method).toBe('PATCH');
        });

        it('should throw FeatureFlagError when flag does not exist', async () => {
            // arrange
            mockReadResponse({});

            // act & assert
            await expect(client.deleteFlag('missing')).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // ping
    // ──────────────────────────────────────────────────────────────

    describe('ping', () => {
        beforeEach(async () => {
            client = createInitializedClient();
            await client.onModuleInit();
        });

        it('should return true when reachable', async () => {
            // arrange
            mockReadResponse({});

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(true);
        });

        it('should return false when unreachable', async () => {
            // arrange
            mockFetch.mockRejectedValueOnce(new Error('Timeout'));

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(false);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // Team ID
    // ──────────────────────────────────────────────────────────────

    describe('team ID', () => {
        it('should append teamId to API URL when configured', async () => {
            // arrange
            client = createInitializedClient({
                [VERCEL_TEAM_ID.key]: 'team_abc123',
            });
            await client.onModuleInit();

            mockReadResponse({});

            // act
            await client.listFlags();

            // assert
            const fetchUrl = (mockFetch.mock.calls[0] as [string])[0];
            expect(fetchUrl).toContain('teamId=team_abc123');
        });
    });

    // #endregion
});
