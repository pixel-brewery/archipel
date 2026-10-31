import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import { VERCEL_EDGE_CONFIG, VERCEL_FEATURE_FLAG_PREFIX } from './env.js';
import { VercelFeatureFlagReader } from './VercelFeatureFlagReader.js';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

const mockGet = vi.fn();
const mockGetAll = vi.fn();
const mockHas = vi.fn();
const mockDigest = vi.fn();

vi.mock('@vercel/edge-config', () => ({
    createClient: vi.fn(() => ({
        get: mockGet,
        getAll: mockGetAll,
        has: mockHas,
        digest: mockDigest,
    })),
}));

// ──────────────────────────────────────────────────────────────
// ConfigService stub
// ──────────────────────────────────────────────────────────────

function createMockConfigService(overrides: Record<string, unknown> = {}) {
    return {
        get: vi.fn((key: string) => overrides[key]),
    };
}

describe('VercelFeatureFlagReader', () => {
    // #region Fields

    let client: VercelFeatureFlagReader;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    // ──────────────────────────────────────────────────────────────
    // onModuleInit
    // ──────────────────────────────────────────────────────────────

    describe('onModuleInit', () => {
        it('should initialize with a connection string', async () => {
            // arrange
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });

            client = new VercelFeatureFlagReader(configService as never);

            // act
            await client.onModuleInit();

            // assert — no error thrown means success
            expect(configService.get).toHaveBeenCalledWith(VERCEL_EDGE_CONFIG.key);
        });

        it('should throw FeatureFlagError when connection string is missing', async () => {
            // arrange
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: undefined,
            });

            client = new VercelFeatureFlagReader(configService as never);

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('EDGE_CONFIG must be configured');
        });

        it('should use custom flag prefix when configured', async () => {
            // arrange
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
                [VERCEL_FEATURE_FLAG_PREFIX.key]: 'customFlags',
            });

            client = new VercelFeatureFlagReader(configService as never);

            // act
            await client.onModuleInit();

            // assert
            expect(configService.get).toHaveBeenCalledWith(VERCEL_FEATURE_FLAG_PREFIX.key);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // isEnabled
    // ──────────────────────────────────────────────────────────────

    describe('isEnabled', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });
            client = new VercelFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return true when the flag value is truthy', async () => {
            // arrange
            mockGet.mockResolvedValue({ 'dark-mode': true, beta: false });

            // act
            const result = await client.isEnabled('dark-mode');

            // assert
            expect(result).toBe(true);
        });

        it('should return false when the flag value is false', async () => {
            // arrange
            mockGet.mockResolvedValue({ 'dark-mode': true, beta: false });

            // act
            const result = await client.isEnabled('beta');

            // assert
            expect(result).toBe(false);
        });

        it('should return false when the flag key does not exist', async () => {
            // arrange
            mockGet.mockResolvedValue({ 'dark-mode': true });

            // act
            const result = await client.isEnabled('nonexistent');

            // assert
            expect(result).toBe(false);
        });

        it('should return false when the flags object is undefined', async () => {
            // arrange
            mockGet.mockResolvedValue(undefined);

            // act
            const result = await client.isEnabled('any-flag');

            // assert
            expect(result).toBe(false);
        });

        it('should throw FeatureFlagError when the edge config client fails', async () => {
            // arrange
            mockGet.mockRejectedValue(new Error('network error'));

            // act & assert
            await expect(client.isEnabled('any-flag')).rejects.toThrow(FeatureFlagError);
            await expect(client.isEnabled('any-flag')).rejects.toThrow('Failed to evaluate feature flag "any-flag"');
        });
    });

    describe('isEnabled before initialization', () => {
        it('should throw FeatureFlagError when called before onModuleInit', async () => {
            // arrange
            const configService = createMockConfigService();
            client = new VercelFeatureFlagReader(configService as never);

            // act & assert
            await expect(client.isEnabled('any-flag')).rejects.toThrow(FeatureFlagError);
            await expect(client.isEnabled('any-flag')).rejects.toThrow('has not been initialized');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // getVariant
    // ──────────────────────────────────────────────────────────────

    describe('getVariant', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });
            client = new VercelFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return the variant value when the flag exists', async () => {
            // arrange
            mockGet.mockResolvedValue({ 'pricing-tier': 'enterprise' });

            // act
            const result = await client.getVariant('pricing-tier', 'free');

            // assert
            expect(result).toBe('enterprise');
        });

        it('should return the default value when the flag does not exist', async () => {
            // arrange
            mockGet.mockResolvedValue({ 'other-flag': true });

            // act
            const result = await client.getVariant('pricing-tier', 'free');

            // assert
            expect(result).toBe('free');
        });

        it('should return the default value when flags object is undefined', async () => {
            // arrange
            mockGet.mockResolvedValue(undefined);

            // act
            const result = await client.getVariant('pricing-tier', 'basic');

            // assert
            expect(result).toBe('basic');
        });

        it('should throw FeatureFlagError when the client fails', async () => {
            // arrange
            mockGet.mockRejectedValue(new Error('edge config error'));

            // act & assert
            await expect(client.getVariant('flag', 'default')).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // getAllFlags
    // ──────────────────────────────────────────────────────────────

    describe('getAllFlags', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });
            client = new VercelFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return evaluated flags from the edge config store', async () => {
            // arrange
            mockGet.mockResolvedValue({
                'dark-mode': true,
                beta: false,
                'pricing-tier': 'enterprise',
            });

            // act
            const result = await client.getAllFlags();

            // assert
            expect(result).toEqual([
                { key: 'dark-mode', enabled: true, variant: undefined },
                { key: 'beta', enabled: false, variant: undefined },
                { key: 'pricing-tier', enabled: true, variant: 'enterprise' },
            ]);
        });

        it('should return an empty array when no flags exist', async () => {
            // arrange
            mockGet.mockResolvedValue(undefined);

            // act
            const result = await client.getAllFlags();

            // assert
            expect(result).toEqual([]);
        });

        it('should throw FeatureFlagError when retrieval fails', async () => {
            // arrange
            mockGet.mockRejectedValue(new Error('network timeout'));

            // act & assert
            await expect(client.getAllFlags()).rejects.toThrow(FeatureFlagError);
            await expect(client.getAllFlags()).rejects.toThrow('Failed to retrieve all feature flags');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // refresh
    // ──────────────────────────────────────────────────────────────

    describe('refresh', () => {
        it('should be a no-op and resolve successfully', async () => {
            // arrange
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });
            client = new VercelFeatureFlagReader(configService as never);
            await client.onModuleInit();

            // act & assert
            await expect(client.refresh()).resolves.toBeUndefined();
        });
    });

    // ──────────────────────────────────────────────────────────────
    // ping
    // ──────────────────────────────────────────────────────────────

    describe('ping', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [VERCEL_EDGE_CONFIG.key]: 'https://edge-config.vercel.com/ecfg_xxx?token=abc',
            });
            client = new VercelFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return true when digest succeeds', async () => {
            // arrange
            mockDigest.mockResolvedValue('abc123');

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(true);
        });

        it('should return false when digest fails', async () => {
            // arrange
            mockDigest.mockRejectedValue(new Error('unreachable'));

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});
