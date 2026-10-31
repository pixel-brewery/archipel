import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@nestjs/common', () => ({
    applyDecorators: vi.fn(() => () => undefined),
}));

const { apiTagsSpy, apiResponseSpy, apiExtraModelsSpy, getSchemaPathSpy } = vi.hoisted(() => ({
    apiTagsSpy: vi.fn(() => () => undefined),
    apiResponseSpy: vi.fn(() => () => undefined),
    apiExtraModelsSpy: vi.fn(() => () => undefined),
    getSchemaPathSpy: vi.fn((model: unknown) => `#/components/schemas/${(model as { name: string }).name}`),
}));

vi.mock('@nestjs/swagger', () => ({
    ApiTags: apiTagsSpy,
    ApiBearerAuth: vi.fn(() => () => undefined),
    ApiBasicAuth: vi.fn(() => () => undefined),
    ApiOAuth2: vi.fn(() => () => undefined),
    ApiCookieAuth: vi.fn(() => () => undefined),
    ApiOperation: vi.fn(() => () => undefined),
    ApiParam: vi.fn(() => () => undefined),
    ApiQuery: vi.fn(() => () => undefined),
    ApiResponse: apiResponseSpy,
    ApiBody: vi.fn(() => () => undefined),
    ApiExtension: vi.fn(() => () => undefined),
    ApiHeaders: vi.fn(() => () => undefined),
    ApiConsumes: vi.fn(() => () => undefined),
    ApiProduces: vi.fn(() => () => undefined),
    ApiExtraModels: apiExtraModelsSpy,
    ApiSecurity: vi.fn(() => () => undefined),
    ApiExcludeEndpoint: vi.fn(() => () => undefined),
    ApiCallbacks: vi.fn(() => () => undefined),
    getSchemaPath: getSchemaPathSpy,
}));

import { Api } from './Api.js';

describe('Api decorator', () => {
    beforeEach(() => {
        apiTagsSpy.mockClear();
        apiResponseSpy.mockClear();
        apiExtraModelsSpy.mockClear();
        getSchemaPathSpy.mockClear();
    });

    it('handles single tag string', () => {
        Api({ tags: 'test' });
        expect(apiTagsSpy).toHaveBeenCalledWith('test');
    });

    it('handles array of tags', () => {
        Api({ tags: ['one', 'two'] });
        expect(apiTagsSpy).toHaveBeenCalledWith('one', 'two');
    });

    describe('responses with MEDIA_TYPE protocol', () => {
        it('uses content with custom media type when type has static MEDIA_TYPE', () => {
            class ProblemDetailResponse {
                public static readonly MEDIA_TYPE = 'application/problem+json';
            }

            Api({
                responses: {
                    status: 404,
                    description: 'Not found.',
                    type: ProblemDetailResponse,
                },
            });

            expect(apiExtraModelsSpy).toHaveBeenCalledWith(ProblemDetailResponse);
            expect(apiResponseSpy).toHaveBeenCalledWith({
                status: 404,
                description: 'Not found.',
                content: {
                    'application/problem+json': {
                        schema: { $ref: '#/components/schemas/ProblemDetailResponse' },
                    },
                },
            });
        });

        it('does not pass type through when MEDIA_TYPE is present', () => {
            class CustomResponse {
                public static readonly MEDIA_TYPE = 'text/csv';
            }

            Api({
                responses: {
                    status: 200,
                    description: 'CSV export.',
                    type: CustomResponse,
                },
            });

            const callArgs = apiResponseSpy.mock.calls[0][0];
            expect(callArgs).not.toHaveProperty('type');
        });

        it('falls back to standard ApiResponse when type has no MEDIA_TYPE', () => {
            class NormalResponse {}

            Api({
                responses: {
                    status: 200,
                    description: 'OK.',
                    type: NormalResponse,
                },
            });

            expect(apiExtraModelsSpy).not.toHaveBeenCalled();
            expect(apiResponseSpy).toHaveBeenCalledWith({
                status: 200,
                description: 'OK.',
                type: NormalResponse,
            });
        });

        it('handles mixed responses — with and without MEDIA_TYPE', () => {
            class ProblemDetailResponse {
                public static readonly MEDIA_TYPE = 'application/problem+json';
            }

            class SuccessResponse {}

            Api({
                responses: [
                    { status: 200, description: 'OK.', type: SuccessResponse },
                    { status: 404, description: 'Not found.', type: ProblemDetailResponse },
                ],
            });

            expect(apiResponseSpy).toHaveBeenCalledTimes(2);

            expect(apiResponseSpy).toHaveBeenCalledWith({
                status: 200,
                description: 'OK.',
                type: SuccessResponse,
            });

            expect(apiResponseSpy).toHaveBeenCalledWith({
                status: 404,
                description: 'Not found.',
                content: {
                    'application/problem+json': {
                        schema: { $ref: '#/components/schemas/ProblemDetailResponse' },
                    },
                },
            });

            expect(apiExtraModelsSpy).toHaveBeenCalledTimes(1);
            expect(apiExtraModelsSpy).toHaveBeenCalledWith(ProblemDetailResponse);
        });

        it('handles response without type property at all', () => {
            Api({
                responses: {
                    status: 204,
                    description: 'No content.',
                },
            });

            expect(apiExtraModelsSpy).not.toHaveBeenCalled();
            expect(apiResponseSpy).toHaveBeenCalledWith({
                status: 204,
                description: 'No content.',
            });
        });

        it('preserves additional response properties when using MEDIA_TYPE', () => {
            class ProblemDetailResponse {
                public static readonly MEDIA_TYPE = 'application/problem+json';
            }

            Api({
                responses: {
                    status: 409,
                    description: 'Conflict.',
                    type: ProblemDetailResponse,
                },
            });

            const callArgs = apiResponseSpy.mock.calls[0][0];
            expect(callArgs.status).toBe(409);
            expect(callArgs.description).toBe('Conflict.');
            expect(callArgs.content).toEqual({
                'application/problem+json': {
                    schema: { $ref: '#/components/schemas/ProblemDetailResponse' },
                },
            });
        });
    });
});
