// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { FeatureFlagWriterBase } from '../abstracts/FeatureFlagWriterBase.js';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';
import { VERCEL_API_TOKEN, VERCEL_EDGE_CONFIG_ID, VERCEL_FEATURE_FLAG_PREFIX, VERCEL_TEAM_ID } from './env.js';

// #endregion

/** Base URL for the Vercel REST API. */
const VERCEL_API_BASE = 'https://api.vercel.com';

/** Default prefix for feature flag keys in Edge Config. */
const DEFAULT_FLAG_PREFIX = 'featureFlags';

/** Default request timeout in milliseconds. */
const DEFAULT_TIMEOUT_MS = 3_000;

/**
 * Vercel Edge Config implementation of the {@link FeatureFlagWriterBase}.
 * Uses the Vercel REST API to manage feature flags stored in a Vercel Edge Config store.
 *
 * @remarks
 * The Vercel admin client stores feature flags as a single object under the configured
 * prefix key (default: `featureFlags`). Each flag key maps to a {@link IFeatureFlagDefinition}
 * serialized as JSON.
 *
 * @public
 */
@Injectable()
export class VercelFeatureFlagWriter extends FeatureFlagWriterBase implements OnModuleInit {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(VercelFeatureFlagWriter.name);
    private _apiToken: string | undefined;
    private _edgeConfigId: string | undefined;
    private _teamId: string | undefined;
    private _flagPrefix: string = DEFAULT_FLAG_PREFIX;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService) {
        super();
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Initializes the Vercel admin client by reading configuration.
     *
     * @public
     */
    public async onModuleInit(): Promise<void> {
        try {
            this._apiToken = this._configService.get<string>(VERCEL_API_TOKEN.key);
            this._edgeConfigId = this._configService.get<string>(VERCEL_EDGE_CONFIG_ID.key);
            this._teamId = this._configService.get<string>(VERCEL_TEAM_ID.key);
            this._flagPrefix = this._configService.get<string>(VERCEL_FEATURE_FLAG_PREFIX.key) ?? DEFAULT_FLAG_PREFIX;

            if (!this._apiToken) {
                throw new FeatureFlagError('vercel', 'VERCEL_API_TOKEN must be configured for the Vercel admin client.');
            }

            if (!this._edgeConfigId) {
                throw new FeatureFlagError('vercel', 'VERCEL_EDGE_CONFIG_ID must be configured for the Vercel admin client.');
            }

            this._logger.log('[VercelFeatureFlagWriter] Initialized successfully');
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }
            throw new FeatureFlagError('vercel', 'Failed to initialize Vercel admin client', error);
        }
    }

    /** @inheritdoc */
    public async getFlag(key: string): Promise<IFeatureFlagDefinition | undefined> {
        this.ensureInitialized();

        try {
            const flags = await this.readFlagsFromEdgeConfig();

            if (!flags || !(key in flags)) {
                return undefined;
            }

            return this.toDefinition(key, flags[key]);
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error(`[VercelFeatureFlagWriter] getFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to get feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async listFlags(): Promise<ReadonlyArray<IFeatureFlagDefinition>> {
        this.ensureInitialized();

        try {
            const flags = await this.readFlagsFromEdgeConfig();

            if (!flags) {
                return [];
            }

            return Object.entries(flags).map(([key, value]) => this.toDefinition(key, value));
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error('[VercelFeatureFlagWriter] listFlags failed', {
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', 'Failed to list feature flags', error);
        }
    }

    /** @inheritdoc */
    public async createFlag(definition: IFeatureFlagDefinition): Promise<void> {
        this.ensureInitialized();

        try {
            const flags = (await this.readFlagsFromEdgeConfig()) ?? {};

            if (definition.key in flags) {
                throw new FeatureFlagError('vercel', `Feature flag "${definition.key}" already exists.`);
            }

            flags[definition.key] = this.toStoredValue(definition);
            await this.writeFlagsToEdgeConfig(flags);

            this._logger.log(`[VercelFeatureFlagWriter] Created flag "${definition.key}"`);
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error(`[VercelFeatureFlagWriter] createFlag failed for "${definition.key}"`, {
                key: definition.key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to create feature flag "${definition.key}"`, error);
        }
    }

    /** @inheritdoc */
    public async updateFlag(key: string, updates: Partial<Omit<IFeatureFlagDefinition, 'key'>>): Promise<void> {
        this.ensureInitialized();

        try {
            const flags = (await this.readFlagsFromEdgeConfig()) ?? {};

            if (!(key in flags)) {
                throw new FeatureFlagError('vercel', `Feature flag "${key}" does not exist.`);
            }

            const existing = this.toDefinition(key, flags[key]);
            const updated: IFeatureFlagDefinition = {
                key,
                enabled: updates.enabled ?? existing.enabled,
                description: updates.description ?? existing.description,
                label: updates.label ?? existing.label,
                variant: updates.variant ?? existing.variant,
            };

            flags[key] = this.toStoredValue(updated);
            await this.writeFlagsToEdgeConfig(flags);

            this._logger.log(`[VercelFeatureFlagWriter] Updated flag "${key}"`);
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error(`[VercelFeatureFlagWriter] updateFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to update feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async deleteFlag(key: string): Promise<void> {
        this.ensureInitialized();

        try {
            const flags = (await this.readFlagsFromEdgeConfig()) ?? {};

            if (!(key in flags)) {
                throw new FeatureFlagError('vercel', `Feature flag "${key}" does not exist.`);
            }

            delete flags[key];
            await this.writeFlagsToEdgeConfig(flags);

            this._logger.log(`[VercelFeatureFlagWriter] Deleted flag "${key}"`);
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }

            this._logger.error(`[VercelFeatureFlagWriter] deleteFlag failed for "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to delete feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public override async ping(): Promise<boolean> {
        try {
            this.ensureInitialized();
            await this.readFlagsFromEdgeConfig();

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Reads the current flags object from Edge Config via the Vercel REST API.
     */
    private async readFlagsFromEdgeConfig(): Promise<Record<string, unknown> | undefined> {
        const url = this.buildUrl(`/v1/edge-config/${this._edgeConfigId!}/item/${this._flagPrefix}`);
        const response = await this.request(url, 'GET');

        if (response.status === 404) {
            return undefined;
        }

        if (!response.ok) {
            throw new FeatureFlagError('vercel', `Failed to read Edge Config (HTTP ${response.status}): ${await response.text()}`);
        }

        const body = (await response.json()) as { value?: unknown };

        return (body.value as Record<string, unknown>) ?? undefined;
    }

    /**
     * Writes the flags object to Edge Config via the Vercel REST API.
     */
    private async writeFlagsToEdgeConfig(flags: Record<string, unknown>): Promise<void> {
        const url = this.buildUrl(`/v1/edge-config/${this._edgeConfigId!}/items`);
        const response = await this.request(url, 'PATCH', {
            items: [
                {
                    operation: 'upsert',
                    key: this._flagPrefix,
                    value: flags,
                },
            ],
        });

        if (!response.ok) {
            throw new FeatureFlagError('vercel', `Failed to write Edge Config (HTTP ${response.status}): ${await response.text()}`);
        }
    }

    /**
     * Builds a full Vercel API URL, appending the team ID query parameter if configured.
     */
    private buildUrl(path: string): string {
        const url = new URL(path, VERCEL_API_BASE);

        if (this._teamId) {
            url.searchParams.set('teamId', this._teamId);
        }

        return url.toString();
    }

    /**
     * Performs an HTTP request to the Vercel REST API with timeout and authorization.
     */
    private async request(url: string, method: string, body?: unknown): Promise<Response> {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

        try {
            return await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${this._apiToken!}`,
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }
    }

    /**
     * Converts a stored value into an {@link IFeatureFlagDefinition}.
     */
    private toDefinition(key: string, value: unknown): IFeatureFlagDefinition {
        if (typeof value === 'boolean') {
            return { key, enabled: value };
        }

        if (typeof value === 'object' && value !== null) {
            const obj = value as Record<string, unknown>;

            return {
                key,
                enabled: Boolean(obj['enabled'] ?? true),
                description: typeof obj['description'] === 'string' ? obj['description'] : undefined,
                label: typeof obj['label'] === 'string' ? obj['label'] : undefined,
                variant: obj['variant'],
            };
        }

        return { key, enabled: Boolean(value) };
    }

    /**
     * Converts an {@link IFeatureFlagDefinition} into the stored value shape.
     * Simple boolean flags are stored as booleans; flags with metadata are stored as objects.
     */
    private toStoredValue(definition: IFeatureFlagDefinition): unknown {
        if (!definition.description && !definition.label && definition.variant === undefined) {
            return definition.enabled;
        }

        return {
            enabled: definition.enabled,
            description: definition.description,
            label: definition.label,
            variant: definition.variant,
        };
    }

    /**
     * Ensures the admin client has been initialized.
     */
    private ensureInitialized(): void {
        if (!this._apiToken || !this._edgeConfigId) {
            throw new FeatureFlagError('vercel', 'VercelFeatureFlagWriter has not been initialized. Ensure onModuleInit() ran.');
        }
    }

    // #endregion
}
