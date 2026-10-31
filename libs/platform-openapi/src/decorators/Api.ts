// #region Imports

import { applyDecorators } from '@nestjs/common';
import {
    ApiBasicAuth,
    ApiBearerAuth,
    ApiBody,
    ApiCallbacks,
    ApiConsumes,
    ApiCookieAuth,
    ApiExcludeEndpoint,
    ApiExtension,
    ApiExtraModels,
    ApiHeaders,
    ApiOAuth2,
    ApiOperation,
    ApiParam,
    ApiParamOptions,
    ApiProduces,
    ApiQuery,
    ApiResponse,
    ApiSecurity,
    ApiTags,
    getSchemaPath,
} from '@nestjs/swagger';

// #endregion

/**
 * Supported authentication scheme types.
 */
type ApiAuthType = 'bearer' | 'basic' | 'oauth2' | 'cookie';

/**
 * Authentication option - either a simple scheme string or a named scheme object.
 *
 * @example
 * // Simple (unnamed):
 * auth: 'bearer'
 *
 * // Named scheme:
 * auth: { type: 'bearer', name: 'jwt' }
 *
 * // Multiple schemes:
 * auth: ['bearer', { type: 'oauth2', name: 'google' }]
 */
type ApiAuthOption = ApiAuthType | { type: ApiAuthType; name?: string };

/**
 * Custom security scheme reference for {@link ApiSecurity}.
 */
interface IApiSecurityOption {
    /** The name of the security scheme defined in the OpenAPI document. */
    name: string;
    /** Required scopes / requirements for this security scheme. */
    requirements?: string[];
}

/**
 * Configuration options for the {@link Api} composite Swagger decorator.
 */
interface IApiOptions {
    /** Authentication scheme(s). Supports named schemes and multiple simultaneous schemes. */
    auth?: ApiAuthOption | ApiAuthOption[];

    /** Tag(s) for grouping endpoints in the Swagger UI. */
    tags?: Parameters<typeof ApiTags>[0] | Array<Parameters<typeof ApiTags>[0]>;

    /** Full operation metadata (operationId, description, summary, deprecated, etc.). */
    operation?: Parameters<typeof ApiOperation>[0];

    /** Shorthand for {@link operation}.summary. Takes precedence when both are provided. */
    summary?: string;

    /** Shorthand to mark the endpoint as deprecated. Merged into {@link operation}. */
    deprecated?: boolean;

    /** Response definition(s) for the endpoint. */
    responses?: Parameters<typeof ApiResponse>[0] | Array<Parameters<typeof ApiResponse>[0]>;

    /** Header definitions for the endpoint. */
    headers?: Parameters<typeof ApiHeaders>[0];

    /** Path parameter definition(s). */
    params?: ApiParamOptions | ApiParamOptions[];

    /** Query parameter definition(s). */
    query?: Parameters<typeof ApiQuery>[0] | Array<Parameters<typeof ApiQuery>[0]>;

    /** Request body definition. */
    body?: Parameters<typeof ApiBody>[0];

    /** OAuth2 scopes (applied when {@link auth} includes `'oauth2'`). */
    scopes?: string[];

    /** Vendor extensions (`x-*` properties) added to the operation. Accepts any serializable value. */
    extensions?: Record<string, unknown>;

    /** MIME type(s) the endpoint consumes (e.g., `'multipart/form-data'`). */
    consumes?: string | string[];

    /** MIME type(s) the endpoint produces (e.g., `'application/pdf'`). */
    produces?: string | string[];

    /** Extra model classes to register for polymorphic / discriminated-union schemas. */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    extraModels?: Function | Function[];

    /** Generic security scheme(s) for custom API keys or non-standard auth. */
    security?: IApiSecurityOption | IApiSecurityOption[];

    /** When `true`, excludes this endpoint from the generated Swagger documentation. */
    exclude?: boolean;

    /** OpenAPI callback / webhook definitions for the endpoint. */
    callbacks?: Parameters<typeof ApiCallbacks>[0];
}

/**
 * Composite Swagger decorator that wraps all NestJS OpenAPI decorators into a single declaration.
 *
 * @param options - Configuration for the Swagger decorators.
 * @param options.auth - Authentication scheme(s) (bearer, basic, oauth2, cookie) with optional named schemes.
 * @param options.tags - Tag(s) for grouping endpoints in the Swagger UI.
 * @param options.operation - Full operation metadata (operationId, description, summary, deprecated).
 * @param options.summary - Shorthand for operation summary (merged into operation).
 * @param options.deprecated - Shorthand to mark the endpoint as deprecated.
 * @param options.responses - Response definition(s) for the endpoint.
 * @param options.headers - Header definitions for the endpoint.
 * @param options.params - Path parameter definition(s).
 * @param options.query - Query parameter definition(s).
 * @param options.body - Request body definition.
 * @param options.scopes - OAuth2 scopes (used when auth includes 'oauth2').
 * @param options.extensions - Vendor extensions (x-* properties) added to the operation.
 * @param options.consumes - MIME type(s) the endpoint consumes.
 * @param options.produces - MIME type(s) the endpoint produces.
 * @param options.extraModels - Extra model classes for polymorphic / discriminated-union schemas.
 * @param options.security - Generic security scheme(s) for custom API keys or non-standard auth.
 * @param options.exclude - Excludes this endpoint from the Swagger documentation when true.
 * @param options.callbacks - OpenAPI callback / webhook definitions.
 */
export function Api(options: IApiOptions): ClassDecorator & MethodDecorator & PropertyDecorator {
    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

    if (options.tags) {
        const tags = Array.isArray(options.tags) ? options.tags : [options.tags];
        decorators.push(ApiTags(...tags));
    }

    if (options.auth) {
        const authOptions = Array.isArray(options.auth) ? options.auth : [options.auth];

        for (const auth of authOptions) {
            const type = typeof auth === 'string' ? auth : auth.type;
            const name = typeof auth === 'string' ? undefined : auth.name;

            switch (type) {
                case 'bearer':
                    decorators.push(ApiBearerAuth(name));
                    break;
                case 'basic':
                    decorators.push(ApiBasicAuth(name));
                    break;
                case 'oauth2':
                    decorators.push(ApiOAuth2(options.scopes ?? [], name));
                    break;
                case 'cookie':
                    decorators.push(ApiCookieAuth(name));
                    break;
            }
        }
    }

    if (options.operation || options.summary !== undefined || options.deprecated !== undefined) {
        const operationOptions: Parameters<typeof ApiOperation>[0] = {
            ...options.operation,
        };

        if (options.summary !== undefined) {
            operationOptions.summary = options.summary;
        }

        if (options.deprecated !== undefined) {
            operationOptions.deprecated = options.deprecated;
        }

        decorators.push(ApiOperation(operationOptions));
    }

    if (options.responses) {
        const responses = Array.isArray(options.responses) ? options.responses : [options.responses];
        responses.forEach((response) => {
            if ('type' in response && response.type && typeof response.type === 'function' && 'MEDIA_TYPE' in response.type) {
                const mediaType = (response.type as { MEDIA_TYPE: string }).MEDIA_TYPE;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
                const modelRef = response.type as Function;
                const { type: _type, ...rest } = response;

                decorators.push(ApiExtraModels(modelRef));
                decorators.push(
                    ApiResponse({
                        ...rest,
                        content: {
                            [mediaType]: {
                                schema: { $ref: getSchemaPath(modelRef) },
                            },
                        },
                    }),
                );
            } else {
                decorators.push(ApiResponse(response));
            }
        });
    }

    if (options.headers) {
        decorators.push(ApiHeaders(options.headers));
    }

    if (options.params) {
        const params = Array.isArray(options.params) ? options.params : [options.params];
        params.forEach((param) => decorators.push(ApiParam(param)));
    }

    if (options.query) {
        const queries = Array.isArray(options.query) ? options.query : [options.query];
        queries.forEach((query) => decorators.push(ApiQuery(query)));
    }

    if (options.body) {
        decorators.push(ApiBody(options.body));
    }

    if (options.extensions) {
        Object.entries(options.extensions).forEach(([key, value]) => {
            decorators.push(ApiExtension(key, value));
        });
    }

    if (options.consumes) {
        const consumes = Array.isArray(options.consumes) ? options.consumes : [options.consumes];
        decorators.push(ApiConsumes(...consumes));
    }

    if (options.produces) {
        const produces = Array.isArray(options.produces) ? options.produces : [options.produces];
        decorators.push(ApiProduces(...produces));
    }

    if (options.extraModels) {
        const models = Array.isArray(options.extraModels) ? options.extraModels : [options.extraModels];
        decorators.push(ApiExtraModels(...models));
    }

    if (options.security) {
        const securities = Array.isArray(options.security) ? options.security : [options.security];
        securities.forEach((sec) => decorators.push(ApiSecurity(sec.name, sec.requirements)));
    }

    if (options.exclude) {
        decorators.push(ApiExcludeEndpoint());
    }

    if (options.callbacks) {
        decorators.push(ApiCallbacks(options.callbacks));
    }

    return applyDecorators(...decorators) as ClassDecorator & MethodDecorator & PropertyDecorator;
}
