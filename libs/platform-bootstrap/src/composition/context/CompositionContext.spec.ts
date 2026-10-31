// #region Imports

import type { ConfigService, IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import type { INestApplicationContext } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CompositionContext } from './CompositionContext.js';

// #endregion

describe('CompositionContext', (): void => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    describe('properties', (): void => {
        it('exposes the underlying NestJS application context', (): void => {
            // Arrange
            const nestContext = createNestContextDouble();
            const configService = createConfigServiceDouble({});
            const compositionContext = new CompositionContext(nestContext, configService);

            // Act
            const result = compositionContext.context;

            // Assert
            expect(result).toBe(nestContext);
        });

        it('exposes the configuration service', (): void => {
            // Arrange
            const nestContext = createNestContextDouble();
            const configService = createConfigServiceDouble({});
            const compositionContext = new CompositionContext(nestContext, configService);

            // Act
            const result = compositionContext.config;

            // Assert
            expect(result).toBe(configService);
        });
    });

    describe('getConfigValue', (): void => {
        it('retrieves a typed configuration value', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({ MY_KEY: 'my-value' });
            const compositionContext = new CompositionContext(createNestContextDouble(), configService);
            const key: IConfigKey<string> = { key: 'MY_KEY' };

            // Act
            const result = compositionContext.getConfigValue(key);

            // Assert
            expect(result).toBe('my-value');
            expect(configService.get).toHaveBeenCalledWith('MY_KEY');
        });
    });

    describe('tryGetConfigValue', (): void => {
        it('retrieves a configuration value when present', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({ MY_KEY: 'my-value' });
            const compositionContext = new CompositionContext(createNestContextDouble(), configService);
            const key: IConfigKey<string> = { key: 'MY_KEY' };

            // Act
            const result = compositionContext.tryGetConfigValue(key, 'fallback');

            // Assert
            expect(result).toBe('my-value');
        });

        it('returns fallback when configuration value is absent', (): void => {
            // Arrange
            const configService = createConfigServiceDouble({});
            const compositionContext = new CompositionContext(createNestContextDouble(), configService);
            const key: IConfigKey<string> = { key: 'MISSING_KEY' };

            // Act
            const result = compositionContext.tryGetConfigValue(key, 'fallback');

            // Assert
            expect(result).toBe('fallback');
        });
    });

    describe('getService', (): void => {
        it('resolves a provider from the underlying context', (): void => {
            // Arrange
            class TestService {
                public readonly value = 'test';
            }

            const testService = new TestService();
            const nestContext = createNestContextDouble();
            vi.mocked(nestContext.get).mockReturnValue(testService);
            const compositionContext = new CompositionContext(nestContext, createConfigServiceDouble({}));

            // Act
            const result = compositionContext.getService(TestService);

            // Assert
            expect(result).toBe(testService);
            expect(nestContext.get).toHaveBeenCalledWith(TestService, { strict: false });
        });
    });

    describe('close', (): void => {
        it('closes the underlying NestJS context', async (): Promise<void> => {
            // Arrange
            const nestContext = createNestContextDouble();
            const compositionContext = new CompositionContext(nestContext, createConfigServiceDouble({}));

            // Act
            await compositionContext.close();

            // Assert
            expect(nestContext.close).toHaveBeenCalled();
        });
    });
});

function createNestContextDouble(): INestApplicationContext {
    return {
        get: vi.fn(),
        close: vi.fn(async (): Promise<void> => undefined),
    } as unknown as INestApplicationContext;
}

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
    } as unknown as ConfigService;
}
