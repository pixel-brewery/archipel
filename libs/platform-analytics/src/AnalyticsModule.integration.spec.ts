import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { AnalyticsModule } from './AnalyticsModule.js';
import { AnalyticsClientBase } from './abstracts/AnalyticsClientBase.js';
import { NoopAnalyticsClient } from './noop/NoopAnalyticsClient.js';

describe('AnalyticsModule (DI Integration)', () => {
    // #region Methods

    it('should resolve AnalyticsClientBase as NoopAnalyticsClient', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                AnalyticsModule.register({ analyticsClient: NoopAnalyticsClient }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({ get: () => undefined, tryGet: () => undefined, has: () => false })
            .compile();

        // act
        const client = moduleRef.get(AnalyticsClientBase);

        // assert
        expect(client).toBeInstanceOf(NoopAnalyticsClient);
    });

    // #endregion
});
