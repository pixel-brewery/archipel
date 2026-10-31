import type { Subscription } from '@lemonsqueezy/lemonsqueezy.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LemonSqueezyMapper } from './LemonSqueezyMapper.js';

describe('LemonSqueezyMapper', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should map an unrecognized subscription status to unknown', () => {
        // arrange
        const mapper = new LemonSqueezyMapper();
        const subscription = {
            id: 'sub_1',
            attributes: {
                customer_id: 1,
                status: 'future_status',
                variant_id: 2,
                created_at: '2026-01-01T00:00:00.000Z',
                updated_at: '2026-01-02T00:00:00.000Z',
                ends_at: null,
                renews_at: '2026-02-01T00:00:00.000Z',
                cancelled: false,
                trial_ends_at: null,
            },
        } as unknown as Subscription['data'];

        // act
        const normalizedSubscription = mapper.mapSubscription(subscription);

        // assert
        expect(normalizedSubscription.status).toBe('unknown');
    });
});
