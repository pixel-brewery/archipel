// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { IMailTemplate } from '../../../models/IMailTemplate.js';
import type { IMailTemplateRepository } from '../../../interfaces/IMailTemplateRepository.js';
import { DatabaseTemplateFetchStrategy } from './DatabaseTemplateFetchStrategy.js';

// #endregion

// #region Tests

describe('DatabaseTemplateFetchStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should load templates from repository and group by key', async () => {
        // arrange
        const mockTemplates: Array<IMailTemplate> = [
            {
                key: 'AuthRegister',
                subject: 'Welcome',
                htmlBody: '<h1>Welcome {{firstName}}</h1>',
                txtBody: 'Welcome {{firstName}}',
            },
            {
                key: 'AuthForgotPassword',
                subject: 'Reset',
                htmlBody: '<h1>Reset your password</h1>',
            },
        ];

        const repository: IMailTemplateRepository = {
            findAll: vi.fn().mockResolvedValue(mockTemplates),
            findByKey: vi.fn(),
            upsert: vi.fn(),
            delete: vi.fn(),
        };

        const strategy = new DatabaseTemplateFetchStrategy(repository);

        // act
        const result = await strategy.load();

        // assert
        expect(result['AuthRegister']).toBeDefined();
        expect(result['AuthRegister'].subject).toBe('Welcome');
        expect(result['AuthRegister'].html).toBe('<h1>Welcome {{firstName}}</h1>');
        expect(result['AuthRegister'].txt).toBe('Welcome {{firstName}}');
        expect(result['AuthForgotPassword']).toBeDefined();
        expect(result['AuthForgotPassword'].subject).toBe('Reset');
        expect(result['AuthForgotPassword'].html).toBe('<h1>Reset your password</h1>');
        expect(result['AuthForgotPassword'].txt).toBeUndefined();
    });

    it('should return empty record when repository has no templates', async () => {
        // arrange
        const repository: IMailTemplateRepository = {
            findAll: vi.fn().mockResolvedValue([]),
            findByKey: vi.fn(),
            upsert: vi.fn(),
            delete: vi.fn(),
        };

        const strategy = new DatabaseTemplateFetchStrategy(repository);

        // act
        const result = await strategy.load();

        // assert
        expect(result).toEqual({});
    });

    it('should prefer first match when multiple templates have same key', async () => {
        // arrange
        const mockTemplates: Array<IMailTemplate> = [
            {
                key: 'AuthRegister',
                subject: 'Default',
                htmlBody: '<h1>Default</h1>',
                txtBody: 'Default text',
            },
            {
                key: 'AuthRegister',
                locale: 'en',
                subject: 'English',
                htmlBody: '<h1>English</h1>',
                txtBody: 'English text',
            },
        ];

        const repository: IMailTemplateRepository = {
            findAll: vi.fn().mockResolvedValue(mockTemplates),
            findByKey: vi.fn(),
            upsert: vi.fn(),
            delete: vi.fn(),
        };

        const strategy = new DatabaseTemplateFetchStrategy(repository);

        // act
        const result = await strategy.load();

        // assert
        expect(result['AuthRegister'].subject).toBe('Default');
        expect(result['AuthRegister'].html).toBe('<h1>Default</h1>');
        expect(result['AuthRegister'].txt).toBe('Default text');
    });

    it('should call findAll on the repository exactly once', async () => {
        // arrange
        const repository: IMailTemplateRepository = {
            findAll: vi.fn().mockResolvedValue([]),
            findByKey: vi.fn(),
            upsert: vi.fn(),
            delete: vi.fn(),
        };

        const strategy = new DatabaseTemplateFetchStrategy(repository);

        // act
        await strategy.load();

        // assert
        expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
});

// #endregion
