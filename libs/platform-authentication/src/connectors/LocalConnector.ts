// #region Imports

import { BcryptService } from '@pixel-brewery/archipel-platform-cryptography';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

/**
 * Local connector for user name and password login.
 *
 * @public
 */
@Injectable()
export class LocalConnector extends ConnectorBase(Strategy) {
    // #region Fields

    private readonly _authSubject: AuthSubjectBase;
    private readonly _bcryptService: BcryptService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `LocalConnector` class.
     *
     * @public
     * @param authSubject Auth subject abstract base instance.
     * @param bcryptService Bcrypt service instance.
     */
    public constructor(authSubject: AuthSubjectBase, bcryptService: BcryptService) {
        super();

        this._authSubject = authSubject;
        this._bcryptService = bcryptService;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the authentication credentials.
     *
     * @public
     * @param userName The user name
     * @param password The password
     * @returns The authenticated user and this is also later available in the request.user object
     */
    public override async validate(userName: string, password: string): Promise<IAuthSubject> {
        const user = await this._authSubject.findByLogin(userName);

        if (!user || !user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this._bcryptService.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }

    // #endregion
}
