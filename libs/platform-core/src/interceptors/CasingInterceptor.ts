// #region Imports

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// #endregion

/**
 * Global NestJS interceptor that normalizes property casing across the HTTP boundary.
 *
 * **Request (inbound):** Converts `snake_case` (or other casing styles) keys in the
 * request body to `camelCase` before they reach controllers.
 *
 * **Response (outbound):** Currently passes data through unchanged. If outbound
 * transformation is needed in the future, it can be added in the `map` operator.
 *
 * @remarks
 * Because this interceptor is applied globally, **all JSON request bodies are
 * camelCase-normalized** and **all JSON responses use camelCase property names**.
 * OpenAPI / Swagger schemas therefore always reflect camelCase keys.
 *
 * @public
 */
@Injectable()
export class CasingInterceptor implements NestInterceptor {
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest<Request>();

        // Modify request body - convert snake_case to camelCase
        if (request.body) {
            request.body = this.convertToCamelCase(request.body);
        }

        // Handle the response and transform it if necessary
        return next.handle().pipe(
            map(
                (data) =>
                    // If you want to modify the response (convert camelCase to another case) you can do it here

                    data,
            ),
        );
    }

    public process<T>(value: T): T {
        return this.convertToCamelCase(value) as T;
    }

    // Custom method to convert snake_case keys in the body to camelCase
    private convertToCamelCase(obj: unknown): unknown {
        if (Array.isArray(obj)) {
            return obj.map((value: unknown) => this.convertToCamelCase(value));
        } else if (obj !== null && typeof obj === 'object' && (obj as object).constructor === Object) {
            return Object.keys(obj as object).reduce<Record<string, unknown>>((result, key) => {
                const camelKey = key.replace(/_./g, (s) => s.charAt(1).toUpperCase());
                result[camelKey] = this.convertToCamelCase((obj as Record<string, unknown>)[key]);
                return result;
            }, {});
        }
        return obj;
    }
}
