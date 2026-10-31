import type { StandardSchemaSerializerInterceptorOptions, StandardSchemaValidationPipeOptions } from '@nestjs/common';

/**
 * Standard Schema request-validation and response-serialization options.
 *
 * Each integration is enabled by default. Set an individual property to
 * `false`, or set {@link IApiStepOptions.standardSchema} to `false`, to opt out.
 *
 * @public
 */
export interface IApiStandardSchemaOptions {
    /** Standard Schema request validation, or the options forwarded to NestJS. */
    readonly requestValidation?: boolean | StandardSchemaValidationPipeOptions;

    /** Standard Schema response serialization, or the options forwarded to NestJS. */
    readonly responseSerialization?: boolean | StandardSchemaSerializerInterceptorOptions;
}
