import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ClassConstructor } from 'class-transformer';
import { MaybeArray } from '../../types/MaybeArray.js';
import { ResponseTransformer } from '../ResponseTransformer.js';

/**
 * @public
 */
export abstract class ResponseReturnBase<T> {
    // #region Fields

    @ApiProperty({
        description: 'Indicates whether the request was successful.',
        type: Boolean,
        required: true,
    })
    public success!: boolean;

    @ApiProperty({
        description: 'HTTP status code of the response.',
        type: Number,
        required: true,
        example: 200,
    })
    public status!: number;

    @ApiPropertyOptional({
        description: 'The response payload.',
        type: Object,
    })
    public data?: T;

    @ApiPropertyOptional({
        description: 'Human-readable error message if not successful.',
        type: String,
    })
    public error?: string;

    @ApiPropertyOptional({
        description: 'Optional error details (validation errors, stack info, codes, etc.).',
        type: Object,
    })
    public details?: unknown;

    @ApiProperty({
        description: 'Server-side timestamp (ISO 8601).',
        type: String,
        required: true,
        example: new Date().toISOString(),
    })
    public timestamp!: string;

    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Creates a successful response.
     *
     * @public
     * @param type Class type to transform to
     * @param data The response data
     */
    public static ok<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn): ResponseReturnBase<TReturn>;

    public static ok<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn[]): ResponseReturnBase<TReturn[]>;

    public static ok<TReturn, TIn>(type: ClassConstructor<TReturn>, data: MaybeArray<TIn>): ResponseReturnBase<MaybeArray<TReturn>> {
        return this.makeSuccess(HttpStatus.OK, type, data);
    }

    /**
     * Creates a resource created response.
     *
     * @public
     * @param type Class type to transform to
     * @param data The response data
     */
    public static created<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn): ResponseReturnBase<TReturn>;

    public static created<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn[]): ResponseReturnBase<TReturn[]>;

    public static created<TReturn, TIn>(type: ClassConstructor<TReturn>, data: MaybeArray<TIn>): ResponseReturnBase<MaybeArray<TReturn>> {
        return this.makeSuccess(HttpStatus.CREATED, type, data);
    }

    /**
     * Creates an accepted response.
     *
     * @public
     * @param type Class type to transform to
     * @param data The response data
     */
    public static accepted<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn): ResponseReturnBase<TReturn>;

    public static accepted<TReturn, TIn>(type: ClassConstructor<TReturn>, data: TIn[]): ResponseReturnBase<TReturn[]>;

    public static accepted<TReturn, TIn>(type: ClassConstructor<TReturn>, data: MaybeArray<TIn>): ResponseReturnBase<MaybeArray<TReturn>> {
        return this.makeSuccess(HttpStatus.ACCEPTED, type, data);
    }

    /**
     * No content variant (204). `data` is undefined by contract.
     *
     * @public
     */
    public static noContent<TReturn>(): ResponseReturnBase<TReturn> {
        const Ctor = this as unknown as new () => ResponseReturnBase<TReturn>;
        const response = new Ctor();
        response.success = true;
        response.status = HttpStatus.NO_CONTENT;
        response.timestamp = new Date().toISOString();

        return response;
    }

    /**
     * Creates a bad request response.
     *
     * @public
     * @param message Human-readable error message
     * @param details Optional error details
     * @returns Bad request response
     */
    public static badRequest<TReturn>(message = 'Bad Request', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.BAD_REQUEST, message, details);
    }

    /**
     * Creates an unauthorized response.
     *
     * @public
     * @param message Human-readable error message
     * @param details Optional error details
     * @returns Unauthorized response
     */
    public static unauthorized<TReturn>(message = 'Unauthorized', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.UNAUTHORIZED, message, details);
    }

    /**
     * Creates a forbidden response.
     *
     * @public
     * @param message Human-readable error message
     * @param details Optional error details
     * @returns Forbidden response
     */
    public static forbidden<TReturn>(message = 'Forbidden', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.FORBIDDEN, message, details);
    }

    /**
     * Creates a not found response.
     *
     * @public
     * @param message Human-readable error message
     * @param details Optional error details
     * @returns Not found response
     */
    public static notFound<TReturn>(message = 'Not Found', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.NOT_FOUND, message, details);
    }

    /**
     * Creates a conflict response.
     *
     * @public
     * @param message Human-readable error message
     * @param details Optional error details
     * @returns Conflict response
     */
    public static conflict<TReturn>(message = 'Conflict', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.CONFLICT, message, details);
    }

    /**
     * Generic server error (500). Prefer attaching a safe `details` object (no stack traces in prod).
     */
    public static error<TReturn>(message = 'Internal Server Error', details?: unknown): ResponseReturnBase<TReturn> {
        return this.makeError(HttpStatus.INTERNAL_SERVER_ERROR, message, details);
    }

    /**
     * Converts an arbitrary error into a ResponseReturnBase.
     * - If you pass a Nest `HttpException`, consider extracting status/message first.
     */
    public static fromError<TReturn>(err: unknown, defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR): ResponseReturnBase<TReturn> {
        const message =
            typeof err === 'object' && err && 'message' in err && typeof (err as Record<string, unknown>)['message'] === 'string'
                ? ((err as Record<string, unknown>)['message'] as string)
                : 'Unexpected error';
        const details = typeof err === 'object' && err ? sanitizeError(err) : undefined;
        return this.makeError(defaultStatus, message, details);
    }

    /**
     * @private
     */
    private static makeSuccess<TReturn, TIn>(status: number, type: ClassConstructor<TReturn>, data: MaybeArray<TIn>): ResponseReturnBase<MaybeArray<TReturn>> {
        const Ctor = this as unknown as new () => ResponseReturnBase<MaybeArray<TReturn>>;
        const response = new Ctor();
        response.success = true;
        response.status = status;
        response.timestamp = new Date().toISOString();
        response.data = ResponseTransformer.transform(type, data) as MaybeArray<TReturn>;

        return response;
    }

    /**
     * @private
     */
    private static makeError<TReturn>(status: number, message: string, details?: unknown): ResponseReturnBase<TReturn> {
        const Ctor = this as unknown as new () => ResponseReturnBase<TReturn>;
        const response = new Ctor();
        response.success = false;
        response.status = status;
        response.timestamp = new Date().toISOString();
        response.error = message;

        if (details !== undefined) {
            response.details = details;
        }

        return response;
    }

    // #endregion
}

/**
 * Strips unsafe properties from thrown errors for `details`.
 * You can expand this strategy depending on your logging policies.
 */
function sanitizeError(err: unknown): Record<string, unknown> | undefined {
    if (!err || typeof err !== 'object') {
        return undefined;
    }
    const { name, message, ...rest } = err as Record<string, unknown>;
    // Avoid leaking stack traces or internal objects by default.
    // Add whitelisting if needed.
    const safe: Record<string, unknown> = {};
    if (name) {
        safe['name'] = name;
    }
    if (message) {
        safe['message'] = message;
    }
    // Optionally copy selected props:
    for (const key of Object.keys(rest)) {
        if (!/stack|config|request|response/i.test(key)) {
            safe[key] = (rest as Record<string, unknown>)[key];
        }
    }
    return safe;
}
