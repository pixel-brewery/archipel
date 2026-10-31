// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Inject, Injectable } from '@nestjs/common';
import { DeliveryStrategyBase } from '../delivering/strategies/abstracts/DeliveryStrategyBase.js';
import { MAIL_SENDER_EMAIL, MAIL_TEMPLATE_ENGINE_FORMAT } from '../env.js';
import { ALLOWED_ATTACHMENT_MIME_TYPES, type IMailAttachment, MAX_ATTACHMENT_SIZE_BYTES } from '../models/IMailAttachment.js';
import { MailTemplateFormat } from '../models/MailTemplateFormat.js';
import { MailTemplateEngine } from '../templating/MailTemplateEngine.js';
import { MAIL_DELIVERY_STRATEGY_TOKEN } from '../tokens/MailTokens.js';

// #endregion

/**
 * Represents the `MailService` class.
 *
 * @public
 */
@Injectable()
export class MailService {
    // #region Fields

    private readonly _mailTemplateEngine: MailTemplateEngine;
    private readonly _deliveryStrategy: DeliveryStrategyBase;
    private readonly _mailTemplateFormat: MailTemplateFormat;
    private readonly _defaultFrom: string;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `MailService` class.
     *
     * @public
     */
    public constructor(
        configService: ConfigService,
        mailTemplateEngine: MailTemplateEngine,
        @Inject(MAIL_DELIVERY_STRATEGY_TOKEN) deliveryStrategy: DeliveryStrategyBase,
    ) {
        this._mailTemplateEngine = mailTemplateEngine;
        this._deliveryStrategy = deliveryStrategy;

        this._defaultFrom = configService.get(MAIL_SENDER_EMAIL.key);
        const templateFormat = configService.get(MAIL_TEMPLATE_ENGINE_FORMAT.key);
        if (templateFormat !== 'html' && templateFormat !== 'txt') {
            throw new Error(`Invalid email template format: ${templateFormat}. Supported formats are 'html' or 'txt'.`);
        }
        this._mailTemplateFormat = templateFormat;
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email with either plain text or HTML content.
     *
     * @public
     * @param mailOptions.from - Sender's email address (optional, defaults to config)
     * @param mailOptions.to - Recipient's email address
     * @param mailOptions.subject - Subject of the email
     * @param content - Email body content (plain text or HTML)
     * @param isHtml - Flag to indicate whether the email is HTML (true) or plain text (false)
     */
    public async send(
        mailOptions: {
            from?: string;
            to: string;
            subject: string;
        },
        content: string,
        isHtml: boolean,
        attachments?: Array<IMailAttachment>,
    ): Promise<void> {
        this.ensureValidEmail(mailOptions.to);
        if (mailOptions.from) {
            this.ensureValidEmail(mailOptions.from);
        }
        if (attachments) {
            this.validateAttachments(attachments);
        }
        const sender = mailOptions.from ?? this._defaultFrom;
        const sanitizedSubject = mailOptions.subject.replace(/[\r\n]/g, ' ');

        await this._deliveryStrategy.send(sender, mailOptions.to, sanitizedSubject, content, isHtml, attachments);
    }

    /**
     * Sends an email using a predefined template (HTML or text).
     * Automatically uses the template format (either 'html' or 'txt') based on the environment variable.
     *
     * When no `subject` is provided in `mailOptions`, the subject is resolved from the
     * stored template and interpolated with the given `templateParams` (industry-standard
     * behavior matching Mailchimp/SendGrid/Postmark).
     *
     * @public
     * @param mailOptions.from - Sender's email address (optional, defaults to config)
     * @param mailOptions.to - Recipient's email address
     * @param mailOptions.subject - Subject of the email (optional — resolved from template if omitted)
     * @param templateOptions.templateName - Name of the template to be used
     * @param templateOptions.templateParams - Parameters to inject into the template
     */
    public async sendTemplate(
        mailOptions: {
            from?: string;
            to: string;
            subject?: string;
        },
        templateOptions: {
            templateName: string;
            templateParams: Record<string, string | number | boolean | Date | undefined | null>;
        },
    ): Promise<void> {
        const content = this._mailTemplateEngine.compileTemplate(templateOptions.templateName, templateOptions.templateParams, this._mailTemplateFormat);
        const isHtml = this._mailTemplateFormat === 'html';

        const subject = mailOptions.subject ?? this._mailTemplateEngine.resolveSubject(templateOptions.templateName, templateOptions.templateParams);

        if (!subject) {
            throw new Error(
                `No subject provided and template '${templateOptions.templateName}' has no stored subject. ` +
                    'Either pass a subject in mailOptions or ensure the template includes a subject.',
            );
        }

        await this.send({ from: mailOptions.from, to: mailOptions.to, subject }, content, isHtml);
    }

    /**
     * Performs a minimal email address validation. Not exhaustive but filters obvious mistakes.
     * @param email The email address to validate.
     * @throws Error if the format is invalid.
     */
    private ensureValidEmail(email: string): void {
        // Rejects leading/trailing dots, consecutive dots, and requires valid domain structure.
        const emailRegex = /^[A-Z0-9](?:[A-Z0-9._%+-]*[A-Z0-9])?@[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?)*\.[A-Z]{2,}$/i;
        if (!emailRegex.test(email) || email.includes('..')) {
            throw new Error(`Invalid email address: '${email}'`);
        }
    }

    /**
     * Validates email attachments against MIME-type allowlist and size limits.
     *
     * @param attachments - Array of attachments to validate
     * @throws Error if any attachment violates constraints
     */
    private validateAttachments(attachments: Array<IMailAttachment>): void {
        for (const attachment of attachments) {
            if (!ALLOWED_ATTACHMENT_MIME_TYPES.includes(attachment.contentType as (typeof ALLOWED_ATTACHMENT_MIME_TYPES)[number])) {
                throw new Error(`Unsupported attachment MIME type: '${attachment.contentType}'`);
            }
            const size = typeof attachment.content === 'string' ? Buffer.byteLength(attachment.content, 'utf-8') : attachment.content.length;
            if (size > MAX_ATTACHMENT_SIZE_BYTES) {
                throw new Error(`Attachment '${attachment.filename}' exceeds maximum size of ${MAX_ATTACHMENT_SIZE_BYTES} bytes`);
            }
        }
    }

    // #endregion
}
