// #region Imports

import { Inject, Injectable, Optional } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { TokenEnricherBase } from '../abstracts/TokenEnricherBase.js';

// #endregion

/**
 * Generic service responsible for creating JWT access tokens.
 * Builds a base payload from {@link IAuthSubject} and optionally enriches it
 * via the {@link TokenEnricherBase} with product-specific claims.
 *
 * @public
 */
@Injectable()
export class AuthTokenService {
    // #region Fields

    private readonly _jwtService: JwtService;
    private readonly _tokenEnricher: TokenEnricherBase | null;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `AuthTokenService` class.
     *
     * @public
     * @param jwtService - The NestJS JWT service.
     * @param tokenEnricher - Optional token enricher abstract base.
     */
    public constructor(jwtService: JwtService, @Optional() @Inject(TokenEnricherBase) tokenEnricher: TokenEnricherBase | null) {
        this._jwtService = jwtService;
        this._tokenEnricher = tokenEnricher ?? null;
    }

    // #endregion

    // #region Methods

    /**
     * Creates a signed JWT for the given subject and session.
     *
     * @remarks
     * The token carries the session identifier as the `sid` claim, which is how a request is tied
     * to a session. The token itself is never persisted, so the same session survives any number
     * of reissues and no client is rejected for still holding the previous token.
     *
     * Claims are assembled from the subject and then extended by the {@link TokenEnricherBase},
     * when one is registered. An enricher cannot remove `sid`, but it can overwrite it — do not.
     *
     * @public
     * @param subject - The authenticated subject.
     * @param sessionId - Identifier of the session the token belongs to, from
     * {@link SessionService.create}.
     * @returns The signed JWT access token.
     *
     * @example
     * ```typescript
     * const { session, refreshToken } = await sessionService.create(user.id, ip, lifetimeMillis);
     * const accessToken = await authTokenService.createAccessToken(user, session.id);
     * ```
     */
    public async createAccessToken(subject: IAuthSubject, sessionId: string): Promise<string> {
        const baseClaims: Record<string, unknown> = {
            id: subject.id,
            email: subject.email,
            roles: [...subject.roles],
            sid: sessionId,
        };

        if (this._tokenEnricher) {
            const extra = await this._tokenEnricher.enrichClaims(subject);
            Object.assign(baseClaims, extra);
        }

        return this._jwtService.signAsync(baseClaims);
    }

    // #endregion
}
