// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { MAIL_SENDGRID_API_KEY } from '../../../env.js';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * Delivers emails via the SendGrid API.
 *
 * @public
 */
@Injectable()
export class SendGridDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(SendGridDeliveryStrategy.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `SendGridDeliveryStrategy` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        super();

        sgMail.setApiKey(configService.get(MAIL_SENDGRID_API_KEY.key));
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email using the SendGrid transport.
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
            const sendPromise = sgMail.send({
                from,
                to,
                subject,
                ...(isHtml ? { html: content } : { text: content }),
            });
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new Error('SendGrid send timed out after 5000ms')), 5_000);
            });
            await Promise.race([sendPromise, timeoutPromise]);

            this._logger.log('Email sent successfully', 'Mail');
        } catch (error) {
            this._logger.error('Error sending email:', error);
            throw new MailDeliveryError('sendgrid', 'Failed to send email via SendGrid', error);
        }
    }

    // #endregion
}
