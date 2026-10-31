import { Controller, Injectable, UseGuards } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { describe, expect, it } from 'vitest';
import { FeatureFlagReaderBase } from './abstracts/FeatureFlagReaderBase.js';
import { FeatureFlagModule } from './FeatureFlagModule.js';
import { FeatureFlagGuard } from './guards/FeatureFlagGuard.js';
import type { IFeatureFlagModuleOptions } from './models/IFeatureFlagModuleOptions.js';

class StubFeatureFlagReader extends FeatureFlagReaderBase {
    // #region Methods

    public async isEnabled(): Promise<boolean> {
        return false;
    }

    public async getVariant<T = unknown>(_key: string, defaultValue: T): Promise<T> {
        return defaultValue;
    }

    public async getAllFlags(): Promise<ReadonlyArray<never>> {
        return [];
    }

    public async refresh(): Promise<void> {
        // no-op
    }

    // #endregion
}
Injectable()(StubFeatureFlagReader);

class StubFeatureFlagGuardConsumerController {}
Controller('feature-flag-guard-consumer')(StubFeatureFlagGuardConsumerController);
UseGuards(FeatureFlagGuard)(StubFeatureFlagGuardConsumerController);

describe('FeatureFlagModule', () => {
    // #region Methods

    describe('register', () => {
        it('should return a dynamic module with the provided reader', () => {
            // arrange
            const options: IFeatureFlagModuleOptions = {
                featureFlagReader: StubFeatureFlagReader,
            };

            // act
            const result = FeatureFlagModule.register(options);

            // assert
            expect(result.module).toBe(FeatureFlagModule);
            expect(result.global).toBe(true);

            const providers = result.providers as Array<{ provide: unknown; useClass: unknown }>;
            const readerProvider = providers.find((p) => p.provide === FeatureFlagReaderBase);
            expect(readerProvider).toBeDefined();
            expect(readerProvider!.useClass).toBe(StubFeatureFlagReader);

            expect(providers).toContain(FeatureFlagGuard);
            expect(result.exports).toContain(FeatureFlagReaderBase);
            expect(result.exports).toContain(FeatureFlagGuard);
        });

        it('should allow importing modules to use the exported guard', async () => {
            // arrange
            const testingModuleBuilder = Test.createTestingModule({
                imports: [FeatureFlagModule.register({ featureFlagReader: StubFeatureFlagReader })],
                controllers: [StubFeatureFlagGuardConsumerController],
            });

            // act
            const moduleRef = await testingModuleBuilder.compile();

            // assert
            expect(moduleRef.get(StubFeatureFlagGuardConsumerController)).toBeInstanceOf(StubFeatureFlagGuardConsumerController);
            expect(moduleRef.get(FeatureFlagGuard)).toBeInstanceOf(FeatureFlagGuard);
        });

        it('should respect isGlobal false', () => {
            // arrange
            const options: IFeatureFlagModuleOptions = {
                featureFlagReader: StubFeatureFlagReader,
                isGlobal: false,
            };

            // act
            const result = FeatureFlagModule.register(options);

            // assert
            expect(result.global).toBe(false);
        });

        it('should pass config entries to the ConfigModule import', () => {
            // arrange
            const configEntries = [{ key: { key: 'TEST_KEY', defaultValue: undefined }, required: true, description: 'a test key' }];
            const options: IFeatureFlagModuleOptions = {
                featureFlagReader: StubFeatureFlagReader,
                configEntries,
            };

            // act
            const result = FeatureFlagModule.register(options);

            // assert
            expect(result.imports).toBeDefined();
            expect(result.imports!.length).toBe(1);
        });
    });

    // #endregion
});
