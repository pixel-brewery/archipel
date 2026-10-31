// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { FeatureAccessBase } from './FeatureAccessBase.js';

// #endregion

// #region Tests

describe('FeatureAccessBase', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should define abstract method checkAccess', () => {
        // arrange / act / assert
        expect(FeatureAccessBase.prototype.checkAccess).toBeUndefined();
    });

    it('should define abstract method recordUsage', () => {
        // arrange / act / assert
        expect(FeatureAccessBase.prototype.recordUsage).toBeUndefined();
    });

    it('should allow concrete implementations', async () => {
        // arrange
        class TestAccess extends FeatureAccessBase {
            public async checkAccess(_userId: string, _featureKey: string) {
                return { allowed: true, remainingQuota: 10 } as never;
            }
            public async recordUsage(_userId: string, _featureKey: string) {
                /* no-op */
            }
        }
        const access = new TestAccess();

        // act
        const result = await access.checkAccess('user-1', 'feature-a');

        // assert
        expect(result.allowed).toBe(true);
    });

    it('should treat every feature key as consumption unless an implementation says otherwise', () => {
        class MinimalAdapter extends FeatureAccessBase {
            public checkAccess(): Promise<IFeatureAccessResult> {
                return Promise.resolve({ allowed: true, used: 0, limit: -1, remaining: -1, resetAt: new Date() });
            }

            public recordUsage(): Promise<void> {
                return Promise.resolve();
            }
        }

        expect(new MinimalAdapter().isStockFeature('anything')).toBe(false);
    });

    it('should let an implementation declare a key as a stock', () => {
        class StockAwareAdapter extends FeatureAccessBase {
            public checkAccess(): Promise<IFeatureAccessResult> {
                return Promise.resolve({ allowed: true, used: 0, limit: -1, remaining: -1, resetAt: new Date() });
            }

            public recordUsage(): Promise<void> {
                return Promise.resolve();
            }

            public override isStockFeature(featureKey: string): boolean {
                return featureKey === 'webhooks';
            }
        }

        const port = new StockAwareAdapter();

        expect(port.isStockFeature('webhooks')).toBe(true);
        expect(port.isStockFeature('exports')).toBe(false);
    });
});

// #endregion
