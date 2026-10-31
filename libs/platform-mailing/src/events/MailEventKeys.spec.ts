import { describe, expect, it } from 'vitest';
import { SEND_MAIL_EVENT_KEY } from './MailEventKeys.js';

describe('SEND_MAIL_EVENT_KEY', () => {
    it('uses the sendMail event name', () => {
        expect(SEND_MAIL_EVENT_KEY.event).toBe('sendMail');
    });

    it('keeps branded event key shape', () => {
        expect(SEND_MAIL_EVENT_KEY._brand).toBe('EventKey');
    });
});
