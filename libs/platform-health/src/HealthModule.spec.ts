// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { HealthModule } from './HealthModule.js';
import { HealthOrchestrator } from './HealthOrchestrator.js';
import { IHealthIndicator } from './IHealthIndicator.js';

// #endregion

// #region Tests

class MockIndicatorA implements IHealthIndicator {
    public key = 'a';
    public check = vi.fn().mockResolvedValue({ a: { status: 'up' } });
}

class MockIndicatorB implements IHealthIndicator {
    public key = 'b';
    public check = vi.fn().mockResolvedValue({ b: { status: 'up' } });
}

describe('HealthModule', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('withIndicators', () => {
        it('should return a DynamicModule with the correct module reference', () => {
            // arrange / act
            const result = HealthModule.withIndicators([]);

            // assert
            expect(result.module).toBe(HealthModule);
        });

        it('should include TerminusModule in imports', () => {
            // arrange / act
            const result = HealthModule.withIndicators([]);

            // assert
            expect(result.imports).toBeDefined();
            expect(result.imports!.length).toBeGreaterThanOrEqual(1);
        });

        it('should export HealthOrchestrator', () => {
            // arrange / act
            const result = HealthModule.withIndicators([]);

            // assert
            expect(result.exports).toContain(HealthOrchestrator);
        });

        it('should include indicator providers and the bootstrap factory', () => {
            // arrange / act
            const result = HealthModule.withIndicators([MockIndicatorA, MockIndicatorB]);

            // assert
            const providers = result.providers as Array<Record<string, unknown>>;
            expect(providers.length).toBeGreaterThanOrEqual(4); // 2 indicators + orchestrator + bootstrap
        });

        it('should have a bootstrap factory that registers indicators on the orchestrator', () => {
            // arrange
            const result = HealthModule.withIndicators([MockIndicatorA, MockIndicatorB]);
            const providers = result.providers as Array<Record<string, unknown>>;
            const bootstrapProvider = providers.find((p) => p['provide'] === 'HEALTH_INDICATOR_BOOTSTRAP');
            expect(bootstrapProvider).toBeDefined();
            const factory = bootstrapProvider!['useFactory'] as (...args: unknown[]) => boolean;
            const orchestrator = new HealthOrchestrator();
            const registerSpy = vi.spyOn(orchestrator, 'registerIndicator');
            const indicatorA = new MockIndicatorA();
            const indicatorB = new MockIndicatorB();

            // act
            const returnValue = factory(orchestrator, indicatorA, indicatorB);

            // assert
            expect(registerSpy).toHaveBeenCalledTimes(2);
            expect(registerSpy).toHaveBeenCalledWith(indicatorA);
            expect(registerSpy).toHaveBeenCalledWith(indicatorB);
            expect(returnValue).toBe(true);
        });

        it('should inject HealthOrchestrator and all indicators', () => {
            // arrange / act
            const result = HealthModule.withIndicators([MockIndicatorA, MockIndicatorB]);
            const providers = result.providers as Array<Record<string, unknown>>;
            const bootstrapProvider = providers.find((p) => p['provide'] === 'HEALTH_INDICATOR_BOOTSTRAP');

            // assert
            const inject = bootstrapProvider!['inject'] as unknown[];
            expect(inject[0]).toBe(HealthOrchestrator);
            expect(inject).toContain(MockIndicatorA);
            expect(inject).toContain(MockIndicatorB);
        });
    });
});

// #endregion
