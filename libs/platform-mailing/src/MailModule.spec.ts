import { BlobModule, BlobService, BlobStorageStrategyBase } from '@pixel-brewery/archipel-platform-blob-storage';
import { ConfigModule, ConfigService, EnvironmentConfigStrategy } from '@pixel-brewery/archipel-platform-configuration';
import { EventModule } from '@pixel-brewery/archipel-platform-core';
import { HealthModule } from '@pixel-brewery/archipel-platform-health';
import { ResourceModule } from '@pixel-brewery/archipel-platform-resources';
import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { EmptyDeliveryStrategy } from './delivering/strategies/empty/EmptyDeliveryStrategy.js';
import { MailModule } from './MailModule.js';
import { MailService } from './services/MailService.js';
import { MailVerificationService } from './services/MailVerificationService.js';
import { FileTemplateFetchStrategy } from './templating/strategies/file/FileTemplateFetchStrategy.js';

class StubBlobStorageStrategy extends BlobStorageStrategyBase {
    public override readonly providerId = 'stub';
    public override readonly defaultBucket = undefined;

    public override async uploadObject(): Promise<never> {
        throw new Error('Not implemented');
    }

    public override async downloadObject(): Promise<never> {
        throw new Error('Not implemented');
    }

    public override async deleteObject(): Promise<void> {
        return;
    }
}
Injectable()(StubBlobStorageStrategy);

const stubConfigService = {
    get: (key: string) => {
        const map: Record<string, string> = {
            MAIL_FROM: 'test@example.com',
            MAIL_FROM_NAME: 'Test',
            MAIL_SENDER_EMAIL: 'test@example.com',
            MAIL_TEMPLATE_ENGINE_FORMAT: 'html',
            VERCEL_BLOB_URL: 'https://blob.vercel-storage.com',
            VERCEL_BLOB_READ_WRITE_TOKEN: 'test-token',
        };
        return map[key];
    },
    tryGet: (key: string, fallback: unknown) => {
        const map: Record<string, string> = {
            MAIL_FROM: 'test@example.com',
            MAIL_FROM_NAME: 'Test',
            MAIL_SENDER_EMAIL: 'test@example.com',
            MAIL_TEMPLATE_ENGINE_FORMAT: 'html',
            VERCEL_BLOB_URL: 'https://blob.vercel-storage.com',
            VERCEL_BLOB_READ_WRITE_TOKEN: 'test-token',
        };
        return map[key] ?? fallback;
    },
    has: (key: string) =>
        ['MAIL_FROM', 'MAIL_FROM_NAME', 'MAIL_SENDER_EMAIL', 'MAIL_TEMPLATE_ENGINE_FORMAT', 'VERCEL_BLOB_URL', 'VERCEL_BLOB_READ_WRITE_TOKEN'].includes(key),
};

describe('MailModule (DI Integration)', () => {
    // #region Methods

    it('should resolve MailService when module is imported with empty delivery strategy', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: {
                        MAIL_FROM: 'test@example.com',
                        MAIL_FROM_NAME: 'Test',
                    },
                }),
                ResourceModule.forRoot({ strategies: [] }),
                HealthModule,
                EventModule,
                BlobModule.register({ storageStrategy: StubBlobStorageStrategy }),
                MailModule.register({
                    deliveryStrategy: EmptyDeliveryStrategy,
                    templateFetchStrategy: FileTemplateFetchStrategy,
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .overrideProvider(BlobService)
            .useValue({})
            .compile();

        // act
        const mailService = moduleRef.get(MailService);

        // assert
        expect(mailService).toBeInstanceOf(MailService);
    });

    it('should resolve MailVerificationService when module is imported', async () => {
        // arrange
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    strategyFactory: () => new EnvironmentConfigStrategy(),
                    statics: {
                        MAIL_FROM: 'test@example.com',
                        MAIL_FROM_NAME: 'Test',
                    },
                }),
                ResourceModule.forRoot({ strategies: [] }),
                HealthModule,
                EventModule,
                BlobModule.register({ storageStrategy: StubBlobStorageStrategy }),
                MailModule.register({
                    deliveryStrategy: EmptyDeliveryStrategy,
                    templateFetchStrategy: FileTemplateFetchStrategy,
                }),
            ],
        })
            .overrideProvider(ConfigService)
            .useValue(stubConfigService)
            .overrideProvider(BlobService)
            .useValue({})
            .compile();

        // act
        const verificationService = moduleRef.get(MailVerificationService);

        // assert
        expect(verificationService).toBeInstanceOf(MailVerificationService);
    });

    // #endregion
});
