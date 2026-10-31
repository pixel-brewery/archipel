import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { EsigningClientBase } from './abstracts/EsigningClientBase.js';
import { EsigningModule } from './EsigningModule.js';
import type { ICreateSigningRequest } from './models/ICreateSigningRequest.js';
import type { ICreateSigningSessionRequest } from './models/ICreateSigningSessionRequest.js';
import type { IEsigningWebhookEvent } from './models/IEsigningWebhookEvent.js';
import type { ISignedDocument } from './models/ISignedDocument.js';
import type { ISigningRequest } from './models/ISigningRequest.js';
import type { ISigningSession } from './models/ISigningSession.js';
import { EsigningService } from './services/EsigningService.js';

class StubEsigningClient extends EsigningClientBase {
    // #region Properties

    public readonly providerId: string = 'stub';

    // #endregion

    // #region Methods

    public async createSigningRequest(_request: ICreateSigningRequest): Promise<ISigningRequest> {
        return { id: 'stub', status: 'pending' } as ISigningRequest;
    }

    public async createSigningSession(_request: ICreateSigningSessionRequest): Promise<ISigningSession> {
        return { url: 'https://stub.example.com/sign' } as ISigningSession;
    }

    public async getSigningRequest(_signingRequestId: string): Promise<ISigningRequest> {
        return { id: 'stub', status: 'pending' } as ISigningRequest;
    }

    public async getSignedDocuments(_signingRequestId: string): Promise<Array<ISignedDocument>> {
        return [];
    }

    public async cancelSigningRequest(_signingRequestId: string, _reason?: string): Promise<void> {
        return;
    }

    public async verifyWebhook(_payload: string | Buffer, _signature: string, _headers?: Record<string, string>): Promise<IEsigningWebhookEvent> {
        return { type: 'stub' } as IEsigningWebhookEvent;
    }

    // #endregion
}
Injectable()(StubEsigningClient);

describe('EsigningModule (DI Integration)', () => {
    // #region Methods

    it('should resolve EsigningClientBase when module is registered with a provider', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                EsigningModule.register({ provider: StubEsigningClient }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({ get: () => undefined, tryGet: () => undefined, has: () => false })
            .compile();

        // act
        const client = moduleRef.get(EsigningClientBase);

        // assert
        expect(client).toBeInstanceOf(StubEsigningClient);
    });

    it('should resolve EsigningService when module is registered', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ strategyFactory: () => new EnvironmentConfigStrategy(), statics: {} }),
                EsigningModule.register({ provider: StubEsigningClient }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue({ get: () => undefined, tryGet: () => undefined, has: () => false })
            .compile();

        // act
        const service = moduleRef.get(EsigningService);

        // assert
        expect(service).toBeInstanceOf(EsigningService);
    });

    // #endregion
});
