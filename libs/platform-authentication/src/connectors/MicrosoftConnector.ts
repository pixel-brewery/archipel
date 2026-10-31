// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Profile as PassportProfile } from 'passport';
import { Strategy } from 'passport-microsoft';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import {
    AUTH_MICROSOFT_CALLBACK_URL,
    AUTH_MICROSOFT_CLIENT_ID,
    AUTH_MICROSOFT_CLIENT_SECRET,
    AUTH_MICROSOFT_SCOPE,
    AUTH_MICROSOFT_STATE,
    AUTH_MICROSOFT_TENANT,
} from '../env.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

/**
 * The `MicrosoftConnector` integrates Microsoft OAuth authentication.
 *
 * @public
 */
@Injectable()
export class MicrosoftConnector extends ConnectorBase(Strategy, 'microsoft') {
    // #region Fields

    private readonly _socialAuth: SocialAuthBase;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `MicrosoftConnector` class.
     *
     * @public
     * @param socialAuth Social auth abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(socialAuth: SocialAuthBase, configService: ConfigService) {
        const scope = configService
            .tryGet(AUTH_MICROSOFT_SCOPE.key, 'user.read')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const state = configService.tryGet(AUTH_MICROSOFT_STATE.key, 'true').toLowerCase() !== 'false';

        super({
            clientID: configService.get(AUTH_MICROSOFT_CLIENT_ID.key),
            clientSecret: configService.get(AUTH_MICROSOFT_CLIENT_SECRET.key),
            callbackURL: configService.tryGet(AUTH_MICROSOFT_CALLBACK_URL.key, '/auth/microsoft/callback'),
            tenant: configService.tryGet(AUTH_MICROSOFT_TENANT.key, 'common'),
            scope: scope,
            state: state,
        });

        this._socialAuth = socialAuth;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the Microsoft authentication payload.
     *
     * @public
     * @param accessToken OAuth access token.
     * @param refreshToken OAuth refresh token.
     * @param profile Microsoft profile data.
     * @returns The authenticated user.
     */
    public override async validate(accessToken: string, refreshToken: string, profile: PassportProfile): Promise<IAuthSubject> {
        void accessToken;
        void refreshToken;

        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new UnauthorizedException('No email provided from Microsoft');
        }

        const displayName = profile.displayName ?? profile.name?.givenName ?? profile.name?.familyName;

        if (!displayName) {
            throw new UnauthorizedException('No display name provided from Microsoft');
        }

        const userName = profile.username ?? email.split('@')[0];

        const user = await this._socialAuth.findOrCreateByProfile({
            provider: 'microsoft',
            email: email,
            userName: userName,
            displayName: displayName,
        });

        return user;
    }

    // #endregion
}
