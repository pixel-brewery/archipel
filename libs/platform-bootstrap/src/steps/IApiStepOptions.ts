import { IApiValidationOptions } from './IApiValidationOptions.js';
import { IApiStandardSchemaOptions } from './IApiStandardSchemaOptions.js';

/**
 * Options for the generic Archipel API bootstrap step.
 *
 * @public
 */
export interface IApiStepOptions {
    /** Global route prefix, for example `api`. */
    readonly prefix?: string;

    /** Whether to enable RFC 7807 problem-detail error responses. */
    readonly problemDetails?: boolean;

    /** Whether to enable repository error mapping. */
    readonly repositoryErrors?: boolean;

    /** Validation behavior for request DTOs. */
    readonly validation?: boolean | IApiValidationOptions;

    /** Standard Schema request-validation and response-serialization behavior. */
    readonly standardSchema?: boolean | IApiStandardSchemaOptions;
}
