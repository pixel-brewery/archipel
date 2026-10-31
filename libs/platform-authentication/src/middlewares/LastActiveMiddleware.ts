// #region Imports

import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { SessionService } from '../services/SessionService.js';

// #endregion

/**
 * Middleware to automatically update the lastActive timestamp for authenticated sessions.
 * Reads the session identifier from the bearer token and updates the session asynchronously.
 *
 * @remarks
 * Registering it makes **every** authenticated request count as activity, including background
 * polling, prefetches and health probes. Products whose inactivity window is meant to track
 * literal user interaction should leave it unregistered and renew the session from an explicit
 * activity endpoint instead — otherwise a tab left open keeps the session alive indefinitely.
 *
 * The update is fired without being awaited and its failures are logged at debug level, so a
 * database hiccup delays no request and fails none.
 *
 * The identifier is read from the `sid` claim without verifying the signature, which is safe here:
 * the middleware only renews an existing session, and a forged identifier that matches no session
 * changes nothing.
 *
 * @example
 * ```typescript
 * export class AppModule implements NestModule {
 *     public configure(consumer: MiddlewareConsumer): void {
 *         consumer.apply(LastActiveMiddleware).forRoutes('*');
 *     }
 * }
 * ```
 *
 * @public
 */
@Injectable()
export class LastActiveMiddleware implements NestMiddleware {
    // #region Fields

    private readonly _jwtService: JwtService;
    private readonly _sessionService: SessionService;
    private readonly _logger = new Logger(LastActiveMiddleware.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `LastActiveMiddleware` class.
     *
     * @public
     * @param sessionService - Session service instance
     * @param jwtService - JWT service used to read the session identifier
     */
    public constructor(sessionService: SessionService, jwtService: JwtService) {
        this._sessionService = sessionService;
        this._jwtService = jwtService;
    }

    // #endregion

    // #region Methods

    /**
     * Middleware execution method.
     * Reads the session identifier from the Authorization header and updates lastActive
     * asynchronously.
     *
     * @remarks
     * Always calls `next`, whether or not a session identifier was found and whether or not the
     * update succeeds.
     *
     * @public
     * @param req - Express request object
     * @param _res - Express response object (unused)
     * @param next - Next middleware function
     */
    public use(req: Request, _res: Response, next: NextFunction): void {
        const sessionId = this.resolveSessionId(req.headers.authorization);

        if (sessionId !== null) {
            // Update lastActive asynchronously without blocking the request
            this._sessionService.updateLastActive(sessionId).catch((e: unknown) => {
                this._logger.debug(`Failed to update lastActive err=${(e as Error).message}`);
            });
        }

        next();
    }

    /**
     * Extracts the session identifier from a bearer authorization header.
     *
     * @param authorizationHeader - The raw `Authorization` header, when present.
     * @returns The `sid` claim, or `null` for a missing, non-bearer, undecodable or claimless
     * token.
     */
    private resolveSessionId(authorizationHeader: string | undefined): string | null {
        if (!authorizationHeader?.startsWith('Bearer ')) {
            return null;
        }

        try {
            const payload = this._jwtService.decode(authorizationHeader.substring(7)) as unknown;
            const sessionId = (payload as { sid?: unknown } | null)?.sid;

            return typeof sessionId === 'string' && sessionId.length > 0 ? sessionId : null;
        } catch {
            return null;
        }
    }

    // #endregion
}
