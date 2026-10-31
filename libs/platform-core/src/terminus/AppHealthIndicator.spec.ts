// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppHealthIndicator } from './AppHealthIndicator.js';

// #endregion

// #region Tests

describe('AppHealthIndicator', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should return healthy status with version and commit', () => {
        // arrange
        const configService = {
            tryGet: vi.fn().mockImplementation((_key: string, fallback: string) => {
                if (_key === 'APP_VERSION') return '1.2.3';
                if (_key === 'GIT_COMMIT') return 'abc123';
                return fallback;
            }),
        };
        const indicator = new AppHealthIndicator(configService as never);

        // act
        const result = indicator.isHealthy();

        // assert
        expect(result).toEqual({
            app: {
                status: 'up',
                version: '1.2.3',
                commit: 'abc123',
            },
        });
    });

    it('should use "unknown" as fallback when config values are missing', () => {
        // arrange
        const configService = {
            tryGet: vi.fn().mockImplementation((_key: string, fallback: string) => fallback),
        };
        const indicator = new AppHealthIndicator(configService as never);

        // act
        const result = indicator.isHealthy();

        // assert
        expect(result).toEqual({
            app: {
                status: 'up',
                version: 'unknown',
                commit: 'unknown',
            },
        });
    });

    it('should always report status as "up"', () => {
        // arrange
        const configService = {
            tryGet: vi.fn().mockReturnValue('value'),
        };
        const indicator = new AppHealthIndicator(configService as never);

        // act
        const result = indicator.isHealthy();

        // assert
        expect(result.app.status).toBe('up');
    });
});

// #endregion
