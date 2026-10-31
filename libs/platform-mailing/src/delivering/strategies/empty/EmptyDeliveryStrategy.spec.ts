import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmptyDeliveryStrategy } from './EmptyDeliveryStrategy.js';

describe('EmptyDeliveryStrategy', () => {
    // #region Fields

    let strategy: EmptyDeliveryStrategy;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        strategy = new EmptyDeliveryStrategy();
    });

    it('should resolve without throwing', async () => {
        // act & assert
        await expect(strategy.send('from@test.com', 'to@test.com', 'Subject', 'Body', false)).resolves.toBeUndefined();
    });

    // #endregion
});
