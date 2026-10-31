// #region Imports

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FeatureAccessBase } from '../abstracts/FeatureAccessBase.js';
import type { IFeatureAccessContext } from '../contracts/IFeatureAccessContext.js';
import { FEATURE_KEY_METADATA } from '../guards/FeatureGuard.js';

// #endregion

/**
 * Interceptor that records feature usage after successful request handling.
 * Delegates recording to the registered {@link FeatureAccessBase}.
 *
 * @public
 */
@Injectable()
export class FeatureUsageInterceptor implements NestInterceptor {
    // #region Fields

    private readonly _featureAccess: FeatureAccessBase;
    private readonly _reflector: Reflector;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `FeatureUsageInterceptor` class.
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
     * Records feature usage after the request handler completes successfully.
     *
     * @public
     * @param context - The execution context.
     * @param next - The call handler.
     * @returns The observable response stream.
     */
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const featureKey = this.getFeatureKey(context);

        if (!featureKey) {
            return next.handle();
        }

        // A stock allowance is derived from the resources that exist, never metered: a counter would
        // rise on creation, never fall on removal, and end up limiting write operations instead.
        // Called defensively: an implementation compiled against an earlier contract does not carry
        // the method, and its keys are all consumption keys by definition.
        if (this._featureAccess.isStockFeature?.(featureKey) === true) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest<IFeatureRequest>();
        const user = request.user;
        const userId = this.getUserId(user);

        return next.handle().pipe(
            tap(async () => {
                if (userId) {
                    await this._featureAccess.recordUsage(userId, featureKey, this.createAccessContext(userId, user));
                }
            }),
        );
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
    readonly user?: IFeatureSubject;
}

interface IFeatureSubject {
    readonly id?: string | number;
    readonly tenantId?: string | number;
}
