// #region Imports

import { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import { DateTimeUtils } from '@pixel-brewery/archipel-platform-core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ChallengeStoreBase } from '../abstracts/ChallengeStoreBase.js';
import { AUTH_MFA_CHALLENGE_EXPIRES_IN, AUTH_MFA_MAX_ATTEMPTS } from '../env.js';

// #endregion

export interface IMfaChallengeState {
    id: string;
    userId: string;
    allowedMethods: string[];
    preferredMethod?: string;
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    clientName?: string;
    createdAt: Date;
    expiresAt: Date;
    attempts: number;
}

/**
 * Stores and validates MFA login challenges.
 *
 * Delegates persistence to {@link ChallengeStoreBase} so the backing store
 * (in-memory, Redis, etc.) can be swapped without changing business logic.
 *
 * @public
 */
@Injectable()
export class ChallengeService {
    // #region Fields

    private readonly _ttlMilliseconds: number;
    private readonly _maxAttempts: number;
    private readonly _store: ChallengeStoreBase;

    // #endregion

    // #region Ctor

    public constructor(configService: ConfigService, store: ChallengeStoreBase) {
        this._ttlMilliseconds = DateTimeUtils.parse(configService.tryGet(AUTH_MFA_CHALLENGE_EXPIRES_IN.key, '5m'));
        this._maxAttempts = Number(configService.tryGet(AUTH_MFA_MAX_ATTEMPTS.key, '5'));
        this._store = store;
    }

    // #endregion

    // #region Methods

    /**
     * Issues a new MFA challenge for a user.
     */
    public async create(
        userId: string,
        methods: string[],
        preferredMethod?: string,
        ipAddress?: string,
        userAgent?: string,
        location?: string,
        clientName?: string,
    ): Promise<IMfaChallengeState> {
        const id = randomUUID();
        const now = new Date();
        const challenge: IMfaChallengeState = {
            id: id,
            userId: userId,
            allowedMethods: methods,
            preferredMethod: preferredMethod && methods.includes(preferredMethod) ? preferredMethod : methods[0],
            ipAddress,
            userAgent,
            location,
            clientName,
            createdAt: now,
            expiresAt: new Date(now.getTime() + this._ttlMilliseconds),
            attempts: 0,
        };

        await this._store.set(id, challenge);
        return challenge;
    }

    /**
     * Retrieves an active challenge, throwing if invalid or expired.
     */
    public async get(challengeId: string): Promise<IMfaChallengeState> {
        const challenge = await this._store.get(challengeId);
        if (!challenge) {
            throw new UnauthorizedException('Invalid MFA challenge');
        }

        if (challenge.expiresAt.getTime() <= Date.now()) {
            await this._store.delete(challengeId);
            throw new UnauthorizedException('MFA challenge expired');
        }

        return challenge;
    }

    /**
     * Increments failed attempts and optionally invalidates the challenge.
     */
    public async incrementAttempts(challengeId: string): Promise<IMfaChallengeState> {
        const challenge = await this.get(challengeId);
        const attempts = challenge.attempts + 1;

        const updated: IMfaChallengeState = {
            ...challenge,
            attempts: attempts,
        };

        if (attempts >= this._maxAttempts) {
            await this._store.delete(challengeId);
            throw new UnauthorizedException('MFA challenge locked after too many attempts');
        }

        await this._store.set(challengeId, updated);
        return updated;
    }

    /**
     * Invalidates a challenge after successful verification.
     */
    public async invalidate(challengeId: string): Promise<void> {
        await this._store.delete(challengeId);
    }

    // #endregion
}
