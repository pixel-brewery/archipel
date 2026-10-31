import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Controller, Injectable, UseGuards } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { FeatureAccessBase } from './abstracts/FeatureAccessBase.js';
import type { IFeatureAccessResult } from './contracts/IFeatureAccessResult.js';
import { PaymentClientBase } from './abstracts/PaymentClientBase.js';
import { FeatureGuard } from './guards/FeatureGuard.js';
import type { INormalizedCheckoutSession } from './models/INormalizedCheckoutSession.js';
import type { INormalizedPrice } from './models/INormalizedPrice.js';
import type { INormalizedSubscription } from './models/INormalizedSubscription.js';
import type { INormalizedWebhookEvent } from './models/INormalizedWebhookEvent.js';
import { PaymentModule } from './PaymentModule.js';

class StubPaymentClient extends PaymentClientBase {
    // #region Methods

    public async fetchPrices(_productId: string): Promise<Array<INormalizedPrice>> {
        return [];
    }

    public async createCheckoutSession(_priceId: string, _successUrl: string, _cancelUrl: string, _userId?: string): Promise<INormalizedCheckoutSession> {
        return {
            id: 'stub',
            url: 'https://example.com/checkout',
            subscriptionId: null,
            customerId: null,
            clientReferenceId: null,
            paymentStatus: 'unpaid',
        };
    }

    public async fetchSubscription(_subscriptionId: string): Promise<INormalizedSubscription | null> {
        return null;
    }

    public constructWebhookEvent(_payload: string | Buffer, _signature: string): INormalizedWebhookEvent {
        return { type: 'unknown', data: {} };
    }

    // #endregion
}
Injectable()(StubPaymentClient);

class StubFeatureAccess extends FeatureAccessBase {
    // #region Methods

    public async checkAccess(_userId: string, _featureKey: string): Promise<IFeatureAccessResult> {
        return { allowed: true, used: 0, remaining: 100, limit: 100, resetAt: new Date() };
    }

    public async recordUsage(_userId: string, _featureKey: string): Promise<void> {
        return;
    }

    // #endregion
}
Injectable()(StubFeatureAccess);

class StubFeatureGuardConsumerController {}
Controller('feature-guard-consumer')(StubFeatureGuardConsumerController);
UseGuards(FeatureGuard)(StubFeatureGuardConsumerController);

const stubConfigService = {
    get: () => undefined,
    tryGet: () => undefined,
    has: () => false,
};

describe('PaymentModule (DI Integration)', () => {
    // #region Methods

    it('should resolve PaymentClientBase when module is registered without featureAccess', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                PaymentModule.register({ paymentClient: StubPaymentClient }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const client = moduleRef.get(PaymentClientBase);

        // assert
        expect(client).toBeInstanceOf(StubPaymentClient);
    });

    it('should resolve FeatureGuard when module is registered with featureAccess', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                PaymentModule.register({
                    paymentClient: StubPaymentClient,
                    featureAccess: StubFeatureAccess,
                }),
            ],
            controllers: [StubFeatureGuardConsumerController],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .compile();

        // act
        const guard = moduleRef.get(FeatureGuard);

        // assert
        expect(guard).toBeInstanceOf(FeatureGuard);
        expect(moduleRef.get(StubFeatureGuardConsumerController)).toBeInstanceOf(StubFeatureGuardConsumerController);
    });

    // #endregion
});
