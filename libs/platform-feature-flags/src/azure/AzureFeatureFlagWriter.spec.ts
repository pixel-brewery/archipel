import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';
import { AzureFeatureFlagWriter } from './AzureFeatureFlagWriter.js';
import { AZURE_APPCONFIG_CONNECTION_STRING, AZURE_APPCONFIG_ENDPOINT } from './env.js';

// ──────────────────────────────────────────────────────────────
// Mocks
// ──────────────────────────────────────────────────────────────

const mockGetConfigurationSetting = vi.fn();
const mockSetConfigurationSetting = vi.fn();
const mockAddConfigurationSetting = vi.fn();
const mockDeleteConfigurationSetting = vi.fn();
const mockListConfigurationSettings = vi.fn();

vi.mock('@azure/app-configuration', () => ({
    AppConfigurationClient: class {
        public getConfigurationSetting = mockGetConfigurationSetting;
        public setConfigurationSetting = mockSetConfigurationSetting;
        public addConfigurationSetting = mockAddConfigurationSetting;
        public deleteConfigurationSetting = mockDeleteConfigurationSetting;
        public listConfigurationSettings = mockListConfigurationSettings;
    },
    featureFlagPrefix: '.appconfig.featureflag/',
    featureFlagContentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
    isFeatureFlag: vi.fn((setting: Record<string, unknown>) => setting['contentType'] === 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8'),
    parseFeatureFlag: vi.fn((setting: Record<string, unknown>) => ({
        ...setting,
        value: JSON.parse(setting['value'] as string),
    })),
}));

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

describe('AzureFeatureFlagWriter', () => {
    // #region Fields

    let client: AzureFeatureFlagWriter;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    // ──────────────────────────────────────────────────────────────
    // onModuleInit
    // ──────────────────────────────────────────────────────────────

    describe('onModuleInit', () => {
        it('should initialize with connection string', async () => {
            // arrange
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_ENDPOINT.key]: undefined,
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });

            client = new AzureFeatureFlagWriter(configService as never);

            // act
            await client.onModuleInit();

            // assert — no error means success
            expect(configService.get).toHaveBeenCalledWith(AZURE_APPCONFIG_ENDPOINT.key);
        });

        it('should initialize with endpoint and DefaultAzureCredential', async () => {
            // arrange
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_ENDPOINT.key]: 'https://myconfig.azconfig.io',
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: undefined,
            });

            client = new AzureFeatureFlagWriter(configService as never);

            // act
            await client.onModuleInit();

            // assert
            expect(configService.get).toHaveBeenCalledWith(AZURE_APPCONFIG_ENDPOINT.key);
        });

        it('should throw FeatureFlagError when neither endpoint nor connection string is configured', async () => {
            // arrange
            const configService = createMockConfigService({});

            client = new AzureFeatureFlagWriter(configService as never);

            // act & assert
            await expect(client.onModuleInit()).rejects.toThrow(FeatureFlagError);
            await expect(client.onModuleInit()).rejects.toThrow('Either AZURE_APPCONFIG_ENDPOINT or AZURE_APPCONFIG_CONNECTION_STRING must be configured.');
        });
    });

    // ──────────────────────────────────────────────────────────────
    // getFlag
    // ──────────────────────────────────────────────────────────────

    describe('getFlag', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should return a flag definition when the flag exists', async () => {
            // arrange
            mockGetConfigurationSetting.mockResolvedValue({
                key: '.appconfig.featureflag/dark-mode',
                contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
                label: 'production',
                value: JSON.stringify({
                    id: 'dark-mode',
                    enabled: true,
                    description: 'Dark mode toggle',
                    conditions: { client_filters: [] },
                }),
            });

            // act
            const result = await client.getFlag('dark-mode');

            // assert
            expect(result).toEqual({
                key: 'dark-mode',
                enabled: true,
                description: 'Dark mode toggle',
                label: 'production',
            });
        });

        it('should return undefined when the flag does not exist (404)', async () => {
            // arrange
            mockGetConfigurationSetting.mockRejectedValue({ statusCode: 404 });

            // act
            const result = await client.getFlag('nonexistent');

            // assert
            expect(result).toBeUndefined();
        });

        it('should throw FeatureFlagError on unexpected errors', async () => {
            // arrange
            mockGetConfigurationSetting.mockRejectedValue(new Error('Network failure'));

            // act & assert
            await expect(client.getFlag('broken')).rejects.toThrow(FeatureFlagError);
        });

        it('should throw FeatureFlagError when not initialized', async () => {
            // arrange
            const uninitializedClient = new AzureFeatureFlagWriter({
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
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should return all feature flags', async () => {
            // arrange
            const settings = [
                {
                    key: '.appconfig.featureflag/dark-mode',
                    contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
                    value: JSON.stringify({
                        id: 'dark-mode',
                        enabled: true,
                        description: '',
                        conditions: { client_filters: [] },
                    }),
                },
                {
                    key: '.appconfig.featureflag/beta-feature',
                    contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
                    value: JSON.stringify({
                        id: 'beta-feature',
                        enabled: false,
                        description: 'Beta',
                        conditions: { client_filters: [] },
                    }),
                },
            ];

            mockListConfigurationSettings.mockReturnValue(
                (async function* () {
                    for (const s of settings) {
                        yield s;
                    }
                })(),
            );

            // act
            const result = await client.listFlags();

            // assert
            expect(result).toHaveLength(2);
            expect(result[0]?.key).toBe('dark-mode');
            expect(result[1]?.key).toBe('beta-feature');
        });

        it('should return empty array when no flags exist', async () => {
            // arrange
            mockListConfigurationSettings.mockReturnValue(
                (async function* () {
                    // empty
                })(),
            );

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
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should create a feature flag', async () => {
            // arrange
            const definition: IFeatureFlagDefinition = {
                key: 'new-feature',
                enabled: true,
                description: 'A new feature',
            };

            mockAddConfigurationSetting.mockResolvedValue({});

            // act
            await client.createFlag(definition);

            // assert
            expect(mockAddConfigurationSetting).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: '.appconfig.featureflag/new-feature',
                    contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
                }),
            );
        });

        it('should throw FeatureFlagError on failure', async () => {
            // arrange
            mockAddConfigurationSetting.mockRejectedValue(new Error('Conflict'));

            // act & assert
            await expect(client.createFlag({ key: 'dup', enabled: true })).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // updateFlag
    // ──────────────────────────────────────────────────────────────

    describe('updateFlag', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should update an existing flag', async () => {
            // arrange
            mockGetConfigurationSetting.mockResolvedValue({
                key: '.appconfig.featureflag/my-flag',
                contentType: 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8',
                value: JSON.stringify({
                    id: 'my-flag',
                    enabled: false,
                    description: 'Old description',
                    conditions: { client_filters: [] },
                }),
            });
            mockSetConfigurationSetting.mockResolvedValue({});

            // act
            await client.updateFlag('my-flag', { enabled: true, description: 'Updated' });

            // assert
            expect(mockSetConfigurationSetting).toHaveBeenCalledWith(
                expect.objectContaining({
                    key: '.appconfig.featureflag/my-flag',
                }),
            );

            const callArg = mockSetConfigurationSetting.mock.calls[0]?.[0] as { value: string };
            const parsed = JSON.parse(callArg.value) as { enabled: boolean; description: string };
            expect(parsed.enabled).toBe(true);
            expect(parsed.description).toBe('Updated');
        });

        it('should throw FeatureFlagError when flag does not exist', async () => {
            // arrange
            mockGetConfigurationSetting.mockRejectedValue(new Error('Not found'));

            // act & assert
            await expect(client.updateFlag('missing', { enabled: true })).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // deleteFlag
    // ──────────────────────────────────────────────────────────────

    describe('deleteFlag', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should delete a feature flag', async () => {
            // arrange
            mockDeleteConfigurationSetting.mockResolvedValue({});

            // act
            await client.deleteFlag('old-feature');

            // assert
            expect(mockDeleteConfigurationSetting).toHaveBeenCalledWith({
                key: '.appconfig.featureflag/old-feature',
            });
        });

        it('should throw FeatureFlagError on failure', async () => {
            // arrange
            mockDeleteConfigurationSetting.mockRejectedValue(new Error('Forbidden'));

            // act & assert
            await expect(client.deleteFlag('protected')).rejects.toThrow(FeatureFlagError);
        });
    });

    // ──────────────────────────────────────────────────────────────
    // ping
    // ──────────────────────────────────────────────────────────────

    describe('ping', () => {
        beforeEach(async () => {
            const configService = createMockConfigService({
                [AZURE_APPCONFIG_CONNECTION_STRING.key]: 'Endpoint=https://test.azconfig.io;Id=abc;Secret=xyz',
            });
            client = new AzureFeatureFlagWriter(configService as never);
            await client.onModuleInit();
        });

        it('should return true when reachable', async () => {
            // arrange
            mockListConfigurationSettings.mockReturnValue({
                next: vi.fn().mockResolvedValue({ done: true }),
            });

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(true);
        });

        it('should return false when unreachable', async () => {
            // arrange
            mockListConfigurationSettings.mockReturnValue({
                next: vi.fn().mockRejectedValue(new Error('Timeout')),
            });

            // act
            const result = await client.ping();

            // assert
            expect(result).toBe(false);
        });
    });

    // #endregion
});
