import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { catchError, finalize, throwError, type Observable } from 'rxjs';

interface IHttpRequest {
    method?: string;
    route?: { path?: string | readonly string[] };
}

interface IHttpResponse {
    statusCode?: number;
}

/** Shared HTTP lifecycle recording with bounded route-template attributes. */
export function recordHttpRequest(
    context: ExecutionContext,
    next: CallHandler,
    record: (method: string, path: string, status: string, durationMs: number) => void,
    reportFailure?: (error: unknown, method: string, path: string, status: string) => void,
): Observable<unknown> {
    if (context.getType() !== 'http') {
        return next.handle();
    }

    const started = performance.now();
    const request = context.switchToHttp().getRequest<IHttpRequest>();
    const response = context.switchToHttp().getResponse<IHttpResponse>();
    const routePath = request.route?.path;
    const path = typeof routePath === 'string' && !routePath.includes('*') ? routePath : 'unmatched';
    const method = request.method ?? 'UNKNOWN';
    let errorStatus: number | undefined;

    return next.handle().pipe(
        catchError((error: unknown) => {
            errorStatus = 500;
            try {
                if (typeof error === 'object' && error !== null && 'status' in error && typeof error.status === 'number') {
                    errorStatus = error.status;
                } else if (typeof error === 'object' && error !== null && 'getStatus' in error && typeof error.getStatus === 'function') {
                    errorStatus = (error.getStatus as () => number)();
                }
            } catch {
                // Exotic thrown objects retain the unknown-server-error classification.
            }
            try {
                if (errorStatus >= 500) reportFailure?.(error, method, path, String(errorStatus));
            } catch {
                // A diagnostic observer must not replace the original error.
            }
            return throwError(() => error);
        }),
        finalize(() => {
            record(method, path, String(errorStatus ?? response.statusCode ?? 200), performance.now() - started);
        }),
    );
}
