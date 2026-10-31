import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import { AzureFeatureFlagReader } from './AzureFeatureFlagReader.js';
import { AZURE_APPCONFIG_CONNECTION_STRING, AZURE_APPCONFIG_ENDPOINT, AZURE_FEATURE_FLAG_KEY_FILTER, AZURE_FEATURE_FLAG_REFRESH_INTERVAL } from './env.js';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

const mockLoad = vi.fn();
const mockFeatureManagerIsEnabled = vi.fn();
const mockFeatureManagerGetVariant = vi.fn();
const mockRefresh = vi.fn();

vi.mock('@azure/app-configuration-provider', () => ({
    load: (...args: unknown[]) => mockLoad(...args),
}));

vi.mock('@microsoft/feature-management', () => {
    class MockFeatureManager {
        public isEnabled = mockFeatureManagerIsEnabled;
        public getVariant = mockFeatureManagerGetVariant;
    }

    return {
        FeatureManager: MockFeatureManager,
        ConfigurationMapFeatureFlagProvider: class {},
    };
});

vi.mock('@azure/identity', () => ({
    DefaultAzureCredential: class {},
}));

// ──────────────────────────────────────────────────────────────
// ConfigService stub
// ──────────────────────────────────────────────────────────────

function createMockConfigService(overrides: Record<string, unknown> = {}) {
    return {
        get: vi.fn((key: string) => overrides[key]),
    };
}

describe('AzureFeatureFlagReader', () => {
    // #region Fields

    let client: AzureFeatureFlagReader;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ──────────────────────────────────────────────────────────────
    // onModuleInit
    // ──────────────────────────────────────────────────────────────

    describe('onModuleInit', () => {
        it('should initialize with connection string', async () => {
            // arrange
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_ENDPOINT.key]: undefined,
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });

            client = new AzureFeatureFlagReader(configService as never);

            // act
            await client.onModuleInit();

            // assert
            expect(mockLoad).toHaveBeenCalledWith(
                'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
                expect.objectContaining({ featureFlagOptions: expect.any(Object) }),
            );
        });

        it('should initialize with endpoint and DefaultAzureCredential', async () => {
            // arrange
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_ENDPOINT.key]: 'https://myconfig.azconfig.io',
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: undefined,
            });

            client = new AzureFeatureFlagReader(configService as never);

            // act
            await client.onModuleInit();

            // assert
            expect(mockLoad).toHaveBeenCalledWith(
                'https://myconfig.azconfig.io',
                expect.any(Object), // DefaultAzureCredential instance
                expect.objectContaining({ featureFlagOptions: expect.any(Object) }),
            );
        });

        it('should throw FeatureFlagError when neither endpoint nor connection string is configured', async () => {
            // arrange
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_ENDPOINT.key]: undefined,
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: undefined,
            });

            client = new AzureFeatureFlagReader(configService as never);

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('Either AZURE_APPCONFIG_ENDPOINT or AZURE_APPCONFIG_CONNECTION_STRING must be configured.');
        });

        it('should wrap unexpected errors in FeatureFlagError', async () => {
            // arrange
            mockLoad.mockRejectedValue(new Error('network failure'));

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('Failed to initialize Azure App Configuration');
        });

        it('should use custom refresh interval and key filter from config', async () => {
            // arrange
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
                [AZURE_FEATURE_FLAG_REFRESH_INTERVAL.key]: 60_000,
                [AZURE_FEATURE_FLAG_KEY_FILTER.key]: 'myapp.*',
            });

            client = new AzureFeatureFlagReader(configService as never);

            // act
            await client.onModuleInit();

            // assert
            expect(mockLoad).toHaveBeenCalledWith(
                'conn-string',
                expect.objectContaining({
                    featureFlagOptions: expect.objectContaining({
                        selectors: [{ keyFilter: 'myapp.*' }],
                        refresh: expect.objectContaining({ refreshIntervalInMs: 60_000 }),
                    }),
                }),
            );
        });
    });

    // ──────────────────────────────────────────────────────────────
    // onModuleDestroy
    // ──────────────────────────────────────────────────────────────

    describe('onModuleDestroy', () => {
        it('should clear the refresh interval', async () => {
            // arrange
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();

            // act
            client.onModuleDestroy();

            // assert — no error thrown, interval cleaned up
            // Advance timers to verify no background refresh happens after destroy
            mockRefresh.mockClear();
            await vi.advanceTimersByTimeAsync(60_000);
            expect(mockRefresh).not.toHaveBeenCalled();
        });

        it('should handle being called before initialization', () => {
            // arrange
            const configService = createMockConfigService();
            client = new AzureFeatureFlagReader(configService as never);

            // act & assert — no error thrown
            expect(() => client.onModuleDestroy()).not.toThrow();
        });
    });

    // ──────────────────────────────────────────────────────────────
    // isEnabled
    // ──────────────────────────────────────────────────────────────

    describe('isEnabled', () => {
        beforeEach(async () => {
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return true when the feature flag is enabled', async () => {
            // arrange
            mockFeatureManagerIsEnabled.mockResolvedValue(true);

            // act
            const result = await client.isEnabled('dark-mode');

            // assert
            expect(result).toBe(true);
            expect(mockFeatureManagerIsEnabled).toHaveBeenCalledWith('dark-mode');
        });

        it('should return false when the feature flag is disabled', async () => {
            // arrange
            mockFeatureManagerIsEnabled.mockResolvedValue(false);

            // act
            const result = await client.isEnabled('beta-feature');

            // assert
            expect(result).toBe(false);
        });

        it('should throw FeatureFlagError when evaluation fails', async () => {
            // arrange
            mockFeatureManagerIsEnabled.mockRejectedValue(new Error('eval error'));

            // act & assert
            await expect(client.isEnabled('broken-flag')).rejects.toThrow(FeatureFlagError);
            await expect(client.isEnabled('broken-flag')).rejects.toThrow('Failed to evaluate feature flag "broken-flag"');
        });
    });

    describe('isEnabled before initialization', () => {
        it('should throw FeatureFlagError when called before onModuleInit', async () => {
            // arrange
            const configService = createMockConfigService();
            client = new AzureFeatureFlagReader(configService as never);

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
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return the variant value when found', async () => {
            // arrange
            mockFeatureManagerGetVariant.mockResolvedValue({
                configuration: 'enterprise',
            });

            // act
            const result = await client.getVariant('pricing-tier', 'free');

            // assert
            expect(result).toBe('enterprise');
        });

        it('should return the default value when no variant is found', async () => {
            // arrange
            mockFeatureManagerGetVariant.mockResolvedValue(undefined);

            // act
            const result = await client.getVariant('pricing-tier', 'free');

            // assert
            expect(result).toBe('free');
        });

        it('should return the default value when variant has no configuration value', async () => {
            // arrange
            mockFeatureManagerGetVariant.mockResolvedValue({
                configuration: undefined,
            });

            // act
            const result = await client.getVariant('pricing-tier', 'basic');

            // assert
            expect(result).toBe('basic');
        });

        it('should throw FeatureFlagError when variant evaluation fails', async () => {
            // arrange
            mockFeatureManagerGetVariant.mockRejectedValue(new Error('variant error'));

            // act & assert
            await expect(client.getVariant('broken', 'default')).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // getAllFlags
    // ──────────────────────────────────────────────────────────────

    describe('getAllFlags', () => {
        beforeEach(async () => {
            const fakeAppConfig = new Map<string, unknown>([
                ['.appconfig.featureflag/dark-mode', '{}'],
                ['.appconfig.featureflag/beta', '{}'],
                ['regular.setting', 'value'],
            ]);
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return only feature flag entries', async () => {
            // arrange
            mockFeatureManagerIsEnabled.mockImplementation((name: string) => Promise.resolve(name === 'dark-mode'));

            // act
            const result = await client.getAllFlags();

            // assert
            expect(result).toHaveLength(2);
            expect(result).toEqual([
                { key: 'dark-mode', enabled: true },
                { key: 'beta', enabled: false },
            ]);
        });

        it('should throw FeatureFlagError when retrieval fails', async () => {
            // arrange
            mockFeatureManagerIsEnabled.mockRejectedValue(new Error('list error'));

            // act & assert
            await expect(client.getAllFlags()).rejects.toThrow(FeatureFlagError);
            await expect(client.getAllFlags()).rejects.toThrow('Failed to retrieve all feature flags');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // refresh
    // ──────────────────────────────────────────────────────────────

    describe('refresh', () => {
        beforeEach(async () => {
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should call refresh on the app config', async () => {
            // arrange
            mockRefresh.mockResolvedValue(undefined);

            // act
            await client.refresh();

            // assert
            expect(mockRefresh).toHaveBeenCalled();
        });

        it('should throw FeatureFlagError when refresh fails', async () => {
            // arrange
            mockRefresh.mockRejectedValue(new Error('refresh failed'));

            // act & assert
            await expect(client.refresh()).rejects.toThrow(FeatureFlagError);
            await expect(client.refresh()).rejects.toThrow('Failed to refresh feature flags');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // ping
    // ──────────────────────────────────────────────────────────────

    describe('ping', () => {
        beforeEach(async () => {
            const fakeAppConfig = new Map<string, unknown>();
            Object.assign(fakeAppConfig, { refresh: mockRefresh });
            mockLoad.mockResolvedValue(fakeAppConfig);

            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'conn-string',
            });

            client = new AzureFeatureFlagReader(configService as never);
            await client.onModuleInit();
        });

        it('should return true when refresh succeeds', async () => {
            // arrange
            mockRefresh.mockResolvedValue(undefined);

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(true);
        });

        it('should return false when refresh fails', async () => {
            // arrange
            mockRefresh.mockRejectedValue(new Error('connection lost'));

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});
