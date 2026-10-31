// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MAIL_SMTP_HOST, MAIL_SMTP_PASSWORD, MAIL_SMTP_USER } from '../env.js';

// #endregion

/**
 * Verifies SMTP server connectivity. Does **not** validate individual email
 * addresses — only checks whether the configured SMTP transport is reachable.
 *
 * @public
 */
@Injectable()
export class SmtpConnectionVerifier {
    // #region Fields

    private readonly _logger: Logger = new Logger(SmtpConnectionVerifier.name);
    private readonly _transporter: nodemailer.Transporter;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the {@link SmtpConnectionVerifier} class.
     *
     * @public
     */
    public constructor(configService: ConfigService) {
        this._transporter = nodemailer.createTransport({
            host: configService.tryGet(MAIL_SMTP_HOST.key, 'localhost'),
            port: 465,
            secure: true,
            auth: {
                user: configService.tryGet(MAIL_SMTP_USER.key, ''),
                pass: configService.tryGet(MAIL_SMTP_PASSWORD.key, ''),
            },
        });
    }

    // #endregion

    // #region Methods

    /**
     * Verifies that the configured SMTP server is reachable.
     *
     * @public
     * @returns `true` if the SMTP server is reachable, `false` otherwise.
     */
    public async verifyConnection(): Promise<boolean> {
        return new Promise((resolve) => {
            this._transporter.verify((error, success) => {
                if (error) {
                    this._logger.error('SMTP verification error:', error);
                    resolve(false);

                    return;
                }

                resolve(!!success);
            });
        });
    }

    /**
     * Send an email for testing purposes.
     *
     * @public
     */
    public async sendTestEmail(from: string, to: string, subject: string, text: string): Promise<void> {
        await this._transporter.sendMail({
            from,
            to,
            subject,
            text,
        });
    }

    // #endregion
}
