// #region Imports

import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CompositionResolverBase } from './CompositionResolverBase.js';

// #endregion

/**
 * Concrete test implementation of the CompositionResolverBase.
 */
class TestCompositionResolver extends CompositionResolverBase {
    // #region Fields

    private readonly _providerDecisions: Map<string, boolean>;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService, providerDecisions?: Map<string, boolean>) {
        super(configService);
        this._providerDecisions = providerDecisions ?? new Map();
    }

    // #endregion

    // #region Methods

    public shouldImportProvider(providerKey: string): boolean {
        return this._providerDecisions.get(providerKey) ?? false;
    }

    /**
     * Exposes getConfigValue for testing.
     */
    public testGetConfigValue<T>(key: IConfigKey<T>): T {
        return this.getConfigValue(key);
    }

    /**
     * Exposes tryGetConfigValue for testing.
     */
    public testTryGetConfigValue<T>(key: IConfigKey<T>, fallback: T): T {
        return this.tryGetConfigValue(key, fallback);
    }

    /**
     * Exposes compareConfigValue for testing.
     */
    public testCompareConfigValue<T>(key: IConfigKey<T>, value: T): boolean {
        return this.compareConfigValue(key, value);
    }

    /**
     * Exposes configService for testing.
     */
    public testGetConfigService(): ConfigService {
        return this.configService;
    }

    // #endregion
}

describe('CompositionResolverBase', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    describe('shouldImportProvider', (): void => {
        it('returns true when provider should be imported', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const decisions = new Map([['mail', true]]);
            const resolver = new TestCompositionResolver(configService, decisions);

            // Act
            const result = resolver.shouldImportProvider('mail');

            // Assert
            expect(result).toBe(true);
        });

        it('returns false when provider should not be imported', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const decisions = new Map([['mail', false]]);
            const resolver = new TestCompositionResolver(configService, decisions);

            // Act
            const result = resolver.shouldImportProvider('mail');

            // Assert
            expect(result).toBe(false);
        });

        it('returns false for unknown providers', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const resolver = new TestCompositionResolver(configService);

            // Act
            const result = resolver.shouldImportProvider('unknown-provider');

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('getConfigValue', (): void => {
        it('retrieves a typed configuration value via the config service', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({ MAIL_DRIVER: 'smtp' });
            const resolver = new TestCompositionResolver(configService);
            const key: IConfigKey<string> = { key: 'MAIL_DRIVER' };

            // Act
            const result = resolver.testGetConfigValue(key);

            // Assert
            expect(result).toBe('smtp');
            expect(configService.get).toHaveBeenCalledWith('MAIL_DRIVER');
        });
    });

    describe('tryGetConfigValue', (): void => {
        it('retrieves a configuration value when present', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({ NODE_ENV: 'production' });
            const resolver = new TestCompositionResolver(configService);
            const key: IConfigKey<string> = { key: 'NODE_ENV' };

            // Act
            const result = resolver.testTryGetConfigValue(key, 'development');

            // Assert
            expect(result).toBe('production');
        });

        it('returns fallback when configuration value is absent', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const resolver = new TestCompositionResolver(configService);
            const key: IConfigKey<string> = { key: 'NODE_ENV' };

            // Act
            const result = resolver.testTryGetConfigValue(key, 'development');

            // Assert
            expect(result).toBe('development');
        });
    });

    describe('compareConfigValue', (): void => {
        it('returns true when configuration value matches', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            vi.mocked(configService.compare).mockReturnValue(true);
            const resolver = new TestCompositionResolver(configService);
            const key: IConfigKey<string> = { key: 'NODE_ENV' };

            // Act
            const result = resolver.testCompareConfigValue(key, 'production');

            // Assert
            expect(result).toBe(true);
            expect(configService.compare).toHaveBeenCalledWith('NODE_ENV', 'production');
        });

        it('returns false when configuration value does not match', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            vi.mocked(configService.compare).mockReturnValue(false);
            const resolver = new TestCompositionResolver(configService);
            const key: IConfigKey<string> = { key: 'NODE_ENV' };

            // Act
            const result = resolver.testCompareConfigValue(key, 'production');

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('configService property', (): void => {
        it('exposes the underlying config service', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const resolver = new TestCompositionResolver(configService);

            // Act
            const result = resolver.testGetConfigService();

            // Assert
            expect(result).toBe(configService);
        });
    });
});

function createConfigServiceDouble(values: Record<string, string>): ConfigService {
    return {
        get: vi.fn((key: string): string => values[key] ?? key),
        tryGet: vi.fn(<TValue>(key: string, fallback: TValue): TValue => {
            const value = values[key];

            if (value === undefined) {
                return fallback;
            }

            return value as unknown as TValue;
        }),
        compare: vi.fn(),
    } as unknown as ConfigService;
}
