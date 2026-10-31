// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import type { EdgeConfigClient } from '@vercel/edge-config';
import { createClient } from '@vercel/edge-config';
import { FeatureFlagReaderBase } from '../abstracts/FeatureFlagReaderBase.js';
import { FeatureFlagError } from '../errors/FeatureFlagError.js';
import type { IFeatureFlagContext } from '../models/IFeatureFlagContext.js';
import type { IFeatureFlagEvaluation } from '../models/IFeatureFlagEvaluation.js';
import { VERCEL_EDGE_CONFIG, VERCEL_FEATURE_FLAG_PREFIX } from './env.js';

// #endregion

/** Default prefix for feature flag keys in Edge Config. */
const DEFAULT_FLAG_PREFIX = 'featureFlags';

/**
 * Vercel Edge Config implementation of the {@link FeatureFlagReaderBase}.
 * Uses `@vercel/edge-config` for reading feature flag state from a Vercel Edge Config store.
 *
 * Feature flags are expected to be stored as a single object in Edge Config
 * under the configured prefix key (default: `featureFlags`). The object maps
 * flag keys to their values (boolean for simple on/off, or any value for variants).
 *
 * @example
 * Edge Config structure:
 * ```json
 * {
 *   "featureFlags": {
 *     "new-checkout-flow": true,
 *     "pricing-tier": "enterprise",
 *     "max-upload-size": 100
 *   }
 * }
 * ```
 *
 * @public
 */
@Injectable()
export class VercelFeatureFlagReader extends FeatureFlagReaderBase implements OnModuleInit {
    // #region Fields

    private readonly _configService: ConfigService;
    private readonly _logger: Logger = new Logger(VercelFeatureFlagReader.name);
    private _edgeConfigClient: EdgeConfigClient | undefined;
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
     * Initializes the Vercel Edge Config client.
     *
     * @public
     */
    public async onModuleInit(): Promise<void> {
        try {
            const connectionString = this._configService.get<string>(VERCEL_EDGE_CONFIG.key);

            if (!connectionString) {
                throw new FeatureFlagError('vercel', 'EDGE_CONFIG must be configured for the Vercel feature flag provider.');
            }

            this._edgeConfigClient = createClient(connectionString);
            this._flagPrefix = this._configService.get<string>(VERCEL_FEATURE_FLAG_PREFIX.key) ?? DEFAULT_FLAG_PREFIX;

            this._logger.log('[VercelFeatureFlagReader] Initialized successfully');
        } catch (error: unknown) {
            if (error instanceof FeatureFlagError) {
                throw error;
            }
            throw new FeatureFlagError('vercel', 'Failed to initialize Vercel Edge Config client', error);
        }
    }

    /** @inheritdoc */
    public async isEnabled(key: string, _context?: IFeatureFlagContext): Promise<boolean> {
        this.ensureInitialized();

        try {
            const flags = await this._edgeConfigClient!.get<Record<string, unknown>>(this._flagPrefix);

            if (!flags || !(key in flags)) {
                return false;
            }

            return Boolean(flags[key]);
        } catch (error: unknown) {
            this._logger.error(`[VercelFeatureFlagReader] isEnabled failed for flag "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to evaluate feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async getVariant<T = unknown>(key: string, defaultValue: T, _context?: IFeatureFlagContext): Promise<T> {
        this.ensureInitialized();

        try {
            const flags = await this._edgeConfigClient!.get<Record<string, unknown>>(this._flagPrefix);

            if (!flags || !(key in flags)) {
                return defaultValue;
            }

            return (flags[key] as T) ?? defaultValue;
        } catch (error: unknown) {
            this._logger.error(`[VercelFeatureFlagReader] getVariant failed for flag "${key}"`, {
                key,
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', `Failed to get variant for feature flag "${key}"`, error);
        }
    }

    /** @inheritdoc */
    public async getAllFlags(_context?: IFeatureFlagContext): Promise<ReadonlyArray<IFeatureFlagEvaluation>> {
        this.ensureInitialized();

        try {
            const flags = await this._edgeConfigClient!.get<Record<string, unknown>>(this._flagPrefix);

            if (!flags) {
                return [];
            }

            return Object.entries(flags).map(([key, value]) => ({
                key,
                enabled: Boolean(value),
                variant: typeof value === 'boolean' ? undefined : value,
            }));
        } catch (error: unknown) {
            this._logger.error('[VercelFeatureFlagReader] getAllFlags failed', {
                error: (error as Error).message,
            });
            throw new FeatureFlagError('vercel', 'Failed to retrieve all feature flags', error);
        }
    }

    /** @inheritdoc */
    public async refresh(): Promise<void> {
        // Vercel Edge Config is near-realtime and does not require explicit refresh.
        // This method is a no-op but can be extended in the future if needed.
    }

    /** @inheritdoc */
    public override async ping(): Promise<boolean> {
        try {
            this.ensureInitialized();
            await this._edgeConfigClient!.digest();

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Ensures the Edge Config client has been initialized.
     */
    private ensureInitialized(): void {
        if (!this._edgeConfigClient) {
            throw new FeatureFlagError('vercel', 'VercelFeatureFlagReader has not been initialized. Ensure onModuleInit() ran.');
        }
    }

    // #endregion
}
