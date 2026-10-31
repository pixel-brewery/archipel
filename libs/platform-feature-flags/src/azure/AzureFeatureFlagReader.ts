// #region Imports

import type { AzureAppConfiguration } from '@azure/app-configuration-provider';
import { load } from '@azure/app-configuration-provider';
import { DefaultAzureCredential } from '@azure/identity';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { ConfigurationMapFeatureFlagProvider, FeatureManager } from '@microsoft/feature-management';
import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { FeatureFlagReaderBase } from '../abstracts/FeatureFlagReaderBase.js';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagContext } from '../models/IFeatureFlagContext.js';
import type { IFeatureFlagEvaluation } from '../models/IFeatureFlagEvaluation.js';
import { AZURE_APPCONFIG_CONNECTION_STRING, AZURE_APPCONFIG_ENDPOINT, AZURE_FEATURE_FLAG_KEY_FILTER, AZURE_FEATURE_FLAG_REFRESH_INTERVAL } from './env.js';

// #endregion

/** Default refresh interval in milliseconds. */
const DEFAULT_REFRESH_INTERVAL = 30_000;

/** Default key filter for feature flags. */
const DEFAULT_KEY_FILTER = '*';

/**
 * Azure App Configuration implementation of the {@link FeatureFlagReaderBase}.
 * Uses `@azure/app-configuration-provider` for connecting to Azure App Configuration
 * and `@microsoft/feature-management` for evaluating feature flags.
 *
 * @public
 */
@Injectable()
export class AzureFeatureFlagReader extends FeatureFlagReaderBase implements OnModuleInit, OnModuleDestroy {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(AzureFeatureFlagReader.name);
    private _appConfig: AzureAppConfiguration | undefined;
    private _featureManager: FeatureManager | undefined;
    private _refreshInterval: ReturnType<typeof setInterval> | undefined;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Azure App Configuration connection and feature manager.
     *
     * @public
     */
    public async onModuleInit(): Promise<void> {
        try {
            const endpoint = this._configService.get<string>(AZURE_APPCONFIG_ENDPOINT.key);
            const connectionString = this._configService.get<string>(AZURE_APPCONFIG_CONNECTION_STRING.key);
            const refreshIntervalInMs = this._configService.get<number>(AZURE_FEATURE_FLAG_REFRESH_INTERVAL.key) ?? DEFAULT_REFRESH_INTERVAL;
            const keyFilter = this._configService.get<string>(AZURE_FEATURE_FLAG_KEY_FILTER.key) ?? DEFAULT_KEY_FILTER;

            if (!endpoint && !connectionString) {
                throw new FeatureFlagError('azure', 'Either AZURE_APPCONFIG_ENDPOINT or AZURE_APPCONFIG_CONNECTION_STRING must be configured.');
            }

            const featureFlagOptions = {
                enabled: true,
                selectors: [{ keyFilter }],
                refresh: {
                    enabled: true,
                    refreshIntervalInMs,
                },
            };

            let appConfig: AzureAppConfiguration;

            if (endpoint) {
                const credential = new DefaultAzureCredential();
                appConfig = await load(endpoint, credential, { featureFlagOptions });
            } else {
                appConfig = await load(connectionString!, { featureFlagOptions });
            }

            this._appConfig = appConfig;
            this._featureManager = new FeatureManager(new ConfigurationMapFeatureFlagProvider(appConfig));

            this._refreshInterval = setInterval(async () => {
                try {
                    await this.refresh();
                } catch (error: unknown) {
                    this._logger.warn('[AzureFeatureFlagReader] Background refresh failed', {
                        error: (error as Error).message,
                    });
                }
            }, refreshIntervalInMs);

            this._logger.log('[AzureFeatureFlagReader] Initialized successfully');
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }
            throw new FeatureFlagError('azure', 'Failed to initialize Azure App Configuration', error);
        }
    }

    /**
     * Cleans up the refresh interval on module destruction.
     *
     * @public
     */
    public onModuleDestroy(): void {
        if (this._refreshInterval) {
            clearInterval(this._refreshInterval);
            this._refreshInterval = undefined;
        }
    }

    /** @inheritdoc */
    public async isEnabled(key: string, _context?: IFeatureFlagContext): Promise<boolean> {
        this.ensureInitialized();

        try {
            return await this._featureManager!.isEnabled(key);
        } catch (error: unknown) {
            this._logger.error(`[AzureFeatureFlagReader] isEnabled failed for flag "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to evaluate feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async getVariant<T = unknown>(key: string, defaultValue: T, _context?: IFeatureFlagContext): Promise<T> {
        this.ensureInitialized();

        try {
            const variant = await this._featureManager!.getVariant(key);

            if (!variant) {
                return defaultValue;
            }

            return (variant.configuration as T) ?? defaultValue;
        } catch (error: unknown) {
            this._logger.error(`[AzureFeatureFlagReader] getVariant failed for flag "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to get variant for feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async getAllFlags(_context?: IFeatureFlagContext): Promise<ReadonlyArray<IFeatureFlagEvaluation>> {
        this.ensureInitialized();

        try {
            const flags: Array<IFeatureFlagEvaluation> = [];

            for (const [rawKey] of this._appConfig!) {
                if (!rawKey.startsWith('.appconfig.featureflag/')) {
                    continue;
                }

                const key = rawKey.replace('.appconfig.featureflag/', '');
                const enabled = await this._featureManager!.isEnabled(key);
                flags.push({ key, enabled });
            }

            return flags;
        } catch (error: unknown) {
            this._logger.error('[AzureFeatureFlagReader] getAllFlags failed', {
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', 'Failed to retrieve all feature flags', error);
        }
    }

    /** @inheritdoc */
    public async refresh(): Promise<void> {
        this.ensureInitialized();

        try {
            await this._appConfig!.refresh();
        } catch (error: unknown) {
            this._logger.error('[AzureFeatureFlagReader] refresh failed', {
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', 'Failed to refresh feature flags from Azure App Configuration', error);
        }
    }

    /** @inheritdoc */
    public override async ping(): Promise<boolean> {
        try {
            await this.refresh();

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Ensures the feature manager and app config have been initialized.
     */
    private ensureInitialized(): void {
        if (!this._featureManager || !this._appConfig) {
            throw new FeatureFlagError('azure', 'AzureFeatureFlagReader has not been initialized. Ensure onModuleInit() ran.');
        }
    }

    // #endregion
}
