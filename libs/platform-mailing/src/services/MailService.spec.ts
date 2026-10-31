import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MailTemplateEngine } from '../templating/MailTemplateEngine.js';
import { MailService } from './MailService.js';
import type { DeliveryStrategyBase } from '../delivering/strategies/abstracts/DeliveryStrategyBase.js';

describe('MailService', () => {
    // #region Fields

    let service: MailService;
    let deliveryStrategyMock: Partial<DeliveryStrategyBase>;
    let mailTemplateEngineMock: Partial<MailTemplateEngine>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        const configServiceMock: Partial<ConfigService> = {
            get: vi.fn().mockImplementation((key: string) => {
                if (key === 'MAIL_SENDER_EMAIL') return 'noreply@test.com';
                if (key === 'MAIL_TEMPLATE_ENGINE_FORMAT') return 'html';
                return '';
            }),
        };

        deliveryStrategyMock = {
            send: vi.fn().mockResolvedValue(undefined),
        };

        mailTemplateEngineMock = {
            compileTemplate: vi.fn().mockReturnValue('<h1>Hello</h1>'),
            resolveSubject: vi.fn().mockReturnValue('Resolved Subject'),
        };

        service = new MailService(
            configServiceMock as ConfigService,
            mailTemplateEngineMock as MailTemplateEngine,
            deliveryStrategyMock as DeliveryStrategyBase,
        );
    });

    it('should send plain text email', async () => {
        // act
        await service.send({ to: 'user@example.com', subject: 'Test' }, 'Hello World', false);

        // assert
        expect(deliveryStrategyMock.send).toHaveBeenCalledWith('noreply@test.com', 'user@example.com', 'Test', 'Hello World', false, undefined);
    });

    it('should use custom from address when provided', async () => {
        // act
        await service.send({ from: 'custom@example.com', to: 'user@example.com', subject: 'Test' }, 'Hello', false);

        // assert
        expect(deliveryStrategyMock.send).toHaveBeenCalledWith('custom@example.com', 'user@example.com', 'Test', 'Hello', false, undefined);
    });

    it('should throw for invalid recipient email', async () => {
        // act & assert
        await expect(service.send({ to: 'not-an-email', subject: 'Test' }, 'Hello', false)).rejects.toThrow("Invalid email address: 'not-an-email'");
    });

    it('should throw for invalid sender email', async () => {
        // act & assert
        await expect(service.send({ from: 'bad-from', to: 'user@example.com', subject: 'Test' }, 'Hello', false)).rejects.toThrow(
            "Invalid email address: 'bad-from'",
        );
    });

    it('should send a template email', async () => {
        // act
        await service.sendTemplate({ to: 'user@example.com', subject: 'Welcome' }, { templateName: 'welcome', templateParams: { name: 'Alice' } });

        // assert
        expect(mailTemplateEngineMock.compileTemplate).toHaveBeenCalledWith('welcome', { name: 'Alice' }, 'html');
        expect(deliveryStrategyMock.send).toHaveBeenCalledWith('noreply@test.com', 'user@example.com', 'Welcome', '<h1>Hello</h1>', true, undefined);
    });

    it('should resolve subject from template when not provided', async () => {
        // act
        await service.sendTemplate({ to: 'user@example.com' }, { templateName: 'welcome', templateParams: { name: 'Alice' } });

        // assert
        expect(mailTemplateEngineMock.resolveSubject).toHaveBeenCalledWith('welcome', { name: 'Alice' });
        expect(deliveryStrategyMock.send).toHaveBeenCalledWith('noreply@test.com', 'user@example.com', 'Resolved Subject', '<h1>Hello</h1>', true, undefined);
    });

    it('should throw when no subject is provided and template has no subject', async () => {
        // arrange
        (mailTemplateEngineMock.resolveSubject as ReturnType<typeof vi.fn>).mockReturnValue(undefined);

        // act & assert
        await expect(service.sendTemplate({ to: 'user@example.com' }, { templateName: 'noSubject', templateParams: {} })).rejects.toThrow(
            "No subject provided and template 'noSubject' has no stored subject.",
        );
    });

    it('should throw for invalid template format in config', () => {
        // arrange
        const badConfigMock: Partial<ConfigService> = {
            get: vi.fn().mockImplementation((key: string) => {
                if (key === 'MAIL_SENDER_EMAIL') return 'noreply@test.com';
                if (key === 'MAIL_TEMPLATE_ENGINE_FORMAT') return 'xml';
                return '';
            }),
        };

        // act & assert
        expect(
            () => new MailService(badConfigMock as ConfigService, mailTemplateEngineMock as MailTemplateEngine, deliveryStrategyMock as DeliveryStrategyBase),
        ).toThrow('Invalid email template format: xml');
    });

    describe('header injection prevention', () => {
        it('should strip carriage return from subject', async () => {
            // act
            await service.send({ to: 'user@example.com', subject: 'Test\rBcc: hacker@evil.com' }, 'Hello', false);

            // assert
            expect(deliveryStrategyMock.send).toHaveBeenCalledWith(
                'noreply@test.com',
                'user@example.com',
                'Test Bcc: hacker@evil.com',
                'Hello',
                false,
                undefined,
            );
        });

        it('should strip newline from subject', async () => {
            // act
            await service.send({ to: 'user@example.com', subject: 'Test\nBcc: hacker@evil.com' }, 'Hello', false);

            // assert
            expect(deliveryStrategyMock.send).toHaveBeenCalledWith(
                'noreply@test.com',
                'user@example.com',
                'Test Bcc: hacker@evil.com',
                'Hello',
                false,
                undefined,
            );
        });

        it('should strip CRLF sequence from subject', async () => {
            // act
            await service.send({ to: 'user@example.com', subject: 'Test\r\nBcc: hacker@evil.com' }, 'Hello', false);

            // assert
            expect(deliveryStrategyMock.send).toHaveBeenCalledWith(
                'noreply@test.com',
                'user@example.com',
                'Test  Bcc: hacker@evil.com',
                'Hello',
                false,
                undefined,
            );
        });
    });

    // #endregion
});
