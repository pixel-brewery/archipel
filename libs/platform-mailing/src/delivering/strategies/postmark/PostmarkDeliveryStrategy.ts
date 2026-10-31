// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { ServerClient } from 'postmark';
import { MAIL_POSTMARK_API_KEY } from '../../../env.js';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * The `PostmarkDeliveryStrategy` class.
 *
 * @public
 */
@Injectable()
export class PostmarkDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(PostmarkDeliveryStrategy.name);
    private readonly _postmarkClient: ServerClient;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `PostmarkDeliveryStrategy` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        super();

        this._postmarkClient = new ServerClient(configService.get(MAIL_POSTMARK_API_KEY.key));
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email using the Postmark transport.
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
            const sendPromise = this._postmarkClient.sendEmail({
                From: from,
                To: to,
                Subject: subject,
                ...(isHtml ? { HtmlBody: content } : { TextBody: content }),
            });
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new Error('Postmark send timed out after 5000ms')), 5_000);
            });
            await Promise.race([sendPromise, timeoutPromise]);

            this._logger.log('Email sent successfully', 'Mail');
        } catch (error) {
            this._logger.error('Error sending email:', error);
            throw new MailDeliveryError('postmark', 'Failed to send email via Postmark', error);
        }
    }

    // #endregion
}
