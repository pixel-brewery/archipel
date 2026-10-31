import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PlatformBootstrapContext } from '../context/PlatformBootstrapContext.js';
import { createPlatformTestApplication } from '../testing/createPlatformTestApplication.js';
import { useSession } from './useSession.js';

const sessionFactory = vi.hoisted(() => vi.fn(() => vi.fn()));

vi.mock('express-session', () => ({ default: sessionFactory }));

describe('useSession', () => {
    afterEach((): void => {
        vi.restoreAllMocks();
    });

    it('registers session middleware from typed config keys', async (): Promise<void> => {
        // Arrange
        const configService = createConfigServiceDouble({
            AUTH_SESSION_SECRET: 'test-only-secret-do-not-use-in-production',
            AUTH_SESSION_SECURE: 'true',
            AUTH_SESSION_MAX_AGE: '2h',
        });
        const app = createPlatformTestApplication(configService);
        const context = new PlatformBootstrapContext(app as never, configService);
        const step = useSession({ rolling: true });

        // Act
        await step(context as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.use).toHaveBeenCalledTimes(1);
        expect(sessionFactory).toHaveBeenCalledWith(
            expect.objectContaining({
                resave: false,
                rolling: true,
                saveUninitialized: false,
            }),
        );
    });

    it('does not register middleware when disabled', async (): Promise<void> => {
        // Arrange
        const app = createPlatformTestApplication();
        const context = new PlatformBootstrapContext(app as never, app.configService);
        const step = useSession({ enabled: false });

        // Act
        await step(context as never, async (): Promise<void> => undefined);

        // Assert
        expect(app.use).not.toHaveBeenCalled();
    });
});

function createConfigServiceDouble(values: Record<string, string>): ConfigService {
    return {
        get: vi.fn((key: string): string => values[key] ?? key),
        tryGet: vi.fn(<TValue>(key: string, fallback: TValue): TValue => {
            const value = values[key];
            return value === undefined ? fallback : (value as TValue);
        }),
    } as unknown as ConfigService;
}
