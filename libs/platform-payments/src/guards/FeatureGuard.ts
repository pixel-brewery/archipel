// #region Imports

import { CanActivate, ExecutionContext, Injectable, SetMetadata, type CustomDecorator } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureAccessBase } from '../abstracts/FeatureAccessBase.js';
import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';
import type { IFeatureAccessResult } from '../contracts/IFeatureAccessResult.js';

// #endregion

export const FEATURE_KEY_METADATA = 'feature_key';

/**
 * Decorator to mark endpoints that require feature access check.
 * The `featureKey` is a free-form string defined by the consuming project.
 *
 * @public
 */
export const RequiresFeature = (featureKey: string): CustomDecorator<string> => SetMetadata(FEATURE_KEY_METADATA, featureKey);

/**
 * Guard that checks if the user has access to a specific feature
 * by delegating to the registered {@link FeatureAccessBase}.
 *
 * @public
 */
@Injectable()
export class FeatureGuard implements CanActivate {
    // #region Fields

    private readonly _featureAccess: FeatureAccessBase;
    private readonly _reflector: Reflector;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `FeatureGuard` class.
     *
     * @public
     * @param featureAccess - The feature access abstract base.
     * @param reflector - The NestJS reflector.
     */
    public constructor(featureAccess: FeatureAccessBase, reflector: Reflector) {
        this._featureAccess = featureAccess;
        this._reflector = reflector;
    }

    // #endregion

    // #region Methods

    /**
     * Determines whether the current user has access to the guarded feature.
     *
     * @public
     * @param context - The execution context.
     * @returns `true` when the user is allowed to proceed.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const featureKey = this.getFeatureKey(context);

        if (!featureKey) {
            return true;
        }

        const request = context.switchToHttp().getRequest<IFeatureRequest>();
        const user = request.user;
        const userId = this.getUserId(user);

        if (!userId) {
            return false;
        }

        const access = await this._featureAccess.checkAccess(userId, featureKey, this.createAccessContext(userId, user));

        request.featureAccess = access;

        return access.allowed;
    }

    private getFeatureKey(context: ExecutionContext): string | undefined {
        return this._reflector.getAllAndOverride<string | undefined>(FEATURE_KEY_METADATA, [context.getHandler(), context.getClass()]);
    }

    private getUserId(user: IFeatureSubject | undefined): string | null {
        const userId = user?.id;

        if (typeof userId === 'string' && userId.length > 0) {
            return userId;
        }

        if (typeof userId === 'number') {
            return String(userId);
        }

        return null;
    }

    private createAccessContext(userId: string, user: IFeatureSubject | undefined): IFeatureAccessContext {
        return {
            userId,
            tenantId: user?.tenantId,
            subject: user,
        };
    }

    // #endregion
}

interface IFeatureRequest {
    user?: IFeatureSubject;
    featureAccess?: IFeatureAccessResult;
}

interface IFeatureSubject {
    readonly id?: string | number;
    readonly tenantId?: string | number;
}
