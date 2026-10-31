// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { FileTemplateFetchStrategy } from './FileTemplateFetchStrategy.js';

// #endregion

// #region Tests

const TEMPLATE_NAMES = ['AppointmentInvitation', 'AppointmentUpdate', 'AuthForgotPassword', 'AuthRegister', 'AuthVerify'];

describe('FileTemplateFetchStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should load html and txt variants for known templates', async () => {
        // arrange
        const resourceManager = {
            tryLoadAsStringAsync: vi.fn().mockImplementation((key: string) => {
                if (key === 'AuthRegister.html') return Promise.resolve('<h1>Register</h1>');
                if (key === 'AuthRegister.txt') return Promise.resolve('Register');
                return Promise.resolve(undefined);
            }),
        } as never;
        const strategy = new FileTemplateFetchStrategy(resourceManager, TEMPLATE_NAMES);

        // act
        const result = await strategy.load();

        // assert
        expect(result['AuthRegister']).toBeDefined();
        expect(result['AuthRegister'].html).toBe('<h1>Register</h1>');
        expect(result['AuthRegister'].txt).toBe('Register');
    });

    it('should skip variants that are not found', async () => {
        // arrange
        const resourceManager = {
            tryLoadAsStringAsync: vi.fn().mockResolvedValue(undefined),
        } as never;
        const strategy = new FileTemplateFetchStrategy(resourceManager, TEMPLATE_NAMES);

        // act
        const result = await strategy.load();

        // assert
        expect(result['AppointmentInvitation']).toBeDefined();
        expect(result['AppointmentInvitation'].html).toBeUndefined();
        expect(result['AppointmentInvitation'].txt).toBeUndefined();
    });

    it('should attempt to load each template name with html and txt variants', async () => {
        // arrange
        const resourceManager = {
            tryLoadAsStringAsync: vi.fn().mockResolvedValue(undefined),
        } as never;
        const strategy = new FileTemplateFetchStrategy(resourceManager, TEMPLATE_NAMES);

        // act
        await strategy.load();

        // assert
        // 5 templates * 2 variants (html + txt) = 10 calls
        expect((resourceManager as any).tryLoadAsStringAsync).toHaveBeenCalledTimes(10);
    });

    it('should return object with keys for each template name', async () => {
        // arrange
        const resourceManager = {
            tryLoadAsStringAsync: vi.fn().mockResolvedValue(undefined),
        } as never;
        const strategy = new FileTemplateFetchStrategy(resourceManager, TEMPLATE_NAMES);

        // act
        const result = await strategy.load();

        // assert
        expect(Object.keys(result)).toEqual(
            expect.arrayContaining(['AppointmentInvitation', 'AppointmentUpdate', 'AuthForgotPassword', 'AuthRegister', 'AuthVerify']),
        );
    });

    it('should return empty record when no template names are provided', async () => {
        // arrange
        const resourceManager = {
            tryLoadAsStringAsync: vi.fn().mockResolvedValue(undefined),
        } as never;
        const strategy = new FileTemplateFetchStrategy(resourceManager, []);

        // act
        const result = await strategy.load();

        // assert
        expect(result).toEqual({});
        expect((resourceManager as any).tryLoadAsStringAsync).not.toHaveBeenCalled();
    });
});

// #endregion
