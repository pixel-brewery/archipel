// #region Imports

import { IEventMap } from '@pixel-brewery/archipel-platform-core';

// #endregion

/**
 * Represents the contract of events emitted by the mail domain.
 *
 * Publishers only need to specify `recipientEmail`, `templateName`, and `templateParams`.
 * The subject is resolved from the stored template (industry-standard behavior).
 * An explicit `subject` can be provided as an override.
 *
 * @public
 */
export interface IMailEvents extends IEventMap {
    sendMail: {
        /** Recipient email address. */
        recipientEmail: string;
        /** Template key to resolve (e.g. `'AuthRegister'`). */
        templateName: string;
        /** Placeholder values to interpolate into subject and body. */
        templateParams: Record<string, string | number | boolean | Date | undefined | null>;
        /** Optional locale for template resolution (e.g. `'de'`, `'en'`). */
        locale?: string;
        /** Optional subject override. When omitted, resolved from the template. */
        subject?: string;
        /** Optional sender email override. When omitted, uses the configured default. */
        senderEmail?: string;
    };
}
