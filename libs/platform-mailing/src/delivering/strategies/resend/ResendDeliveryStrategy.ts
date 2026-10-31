// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { MAIL_RESEND_API_KEY } from '../../../env.js';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * Delivers emails via the Resend API.
 *
 * @public
 */
@Injectable()
export class ResendDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(ResendDeliveryStrategy.name);
    private readonly _resendClient: Resend;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `ResendDeliveryStrategy` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        super();

        this._resendClient = new Resend(configService.get(MAIL_RESEND_API_KEY.key));
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email using the Resend transport.
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
            const sendPromise = this._resendClient.emails.send({
                from,
                to,
                subject,
                ...(isHtml ? { html: content } : { text: content }),
            });
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new Error('Resend send timed out after 5000ms')), 5_000);
            });
            await Promise.race([sendPromise, timeoutPromise]);

            this._logger.log('Email sent successfully', 'Mail');
        } catch (error) {
            this._logger.error('Error sending email:', error);
            throw new MailDeliveryError('resend', 'Failed to send email via Resend', error);
        }
    }

    // #endregion
}
