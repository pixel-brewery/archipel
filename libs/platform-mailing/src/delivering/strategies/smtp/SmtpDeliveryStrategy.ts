// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { MAIL_SMTP_HOST, MAIL_SMTP_PASSWORD, MAIL_SMTP_PORT, MAIL_SMTP_SECURE, MAIL_SMTP_USER } from '../../../env.js';
import { MailDeliveryError } from '../../../errors/MailDeliveryError.js';
import { DeliveryStrategyBase } from '../abstracts/DeliveryStrategyBase.js';

// #endregion

/**
 * The `SmtpDeliveryStrategy` class.
 *
 * @public
 */
@Injectable()
export class SmtpDeliveryStrategy extends DeliveryStrategyBase {
    // #region Fields

    private readonly _logger: Logger = new Logger(SmtpDeliveryStrategy.name);
    private readonly _transporter: Transporter;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `LogDelivery` class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        super();

        const options = {
            host: configService.tryGet<string>(MAIL_SMTP_HOST.key, 'localhost'),
            port: configService.tryGet<number>(MAIL_SMTP_PORT.key, 587),
            secure: configService.tryGet<boolean>(MAIL_SMTP_SECURE.key, true),
            auth: {
                user: configService.tryGet<string>(MAIL_SMTP_USER.key, ''),
                pass: configService.tryGet<string>(MAIL_SMTP_PASSWORD.key, ''),
            },
        };

        this._transporter = createTransport(options);
    }

    // #endregion

    // #region Methods

    /**
     * Sends an email using the SMTP transport.
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
            const sendPromise = this._transporter.sendMail({
                from,
                to,
                subject,
                ...(isHtml ? { html: content } : { text: content }),
            });
            const timeoutPromise = new Promise<never>((_resolve, reject) => {
                setTimeout(() => reject(new Error('SMTP send timed out after 5000ms')), 5_000);
            });
            await Promise.race([sendPromise, timeoutPromise]);

            this._logger.log('Email sent successfully', 'Mail');
        } catch (error) {
            this._logger.error('Error sending email:', error);
            throw new MailDeliveryError('smtp', 'Failed to send email via SMTP', error);
        }
    }

    // #endregion
}
