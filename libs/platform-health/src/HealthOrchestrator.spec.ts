import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthOrchestrator } from './HealthOrchestrator.js';
import { type IHealthIndicator } from './IHealthIndicator.js';

describe('HealthOrchestrator', () => {
    // #region Fields

    let orchestrator: HealthOrchestrator;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        orchestrator = new HealthOrchestrator();
    });

    describe('registerIndicator', () => {
        it('should register a health indicator', async () => {
            // arrange
            const indicator = createIndicator('db', 'DbIndicator', { db: { status: 'up' } });

            // act
            orchestrator.registerIndicator(indicator);
            const results = await orchestrator.check();

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('db');
        });

        it('should skip duplicate indicator registrations', async () => {
            // arrange
            const indicator1 = createIndicator('db', 'DupIndicator', { db: { status: 'up' } });
            const indicator2 = createIndicator('db', 'DupIndicator', { db: { status: 'down' } });

            // act
            orchestrator.registerIndicator(indicator1);
            orchestrator.registerIndicator(indicator2);
            const results = await orchestrator.check();

            // assert
            expect(results).toHaveLength(1);
            expect(results[0].status).toBe('up');
        });
    });

    describe('check', () => {
        it('should aggregate results from multiple indicators', async () => {
            // arrange
            orchestrator.registerIndicator(createIndicator('db', 'DbIndicator', { database: { status: 'up' } }));
            orchestrator.registerIndicator(createIndicator('redis', 'RedisIndicator', { cache: { status: 'up' } }));

            // act
            const results = await orchestrator.check();

            // assert
            expect(results).toHaveLength(2);
        });

        it('should return empty array when no indicators are registered', async () => {
            // act
            const results = await orchestrator.check();

            // assert
            expect(results).toHaveLength(0);
        });

        it('should propagate indicator errors', async () => {
            // arrange
            const indicator: IHealthIndicator = {
                key: 'failing',
                check: vi.fn().mockRejectedValue(new Error('DB unavailable')),
            };
            Object.defineProperty(indicator.constructor, 'name', { value: 'FailingIndicator' });
            orchestrator.registerIndicator(indicator);

            // act & assert
            await expect(orchestrator.check()).rejects.toThrow('DB unavailable');
        });
    });

    // #endregion
});

// #region Helpers

function createIndicator(key: string, className: string, result: Record<string, unknown>): IHealthIndicator {
    const indicator = {
        key,
        check: vi.fn().mockResolvedValue(result),
    };
    Object.defineProperty(indicator.constructor, 'name', { value: className });

    return indicator as unknown as IHealthIndicator;
}

// #endregion
