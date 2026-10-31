// #region Imports

import { EventHub, maskSensitive } from '@pixel-brewery/archipel-platform-core';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Subscription } from 'rxjs';
import { MailService } from '../../services/MailService.js';
import { IMailEvents } from '../IMailEvents.js';
import { SEND_MAIL_EVENT_KEY } from '../MailEventKeys.js';

// #endregion

/**
 * Bridges verification email events to the {@link MailService} delivery workflow.
 *
 * @public
 */
@Injectable()
export class MailEventSubscriber implements OnModuleDestroy {
    // #region Fields

    private readonly _mailService: MailService;
    private readonly _subscription: Subscription;
    private readonly _logger = new Logger(MailEventSubscriber.name);

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the {@link MailEventSubscriber} class.
     *
     * @public
     * @param mailService The mail service responsible for delivering messages.
     * @param eventHub The shared event hub that emits verification email requests.
     */
    public constructor(mailService: MailService, eventHub: EventHub) {
        this._mailService = mailService;
        this._subscription = eventHub.observe(SEND_MAIL_EVENT_KEY).subscribe({
            next: (payload) => {
                this._logger.debug(
                    `Received mail event for recipient ${maskSensitive(payload.recipientEmail)} ` +
                        `with template "${payload.templateName}"${payload.subject ? ` (subject override: "${maskSensitive(payload.subject)}")` : ''}`,
                );
                void this.handle(payload);
            },
            error: (err) => {
                this._logger.error('Error handling mail event', err);
            },
        });
    }

    // #endregion

    // #region Methods

    /**
     * Releases the event subscription when the enclosing module is destroyed.
     *
     * @public
     */
    public onModuleDestroy(): void {
        this._subscription.unsubscribe();
    }

    /**
     * Handles the incoming verification email event by delegating to the mail service.
     *
     * @private
     * @param payload The event payload containing email details.
     * @returns A promise that resolves when the email has been sent.
     */
    private async handle(payload: IMailEvents['sendMail']): Promise<void> {
        await this._mailService.sendTemplate(
            {
                from: payload.senderEmail,
                to: payload.recipientEmail,
                subject: payload.subject,
            },
            {
                templateName: payload.templateName,
                templateParams: payload.templateParams,
            },
        );
    }

    // #endregion
}
