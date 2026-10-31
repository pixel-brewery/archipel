import { describe, expect, it } from 'vitest';
import { AnalyticsModule } from './AnalyticsModule.js';
import { AnalyticsClientBase } from './abstracts/AnalyticsClientBase.js';
import { NoopAnalyticsClient } from './noop/NoopAnalyticsClient.js';

describe('AnalyticsModule', () => {
    // #region Methods

    describe('register', () => {
        it('should return a dynamic module with the specified analytics client', () => {
            const result = AnalyticsModule.register({
                analyticsClient: NoopAnalyticsClient,
            });

            expect(result.module).toBe(AnalyticsModule);
            expect(result.providers).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        provide: AnalyticsClientBase,
                        useClass: NoopAnalyticsClient,
                    }),
                ]),
            );
            expect(result.exports).toEqual(expect.arrayContaining([AnalyticsClientBase]));
        });

        it('should default global to false', () => {
            const result = AnalyticsModule.register({
                analyticsClient: NoopAnalyticsClient,
            });

            expect(result.global).toBe(false);
        });

        it('should set global to true when specified', () => {
            const result = AnalyticsModule.register({
                analyticsClient: NoopAnalyticsClient,
                isGlobal: true,
            });

            expect(result.global).toBe(true);
        });
    });

    // #endregion
});
