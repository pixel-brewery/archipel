import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { INestApplication } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlatformBootstrapError } from '../errors/PlatformBootstrapError.js';
import { PlatformBootstrapStep } from '../types/PlatformBootstrapStep.js';
import { PlatformApplication } from './PlatformApplication.js';

describe('PlatformApplicationBuilder', () => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    it('executes bootstrap steps in chain order', async (): Promise<void> => {
        // Arrange
        const app = createNestApplicationDouble();
        const calls: Array<string> = [];
        const firstStep: PlatformBootstrapStep = async (_context, next): Promise<void> => {
            calls.push('first:before');
            await next();
            calls.push('first:after');
        };
        const secondStep: PlatformBootstrapStep = async (_context, next): Promise<void> => {
            calls.push('second:before');
            await next();
            calls.push('second:after');
        };

        // Act
        await PlatformApplication.from(app).use(firstStep).use(secondStep).run();

        // Assert
        expect(calls).toEqual(['first:before', 'second:before', 'second:after', 'first:after']);
    });

    it('wraps step failures with platform bootstrap context', async (): Promise<void> => {
        // Arrange
        const app = createNestApplicationDouble();
        const failingStep: PlatformBootstrapStep = (): void => {
            throw new Error('No module metadata found.');
        };

        // Act
        const act = async (): Promise<void> => {
            await PlatformApplication.from(app).use(failingStep).run();
        };

        // Assert
        await expect(act()).rejects.toMatchObject({
            name: 'PlatformBootstrapError',
            stepIndex: 0,
            stepName: 'failingStep',
        });
    });

    it('starts listening from the first available port config key', async (): Promise<void> => {
        // Arrange
        const app = createNestApplicationDouble({ PORT: '4100' });

        // Act
        await PlatformApplication.from(app).listenFromConfig({ fallbackPort: 3000 });

        // Assert
        expect(app.listen).toHaveBeenCalledWith(4100);
    });

    it('rejects invalid configured ports', async (): Promise<void> => {
        // Arrange
        const app = createNestApplicationDouble({ PORT: 'invalid' });

        // Act
        const act = async (): Promise<void> => {
            await PlatformApplication.from(app).listenFromConfig({ fallbackPort: 3000 });
        };

        // Assert
        await expect(act()).rejects.toBeInstanceOf(PlatformBootstrapError);
    });
});

function createNestApplicationDouble(values?: Record<string, string>): INestApplication {
    const configService = createConfigServiceDouble(values ?? {});

    return {
        get: vi.fn(<TService>(token: unknown): TService => {
            if (token === ConfigService) {
                return configService as TService;
            }

            throw new Error('Provider is not registered in the test application.');
        }),
        init: vi.fn(async (): Promise<void> => undefined),
        listen: vi.fn(async (): Promise<void> => undefined),
    } as unknown as INestApplication;
}

function createConfigServiceDouble(values: Record<string, string>): ConfigService {
    return {
        get: vi.fn((key: string): string => values[key] ?? key),
        tryGet: vi.fn(<TValue>(key: string, fallback: TValue): TValue => {
            const value = values[key];
            return value === undefined ? fallback : (value as TValue);
        }),
    } as unknown as ConfigService;
}
