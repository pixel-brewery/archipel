// #region Imports

import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// #endregion

@Injectable()
export class SocialAuthGuard implements CanActivate {
    // #region Fields

    private static readonly _availableProviders: Array<string> = ['github', 'google', 'microsoft', 'apple'];
    private readonly _routeParam: string;

    // #endregion

    // #region Ctor

    public constructor(routeParam: string) {
        this._routeParam = routeParam.startsWith(':') ? routeParam.slice(1) : routeParam;
    }

    // #endregion

    // #region Methods

    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const provider = request.params[this._routeParam] as string;

        if (!provider || !SocialAuthGuard._availableProviders.includes(provider)) {
            throw new BadRequestException(`Unsupported OAuth provider: ${provider}`);
        }

        const guard = new (AuthGuard(provider))();
        return guard.canActivate(context);
    }

    // #endregion
}

export const socialAuthGuardFactory = (routeParam: string): SocialAuthGuard => new SocialAuthGuard(routeParam);
