// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type Profile, Strategy } from 'passport-github2';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { SocialAuthBase } from '../abstracts/SocialAuthBase.js';
import { AUTH_GITHUB_CALLBACK_URL, AUTH_GITHUB_CLIENT_ID, AUTH_GITHUB_CLIENT_SECRET, AUTH_GITHUB_SCOPE, AUTH_GITHUB_STATE } from '../env.js';
import { ConnectorBase } from './abstracts/ConnectorBase.js';

// #endregion

@Injectable()
export class GithubConnector extends ConnectorBase(Strategy, 'github') {
    // #region Fields

    private readonly _socialAuth: SocialAuthBase;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `GithubConnector` class.
     *
     * @public
     * @param socialAuth Social auth abstract base instance.
     * @param configService Configuration service instance.
     */
    public constructor(socialAuth: SocialAuthBase, configService: ConfigService) {
        const scope = configService
            .tryGet(AUTH_GITHUB_SCOPE.key, 'user:email')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);

        const state = configService.tryGet(AUTH_GITHUB_STATE.key, 'true').toLowerCase() !== 'false';

        super({
            clientID: configService.get(AUTH_GITHUB_CLIENT_ID.key),
            clientSecret: configService.get(AUTH_GITHUB_CLIENT_SECRET.key),
            callbackURL: configService.tryGet(AUTH_GITHUB_CALLBACK_URL.key, '/auth/github/callback'),
            scope: scope,
            state: state,
        });

        this._socialAuth = socialAuth;
    }

    // #endregion

    // #region Methods

    /**
     * @public
     */
    public override async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<IAuthSubject> {
        const email = profile.emails?.[0]?.value;

        if (!email) {
            throw new UnauthorizedException('No email provided from GitHub');
        }

        const displayName = profile.displayName || profile.username;

        if (!displayName) {
            throw new UnauthorizedException('No display name provided from GitHub');
        }

        const user = await this._socialAuth.findOrCreateByProfile({
            provider: 'github',
            email: email,
            userName: profile.username ?? null,
            displayName: displayName,
        });

        return user;
    }

    // #endregion
}
