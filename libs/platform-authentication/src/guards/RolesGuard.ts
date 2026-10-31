// #region Imports

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import type { IAuthSubject } from '../contracts/IAuthSubject.js';
import { ROLES_KEY } from '../decorators/RolesDecorator.js';

// #endregion

@Injectable()
export class RolesGuard implements CanActivate {
    // #region Fields

    private readonly _reflector: Reflector;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `RolesGuard` class.
     *
     * @public
     */
    public constructor(reflector: Reflector) {
        this._reflector = reflector;
    }

    // #endregion

    // #region Methods

    /**
     * @public
     */
    public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this._reflector.getAllAndOverride<Array<string>>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!roles || roles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();

        return roles.some((role) => (request.user as IAuthSubject).roles.includes(role));
    }

    // #endregion
}
