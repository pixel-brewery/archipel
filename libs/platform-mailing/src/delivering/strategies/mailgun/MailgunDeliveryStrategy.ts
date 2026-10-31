// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import type { Interfaces } from 'mailgun.js/definitions';
import { MAIL_MAILGUN_API_KEY, MAIL_MAILGUN_DOMAIN } from '../../../env.js';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * Delivers emails via the Mailgun API.
 *
 * @public
 */
@Injectable()
export class MailgunDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(MailgunDeliveryStrategy.name);
    private readonly _mailgunClient: Interfaces.IMailgunClient;
    private readonly _domain: string;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `MailgunDeliveryStrategy` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        super();

        const mailgun = new Mailgun(FormData);
        this._mailgunClient = mailgun.client({
            username: 'api',
            key: configService.get(MAIL_MAILGUN_API_KEY.key),
        });
        this._domain = configService.get(MAIL_MAILGUN_DOMAIN.key);
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email using the Mailgun transport.
     *
     * @public
     * @param from - Sender's email address
     * @param to - Recipient's email address
     * @param subject - Subject of the email
     * @param content - Email body content (plain text or HTML)
     * @param isHtml - Flag to indicate whether the email is HTML (true) or plain text (false)
     */
    public async send(
        from: string,
        to: string,
        subject: string,
        content: string,
        isHtml: boolean,
        _attachments?: Array<import('../../../models/IMailAttachment.js').IMailAttachment>,
    ): Promise<void> {
        try {
            const sendPromise = this._mailgunClient.messages.create(this._domain, {
                from,
                to,
                subject,
                ...(isHtml ? { html: content } : { text: content }),
            });
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new Error('Mailgun send timed out after 5000ms')), 5_000);
            });
            await Promise.race([sendPromise, timeoutPromise]);

            this._logger.log('Email sent successfully', 'Mail');
        } catch (error) {
            this._logger.error('Error sending email:', error);
            throw new MailDeliveryError('mailgun', 'Failed to send email via Mailgun', error);
        }
    }

    // #endregion
}
