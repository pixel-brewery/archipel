// #region Imports

import 'reflect-metadata';
import { ConfigModule, ConfigService, createConfigKey, EnvironmentConfigStrategy, type IConfigKey } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Module } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { CompositionResolverBase } from '../services/abstracts/CompositionResolverBase.js';
import { createCompositionContext } from './createCompositionContext.js';

// #endregion

// #region Test Config Keys

const TEST_MAIL_DRIVER = createConfigKey<string>('TEST_MAIL_DRIVER');
const TEST_NODE_ENV = createConfigKey<string>('TEST_NODE_ENV');
const TEST_FEATURE_FLAG = createConfigKey<string>('TEST_FEATURE_FLAG');

// #endregion

// #region Test Composition Resolver

/**
 * Test composition resolver for integration tests.
 */
class TestAppCompositionResolver extends CompositionResolverBase {
    public constructor(configService: ConfigService) {
        super(configService);
    }

    public shouldImportProvider(providerKey: string): boolean {
        switch (providerKey) {
            case 'smtp-mail':
                return this.shouldImportSmtpMail();
            case 'log-mail':
                return !this.shouldImportSmtpMail();
            case 'feature-x':
                return this.isFeatureXEnabled();
            default:
                return false;
        }
    }

    public shouldImportSmtpMail(): boolean {
        const driver = this.tryGetConfigValue(TEST_MAIL_DRIVER, 'log');

        return driver === 'smtp' || this.isProductionLike();
    }

    public isProductionLike(): boolean {
        const stage = this.tryGetConfigValue(TEST_NODE_ENV, 'development');

        return stage === 'production' || stage === 'staging';
    }

    public isFeatureXEnabled(): boolean {
        const flag = this.tryGetConfigValue(TEST_FEATURE_FLAG, 'disabled');

        return flag === 'enabled';
    }
}
Reflect.defineMetadata('design:paramtypes', [ConfigService], TestAppCompositionResolver);
Injectable()(TestAppCompositionResolver);

// #endregion

// #region Test Composition Module

/**
 * Test composition module with custom resolver.
 */
class TestCompositionModule {}
Module({
    imports: [
        ConfigModule.forRoot({
            strategyFactory: (): EnvironmentConfigStrategy => new EnvironmentConfigStrategy(),
        }),
    ],
    providers: [TestAppCompositionResolver],
    exports: [ConfigModule, TestAppCompositionResolver],
})(TestCompositionModule);

// #endregion

describe('createCompositionContext', (): void => {
    describe('with default CompositionModule', (): void => {
        it('creates a composition context with configuration access', async (): Promise<void> => {
            // Arrange & Act
            const context = await createCompositionContext();

            try {
                // Assert
                expect(context).toBeDefined();
                expect(context.config).toBeInstanceOf(ConfigService);
                expect(context.context).toBeDefined();
            } finally {
                await context.close();
            }
        });

        it('provides access to environment configuration values', async (): Promise<void> => {
            // Arrange
            const originalValue = process.env['TEST_CONFIG_VALUE'];
            process.env['TEST_CONFIG_VALUE'] = 'test-value';

            try {
                const context = await createCompositionContext();

                try {
                    const key: IConfigKey<string> = { key: 'TEST_CONFIG_VALUE' };

                    // Act
                    const result = context.getConfigValue(key);

                    // Assert
                    expect(result).toBe('test-value');
                } finally {
                    await context.close();
                }
            } finally {
                if (originalValue === undefined) {
                    delete process.env['TEST_CONFIG_VALUE'];
                } else {
                    process.env['TEST_CONFIG_VALUE'] = originalValue;
                }
            }
        });

        it('returns fallback for missing configuration values', async (): Promise<void> => {
            // Arrange
            const context = await createCompositionContext();

            try {
                const key: IConfigKey<string> = { key: 'NON_EXISTENT_KEY_12345' };

                // Act
                const result = context.tryGetConfigValue(key, 'default-value');

                // Assert
                expect(result).toBe('default-value');
            } finally {
                await context.close();
            }
        });

        it('closes the underlying NestJS context', async (): Promise<void> => {
            // Arrange
            const context = await createCompositionContext();

            // Act
            await context.close();

            // Assert - context should be closed (no error thrown)
            expect(true).toBe(true);
        });
    });

    describe('with custom CompositionModule', (): void => {
        let originalEnv: Record<string, string | undefined>;

        beforeEach((): void => {
            originalEnv = {
                TEST_MAIL_DRIVER: process.env['TEST_MAIL_DRIVER'],
                TEST_NODE_ENV: process.env['TEST_NODE_ENV'],
                TEST_FEATURE_FLAG: process.env['TEST_FEATURE_FLAG'],
            };
        });

        afterEach((): void => {
            for (const [key, value] of Object.entries(originalEnv)) {
                if (value === undefined) {
                    delete process.env[key];
                } else {
                    process.env[key] = value;
                }
            }
        });

        it('allows resolving custom composition services', async (): Promise<void> => {
            // Arrange
            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                // Act
                const resolver = context.getService(TestAppCompositionResolver);

                // Assert
                expect(resolver).toBeInstanceOf(TestAppCompositionResolver);
            } finally {
                await context.close();
            }
        });

        it('resolves SMTP mail provider when driver is smtp', async (): Promise<void> => {
            // Arrange
            process.env['TEST_MAIL_DRIVER'] = 'smtp';
            process.env['TEST_NODE_ENV'] = 'development';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportSmtp = resolver.shouldImportProvider('smtp-mail');
                const shouldImportLog = resolver.shouldImportProvider('log-mail');

                // Assert
                expect(shouldImportSmtp).toBe(true);
                expect(shouldImportLog).toBe(false);
            } finally {
                await context.close();
            }
        });

        it('resolves log mail provider when driver is log', async (): Promise<void> => {
            // Arrange
            process.env['TEST_MAIL_DRIVER'] = 'log';
            process.env['TEST_NODE_ENV'] = 'development';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportSmtp = resolver.shouldImportProvider('smtp-mail');
                const shouldImportLog = resolver.shouldImportProvider('log-mail');

                // Assert
                expect(shouldImportSmtp).toBe(false);
                expect(shouldImportLog).toBe(true);
            } finally {
                await context.close();
            }
        });

        it('resolves SMTP mail provider in production stage regardless of driver', async (): Promise<void> => {
            // Arrange
            process.env['TEST_MAIL_DRIVER'] = 'log';
            process.env['TEST_NODE_ENV'] = 'production';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportSmtp = resolver.shouldImportProvider('smtp-mail');
                const isProductionLike = resolver.isProductionLike();

                // Assert
                expect(isProductionLike).toBe(true);
                expect(shouldImportSmtp).toBe(true);
            } finally {
                await context.close();
            }
        });

        it('resolves SMTP mail provider in staging stage regardless of driver', async (): Promise<void> => {
            // Arrange
            process.env['TEST_MAIL_DRIVER'] = 'log';
            process.env['TEST_NODE_ENV'] = 'staging';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportSmtp = resolver.shouldImportProvider('smtp-mail');
                const isProductionLike = resolver.isProductionLike();

                // Assert
                expect(isProductionLike).toBe(true);
                expect(shouldImportSmtp).toBe(true);
            } finally {
                await context.close();
            }
        });

        it('respects feature flags for provider decisions', async (): Promise<void> => {
            // Arrange
            process.env['TEST_FEATURE_FLAG'] = 'enabled';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportFeatureX = resolver.shouldImportProvider('feature-x');

                // Assert
                expect(shouldImportFeatureX).toBe(true);
            } finally {
                await context.close();
            }
        });

        it('disables feature when flag is disabled', async (): Promise<void> => {
            // Arrange
            process.env['TEST_FEATURE_FLAG'] = 'disabled';

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportFeatureX = resolver.shouldImportProvider('feature-x');

                // Assert
                expect(shouldImportFeatureX).toBe(false);
            } finally {
                await context.close();
            }
        });

        it('uses default values when environment variables are not set', async (): Promise<void> => {
            // Arrange
            delete process.env['TEST_MAIL_DRIVER'];
            delete process.env['TEST_NODE_ENV'];
            delete process.env['TEST_FEATURE_FLAG'];

            const context = await createCompositionContext({
                module: TestCompositionModule,
            });

            try {
                const resolver = context.getService(TestAppCompositionResolver);

                // Act
                const shouldImportSmtp = resolver.shouldImportProvider('smtp-mail');
                const shouldImportLog = resolver.shouldImportProvider('log-mail');
                const shouldImportFeatureX = resolver.shouldImportProvider('feature-x');

                // Assert
                // Default driver is 'log', default env is 'development', default feature flag is 'disabled'
                expect(shouldImportSmtp).toBe(false);
                expect(shouldImportLog).toBe(true);
                expect(shouldImportFeatureX).toBe(false);
            } finally {
                await context.close();
            }
        });
    });

    describe('logging options', (): void => {
        it('creates context with logging disabled by default', async (): Promise<void> => {
            // Arrange & Act
            const context = await createCompositionContext();

            try {
                // Assert - context should be created without errors
                expect(context).toBeDefined();
            } finally {
                await context.close();
            }
        });

        it('creates context with logging enabled when specified', async (): Promise<void> => {
            // Arrange & Act
            const context = await createCompositionContext({
                enableLogging: true,
            });

            try {
                // Assert - context should be created without errors
                expect(context).toBeDefined();
            } finally {
                await context.close();
            }
        });
    });
});

describe('Composition workflow integration', (): void => {
    let originalEnv: Record<string, string | undefined>;

    beforeEach((): void => {
        originalEnv = {
            TEST_MAIL_DRIVER: process.env['TEST_MAIL_DRIVER'],
            TEST_NODE_ENV: process.env['TEST_NODE_ENV'],
        };
    });

    afterEach((): void => {
        for (const [key, value] of Object.entries(originalEnv)) {
            if (value === undefined) {
                delete process.env[key];
            } else {
                process.env[key] = value;
            }
        }
    });

    it('simulates full composition workflow with dynamic module imports', async (): Promise<void> => {
        // Arrange
        process.env['TEST_MAIL_DRIVER'] = 'smtp';
        process.env['TEST_NODE_ENV'] = 'production';

        const context = await createCompositionContext({
            module: TestCompositionModule,
        });

        try {
            const resolver = context.getService(TestAppCompositionResolver);

            // Act - Simulate the composition decision process
            const modulesToImport: Array<string> = [];

            if (resolver.shouldImportProvider('smtp-mail')) {
                // In real code: const { MailModule } = await import('@pixel-brewery/archipel-platform-mailing');
                modulesToImport.push('MailModule with SmtpDeliveryStrategy');
            }

            if (resolver.shouldImportProvider('log-mail')) {
                modulesToImport.push('MailModule with LogDeliveryStrategy');
            }

            if (resolver.shouldImportProvider('feature-x')) {
                modulesToImport.push('FeatureXModule');
            }

            // Assert
            expect(modulesToImport).toContain('MailModule with SmtpDeliveryStrategy');
            expect(modulesToImport).not.toContain('MailModule with LogDeliveryStrategy');
            expect(modulesToImport).not.toContain('FeatureXModule');
        } finally {
            await context.close();
        }
    });

    it('simulates composition workflow for development environment', async (): Promise<void> => {
        // Arrange
        process.env['TEST_MAIL_DRIVER'] = 'log';
        process.env['TEST_NODE_ENV'] = 'development';

        const context = await createCompositionContext({
            module: TestCompositionModule,
        });

        try {
            const resolver = context.getService(TestAppCompositionResolver);

            // Act - Simulate the composition decision process
            const modulesToImport: Array<string> = [];

            if (resolver.shouldImportProvider('smtp-mail')) {
                modulesToImport.push('MailModule with SmtpDeliveryStrategy');
            }

            if (resolver.shouldImportProvider('log-mail')) {
                modulesToImport.push('MailModule with LogDeliveryStrategy');
            }

            // Assert
            expect(modulesToImport).not.toContain('MailModule with SmtpDeliveryStrategy');
            expect(modulesToImport).toContain('MailModule with LogDeliveryStrategy');
        } finally {
            await context.close();
        }
    });
});
