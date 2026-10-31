// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthSubjectBase } from '../abstracts/AuthSubjectBase.js';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { AUTH_JWT_SECRET } from '../env.js';
import { JwtPayloadBase } from '../models/abstracts/JwtPayloadBase.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

/**
 * JWT connector for handling token validation.
 */
@Injectable()
export class JwtConnector extends ConnectorBase(Strategy) {
    // #region Fields

    private readonly _authSubject: AuthSubjectBase;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `JwtConnector` class.
     *
     * @public
     * @param authSubject Auth subject abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(authSubject: AuthSubjectBase, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // Optional: Allow or disallow expired tokens
            secretOrKey: configService.get(AUTH_JWT_SECRET.key), // The secret used for signing tokens
        });

        this._authSubject = authSubject;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the authentication credentials.
     *
     * @public
     * @param payload The decoded JWT payload
     * @returns The authenticated user and this is also later available in the request.user object
     */
    public override async validate(payload: JwtPayloadBase): Promise<IAuthSubject> {
        const user = await this._authSubject.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException('Invalid token subject');
        }

        return user;
    }

    // #endregion
}
