// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Strategy } from 'passport-custom';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SEED_ANONYMOUS_USERNAME } from '../env.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

/**
 * Anonymous connector for temporary user login.
 *
 * @public
 */
@Injectable()
export class AnonymousConnector extends ConnectorBase(Strategy, 'anonymous') {
    // #region Fields

    private readonly _authSubject: AuthSubjectBase;
    private readonly _configService: ConfigService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `AnonymousConnector` class.
     *
     * @public
     * @param authSubject Auth subject abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(authSubject: AuthSubjectBase, configService: ConfigService) {
        super();

        this._authSubject = authSubject;
        this._configService = configService;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the authentication credentials.
     *
     * @public
     * @returns The authenticated user and this is also later available in the request.user object
     */
    public override async validate(): Promise<IAuthSubject> {
        const user = await this._authSubject.findAnonymous(this._configService.get(SEED_ANONYMOUS_USERNAME.key));

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    // #endregion
}
