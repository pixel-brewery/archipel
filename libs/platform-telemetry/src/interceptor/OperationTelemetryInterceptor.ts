import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, firstValueFrom, from } from 'rxjs';
import { ITelemetryFacade } from '../core/NoopTelemetryFacade.js';

@Injectable()
export class OperationTelemetryInterceptor implements NestInterceptor {
    // #region Fields
    private readonly _facade: ITelemetryFacade;
    // #endregion

    // #region Ctor
    public constructor(facade: ITelemetryFacade) {
        this._facade = facade;
    }
    // #endregion

    // #region Methods
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const handler = context.getHandler().name;
        const cls = context.getClass().name;
        const name = `${cls}.${handler}`;
        return from(this._facade.runOperation(name, () => firstValueFrom(next.handle())));
    }
    // #endregion
}
