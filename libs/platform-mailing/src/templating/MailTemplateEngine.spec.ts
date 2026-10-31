import type { ContentTemplateEngine } from '@pixel-brewery/archipel-platform-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IMailTemplateVariants } from '../models/IMailTemplateVariants.js';
import { MailTemplateEngine } from './MailTemplateEngine.js';
import type { TemplateFetchStrategyBase } from './strategies/abstracts/TemplateFetchStrategyBase.js';

describe('MailTemplateEngine', () => {
    // #region Fields

    let engine: MailTemplateEngine;
    let fetchStrategyMock: Partial<TemplateFetchStrategyBase>;
    let contentTemplateEngineMock: Partial<ContentTemplateEngine>;

    // #endregion

    // #region Methods

    beforeEach(async () => {
        vi.restoreAllMocks();

        const templates: Record<string, IMailTemplateVariants> = {
            welcome: {
                subject: 'Welcome {{name}}!',
                html: '<h1>Hello {{name}}</h1>',
                txt: 'Hello {{name}}',
            },
            noSubject: {
                html: '<p>Body only</p>',
            },
        };

        fetchStrategyMock = {
            load: vi.fn().mockResolvedValue(templates),
        };

        contentTemplateEngineMock = {
            compileTemplate: vi.fn().mockImplementation((tpl: string) => tpl.replace('{{name}}', 'Alice')),
        };

        engine = new MailTemplateEngine(fetchStrategyMock as TemplateFetchStrategyBase, contentTemplateEngineMock as ContentTemplateEngine);

        await engine.onModuleInit();
    });

    it('should load templates on module init', () => {
        // assert
        expect(fetchStrategyMock.load).toHaveBeenCalledOnce();
    });

    it('should compile an HTML template', () => {
        // act
        const result = engine.compileTemplate('welcome', { name: 'Alice' }, 'html');

        // assert
        expect(contentTemplateEngineMock.compileTemplate).toHaveBeenCalledWith('<h1>Hello {{name}}</h1>', {
            name: 'Alice',
        });
        expect(result).toBe('<h1>Hello Alice</h1>');
    });

    it('should compile a text template', () => {
        // act
        const result = engine.compileTemplate('welcome', { name: 'Alice' }, 'txt');

        // assert
        expect(result).toBe('Hello Alice');
    });

    it('should throw when template format is not found', () => {
        // act & assert
        expect(() => engine.compileTemplate('nonexistent', {}, 'html')).toThrow();
    });

    it('should resolve subject from a template', () => {
        // act
        const result = engine.resolveSubject('welcome', { name: 'Alice' });

        // assert
        expect(contentTemplateEngineMock.compileTemplate).toHaveBeenCalledWith('Welcome {{name}}!', { name: 'Alice' });
        expect(result).toBe('Welcome Alice!');
    });

    it('should return undefined when template has no subject', () => {
        // act
        const result = engine.resolveSubject('noSubject', {});

        // assert
        expect(result).toBeUndefined();
    });

    it('should return undefined when template key does not exist', () => {
        // act
        const result = engine.resolveSubject('nonexistent', {});

        // assert
        expect(result).toBeUndefined();
    });

    // #endregion
});
