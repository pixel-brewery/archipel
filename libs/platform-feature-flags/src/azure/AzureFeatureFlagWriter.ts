// #region Imports

import { AppConfigurationClient, featureFlagContentType, featureFlagPrefix, isFeatureFlag, parseFeatureFlag } from '@azure/app-configuration';
import { DefaultAzureCredential } from '@azure/identity';
import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { FeatureFlagWriterBase } from '../abstracts/FeatureFlagWriterBase.js';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';
import { AZURE_APPCONFIG_CONNECTION_STRING, AZURE_APPCONFIG_ENDPOINT } from './env.js';

// #endregion

/**
 * Azure App Configuration implementation of the {@link FeatureFlagWriterBase}.
 * Uses `@azure/app-configuration` (`AppConfigurationClient`) for CRUD operations
 * on feature flags stored in Azure App Configuration.
 *
 * @public
 */
@Injectable()
export class AzureFeatureFlagWriter extends FeatureFlagWriterBase implements OnModuleInit {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(AzureFeatureFlagWriter.name);
    private _client: AppConfigurationClient | undefined;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Azure App Configuration management client.
     *
     * @public
     */
    public async onModuleInit(): Promise<void> {
        try {
            const endpoint = this._configService.get<string>(AZURE_APPCONFIG_ENDPOINT.key);
            const connectionString = this._configService.get<string>(AZURE_APPCONFIG_CONNECTION_STRING.key);

            if (!endpoint && !connectionString) {
                throw new FeatureFlagError('azure', 'Either AZURE_APPCONFIG_ENDPOINT or AZURE_APPCONFIG_CONNECTION_STRING must be configured.');
            }

            if (endpoint) {
                this._client = new AppConfigurationClient(endpoint, new DefaultAzureCredential());
            } else {
                this._client = new AppConfigurationClient(connectionString!);
            }

            this._logger.log('[AzureFeatureFlagWriter] Initialized successfully');
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }
            throw new FeatureFlagError('azure', 'Failed to initialize Azure App Configuration admin client', error);
        }
    }

    /** @inheritdoc */
    public async getFlag(key: string): Promise<IFeatureFlagDefinition | undefined> {
        this.ensureInitialized();

        try {
            const setting = await this._client!.getConfigurationSetting({
                key: `${featureFlagPrefix}${key}`,
            });

            if (!isFeatureFlag(setting)) {
                return undefined;
            }

            const parsed = parseFeatureFlag(setting);

            return {
                key,
                enabled: parsed.value.enabled,
                description: parsed.value.description,
                label: parsed.label,
            };
        } catch (error: unknown) {
            if (this.isNotFoundError(error)) {
                return undefined;
            }

            this._logger.error(`[AzureFeatureFlagWriter] getFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to get feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async listFlags(): Promise<ReadonlyArray<IFeatureFlagDefinition>> {
        this.ensureInitialized();

        try {
            const flags: Array<IFeatureFlagDefinition> = [];
            const settings = this._client!.listConfigurationSettings({
                keyFilter: `${featureFlagPrefix}*`,
            });

            for await (const setting of settings) {
                if (!isFeatureFlag(setting)) {
                    continue;
                }

                const parsed = parseFeatureFlag(setting);
                const key = setting.key.replace(featureFlagPrefix, '');

                flags.push({
                    key,
                    enabled: parsed.value.enabled,
                    description: parsed.value.description,
                    label: parsed.label,
                });
            }

            return flags;
        } catch (error: unknown) {
            this._logger.error('[AzureFeatureFlagWriter] listFlags failed', {
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', 'Failed to list feature flags', error);
        }
    }

    /** @inheritdoc */
    public async createFlag(definition: IFeatureFlagDefinition): Promise<void> {
        this.ensureInitialized();

        try {
            await this._client!.addConfigurationSetting({
                key: `${featureFlagPrefix}${definition.key}`,
                contentType: featureFlagContentType,
                label: definition.label,
                value: JSON.stringify({
                    id: definition.key,
                    enabled: definition.enabled,
                    description: definition.description ?? '',
                    conditions: { client_filters: [] },
                }),
            });

            this._logger.log(`[AzureFeatureFlagWriter] Created flag "${definition.key}"`);
        } catch (error: unknown) {
            this._logger.error(`[AzureFeatureFlagWriter] createFlag failed for "${definition.key}"`, {
                key: definition.key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to create feature flag "${definition.key}"`, error);
        }
    }

    /** @inheritdoc */
    public async updateFlag(key: string, updates: Partial<Omit<IFeatureFlagDefinition, 'key'>>): Promise<void> {
        this.ensureInitialized();

        try {
            const settingKey = `${featureFlagPrefix}${key}`;
            const existing = await this._client!.getConfigurationSetting({ key: settingKey });

            if (!isFeatureFlag(existing)) {
                throw new FeatureFlagError('azure', `Configuration setting "${key}" is not a feature flag.`);
            }

            const parsed = parseFeatureFlag(existing);
            const updatedValue = {
                id: key,
                enabled: updates.enabled ?? parsed.value.enabled,
                description: updates.description ?? parsed.value.description ?? '',
                conditions: parsed.value.conditions ?? { client_filters: [] },
            };

            await this._client!.setConfigurationSetting({
                key: settingKey,
                contentType: featureFlagContentType,
                label: updates.label ?? existing.label,
                value: JSON.stringify(updatedValue),
            });

            this._logger.log(`[AzureFeatureFlagWriter] Updated flag "${key}"`);
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error(`[AzureFeatureFlagWriter] updateFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to update feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async deleteFlag(key: string): Promise<void> {
        this.ensureInitialized();

        try {
            await this._client!.deleteConfigurationSetting({
                key: `${featureFlagPrefix}${key}`,
            });

            this._logger.log(`[AzureFeatureFlagWriter] Deleted flag "${key}"`);
        } catch (error: unknown) {
            this._logger.error(`[AzureFeatureFlagWriter] deleteFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('azure', `Failed to delete feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public override async ping(): Promise<boolean> {
        try {
            this.ensureInitialized();

            const iterator = this._client!.listConfigurationSettings({ keyFilter: `${featureFlagPrefix}*` });
            // Perform a minimal read to verify connectivity.
            await iterator.next();

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Checks whether the error is a 404 (resource not found).
     */
    private isNotFoundError(error: unknown): boolean {
        return typeof error === 'object' && error !== null && 'statusCode' in error && (error as { statusCode: number }).statusCode === 404;
    }

    /**
     * Ensures the management client has been initialized.
     */
    private ensureInitialized(): void {
        if (!this._client) {
            throw new FeatureFlagError('azure', 'AzureFeatureFlagWriter has not been initialized. Ensure onModuleInit() ran.');
        }
    }

    // #endregion
}
