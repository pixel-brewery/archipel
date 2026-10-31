// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Profile, Strategy } from 'passport-google-oauth20';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { AUTH_GOOGLE_CALLBACK_URL, AUTH_GOOGLE_CLIENT_ID, AUTH_GOOGLE_CLIENT_SECRET, AUTH_GOOGLE_SCOPE, AUTH_GOOGLE_STATE } from '../env.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

/**
 * The `GoogleConnector` integrates Google OAuth authentication.
 *
 * @public
 */
@Injectable()
export class GoogleConnector extends ConnectorBase(Strategy, 'google') {
    // #region Fields

    private readonly _socialAuth: SocialAuthBase;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `GoogleConnector` class.
     *
     * @public
     * @param socialAuth Social auth abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(socialAuth: SocialAuthBase, configService: ConfigService) {
        const scope = configService
            .tryGet(AUTH_GOOGLE_SCOPE.key, 'email,profile')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const state = configService.tryGet(AUTH_GOOGLE_STATE.key, 'true').toLowerCase() !== 'false';

        super({
            clientID: configService.get(AUTH_GOOGLE_CLIENT_ID.key),
            clientSecret: configService.get(AUTH_GOOGLE_CLIENT_SECRET.key),
            callbackURL: configService.tryGet(AUTH_GOOGLE_CALLBACK_URL.key, '/auth/google/callback'),
            scope: scope,
            state: state,
        });

        this._socialAuth = socialAuth;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the Google authentication payload.
     *
     * @public
     * @param accessToken OAuth access token.
     * @param refreshToken OAuth refresh token.
     * @param profile Google profile data.
     * @returns The authenticated user.
     */
    public override async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<IAuthSubject> {
        void accessToken;
        void refreshToken;

        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new UnauthorizedException('No email provided from Google');
        }

        const displayName = profile.displayName ?? profile.name?.givenName ?? profile.name?.familyName;

        if (!displayName) {
            throw new UnauthorizedException('No display name provided from Google');
        }

        const userName = profile.username ?? email.split('@')[0];

        const user = await this._socialAuth.findOrCreateByProfile({
            provider: 'google',
            email: email,
            userName: userName,
            displayName: displayName,
        });

        return user;
    }

    // #endregion
}
