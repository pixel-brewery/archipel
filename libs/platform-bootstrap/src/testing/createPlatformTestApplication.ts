import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { vi } from 'vitest';
import { IPlatformTestApplication } from './IPlatformTestApplication.js';

/**
 * Creates a lightweight in-memory NestJS application double for platform bootstrap tests.
 *
 * @public
 * @param configService - Optional config service double.
 * @returns A platform test application.
 */
export function createPlatformTestApplication(configService?: ConfigService): IPlatformTestApplication {
    const calls: Array<string> = [];
    const resolvedConfigService = configService ?? createConfigServiceDouble();
    const reflector = new Reflector();
    const getProvider = <TResult = unknown>(token: Type<unknown> | string | symbol): TResult => {
        if (token === ConfigService) {
            return resolvedConfigService as TResult;
        }

        if (token === Reflector) {
            return reflector as TResult;
        }

        throw new Error('Provider is not registered in the platform test application.');
    };

    return {
        calls,
        configService: resolvedConfigService,
        enableCors: vi.fn((): void => {
            calls.push('enableCors');
        }),
        get: vi.fn(getProvider) as unknown as IPlatformTestApplication['get'],
        init: vi.fn(async (): Promise<void> => {
            calls.push('init');
        }),
        listen: vi.fn(async (): Promise<void> => {
            calls.push('listen');
        }),
        setGlobalPrefix: vi.fn((): void => {
            calls.push('setGlobalPrefix');
        }),
        use: vi.fn((): void => {
            calls.push('use');
        }),
        useGlobalFilters: vi.fn((): void => {
            calls.push('useGlobalFilters');
        }),
        useGlobalInterceptors: vi.fn((): void => {
            calls.push('useGlobalInterceptors');
        }),
        useGlobalPipes: vi.fn((): void => {
            calls.push('useGlobalPipes');
        }),
    };
}

function createConfigServiceDouble(): ConfigService {
    return {
        get: vi.fn((key: string): string => key),
        tryGet: vi.fn(<TValue>(_key: string, fallback: TValue): TValue => fallback),
    } as unknown as ConfigService;
}
