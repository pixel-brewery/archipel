// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Profile as PassportProfile } from 'passport';
import { Strategy } from 'passport-apple';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import {
    AUTH_APPLE_CALLBACK_URL,
    AUTH_APPLE_CLIENT_ID,
    AUTH_APPLE_KEY_ID,
    AUTH_APPLE_PRIVATE_KEY,
    AUTH_APPLE_SCOPE,
    AUTH_APPLE_STATE,
    AUTH_APPLE_TEAM_ID,
} from '../env.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

type IAppleProfile = PassportProfile & { email?: string };

/**
 * The `AppleConnector` integrates Apple Sign In authentication.
 *
 * @public
 */
@Injectable()
export class AppleConnector extends ConnectorBase(Strategy, 'apple') {
    // #region Fields

    private readonly _socialAuth: SocialAuthBase;

    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `AppleConnector` class.
     *
     * @public
     * @param socialAuth Social auth abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(socialAuth: SocialAuthBase, configService: ConfigService) {
        const rawPrivateKey = configService.get(AUTH_APPLE_PRIVATE_KEY.key);
        const normalizedPrivateKey = rawPrivateKey.replace(/\r/g, '').replace(/\\n/g, '\n');
        const scope = configService
            .tryGet(AUTH_APPLE_SCOPE.key, 'name,email')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const state = configService.tryGet(AUTH_APPLE_STATE.key, 'true').toLowerCase() !== 'false';

        super({
            clientID: configService.get(AUTH_APPLE_CLIENT_ID.key),
            teamID: configService.get(AUTH_APPLE_TEAM_ID.key),
            keyID: configService.get(AUTH_APPLE_KEY_ID.key),
            callbackURL: configService.tryGet(AUTH_APPLE_CALLBACK_URL.key, '/auth/apple/callback'),
            privateKeyString: normalizedPrivateKey,
            scope: scope,
            state: state,
        });

        this._socialAuth = socialAuth;
    }

    // #endregion

    // #region Methods

    /**
     * Validates the Apple authentication payload.
     *
     * @public
     * @param accessToken OAuth access token.
     * @param refreshToken OAuth refresh token.
     * @param idToken Apple identity token.
     * @param profile Apple profile data.
     * @returns The authenticated user.
     */
    public override async validate(accessToken: string, refreshToken: string, idToken: string, profile: IAppleProfile): Promise<IAuthSubject> {
        void accessToken;
        void refreshToken;
        void idToken;

        const email = profile.emails?.[0]?.value ?? profile.email ?? null;

        if (!email) {
            throw new UnauthorizedException('No email provided from Apple');
        }

        const displayName = profile.displayName ?? profile.name?.givenName ?? profile.name?.familyName ?? email.split('@')[0];

        if (!displayName) {
            throw new UnauthorizedException('No display name provided from Apple');
        }

        const userName = profile.username ?? email.split('@')[0];

        const user = await this._socialAuth.findOrCreateByProfile({
            provider: 'apple',
            email: email,
            userName: userName,
            displayName: displayName,
        });

        return user;
    }

    // #endregion
}
