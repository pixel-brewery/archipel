import { ISwaggerThemeConfig } from '@pixel-brewery/archipel-platform-openapi';

/**
 * Options for the OpenAPI bootstrap step.
 *
 * @public
 */
export interface IOpenApiStepOptions {
    /** Whether OpenAPI setup should run. */
    readonly enabled?: boolean;

    /** Optional Swagger UI theme configuration. */
    readonly theme?: ISwaggerThemeConfig;
}
