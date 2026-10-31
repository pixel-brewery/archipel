// #region Imports

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

// #endregion

@Injectable()
export class SessionSerializer extends PassportSerializer {
    // #region Methods

    public serializeUser(user: unknown, done: (err: Error | null, user: unknown) => void): void {
        done(null, user);
    }

    public deserializeUser(payload: string, done: (err: Error | null, payload: string) => void): void {
        done(null, payload);
    }

    // #endregion
}
