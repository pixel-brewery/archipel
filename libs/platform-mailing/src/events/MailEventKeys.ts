// #region Imports

import { createEventKey } from '@pixel-brewery/archipel-platform-core';
import { IMailEvents } from './IMailEvents.js';

// #endregion

/**
 * Event key registry for the mail domain events.
 *
 * @public
 */
export const SEND_MAIL_EVENT_KEY = createEventKey<IMailEvents, 'sendMail'>('sendMail');
