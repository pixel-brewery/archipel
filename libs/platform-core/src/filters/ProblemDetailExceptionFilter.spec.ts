import { BadRequestException, HttpException, type ArgumentsHost, type LoggerService } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProblemDetailException } from './ProblemDetailException.js';
import { ProblemDetailExceptionFilter } from './ProblemDetailExceptionFilter.js';

describe('ProblemDetailExceptionFilter', () => {
    // #region Fields

    let filter: ProblemDetailExceptionFilter;
    let mockSend: ReturnType<typeof vi.fn>;
    let mockHost: ArgumentsHost;
    let mockLogger: LoggerService;

    // #endregion

    // #region Methods

    beforeEach(() => {
        filter = new ProblemDetailExceptionFilter();
        mockSend = vi.fn();
        mockLogger = {
            error: vi.fn(),
            log: vi.fn(),
            warn: vi.fn(),
        };
        filter.setLogger(mockLogger);

        const mockResponse = {
            status: vi.fn().mockReturnThis(),
            header: vi.fn().mockReturnThis(),
            send: mockSend,
        };

        mockHost = {
            switchToHttp: vi.fn().mockReturnValue({
                getRequest: vi.fn().mockReturnValue({ url: '/test' }),
                getResponse: vi.fn().mockReturnValue(mockResponse),
            }),
        } as unknown as ArgumentsHost;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('catch', () => {
        it('should handle ProblemDetailException', () => {
            // arrange
            const exception = new ProblemDetailException(404, {
                title: 'Not Found',
                detail: 'Resource not found',
            });

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 404,
                    title: 'Not Found',
                    detail: 'Resource not found',
                }),
            );
            expect(mockLogger.warn).toHaveBeenCalledWith(exception);
            expect(mockLogger.error).not.toHaveBeenCalled();
        });

        it('should handle BadRequestException with validation errors', () => {
            // arrange
            const exception = new BadRequestException({ message: ['field is required'] });

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 400,
                    detail: 'field is required',
                }),
            );
        });

        it('should handle generic HttpException', () => {
            // arrange
            const exception = new HttpException('Forbidden', 403);

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 403,
                    detail: 'Forbidden',
                }),
            );
        });

        it('should handle raw Error as 500', () => {
            // arrange
            const exception = new Error('unexpected failure');

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 500,
                    title: 'Internal Server Error',
                    detail: 'An unexpected error occurred.',
                }),
            );
            expect(mockLogger.error).toHaveBeenCalledWith(exception);
            expect(mockLogger.warn).not.toHaveBeenCalled();
        });

        it('should set content-type to application/problem+json', () => {
            // arrange
            const exception = new Error('test');
            const headerFn = (mockHost.switchToHttp() as ReturnType<ArgumentsHost['switchToHttp']>).getResponse().header;

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(headerFn).toHaveBeenCalledWith('Content-Type', 'application/problem+json');
        });
    });

    describe('problem headers', () => {
        it('should send the headers that belong to the problem', () => {
            // arrange
            const exception = new ProblemDetailException(
                429,
                { title: 'Rate Limit Exceeded', detail: 'Too many requests.', code: 'RATE_LIMIT' },
                { headers: { 'Retry-After': '42', 'X-RateLimit-Reset': '42' } },
            );
            const headerFn = (mockHost.switchToHttp() as ReturnType<ArgumentsHost['switchToHttp']>).getResponse().header;

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(headerFn).toHaveBeenCalledWith('Retry-After', '42');
            expect(headerFn).toHaveBeenCalledWith('X-RateLimit-Reset', '42');
            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ status: 429, code: 'RATE_LIMIT' }));
        });

        it('should keep the problem content type when a problem declares its own', () => {
            // arrange
            const exception = new ProblemDetailException(409, { title: 'Conflict', detail: 'Changed.' }, { headers: { 'content-type': 'text/html' } });
            const headerFn = (mockHost.switchToHttp() as ReturnType<ArgumentsHost['switchToHttp']>).getResponse().header;

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(headerFn).not.toHaveBeenCalledWith('content-type', 'text/html');
            expect(headerFn).toHaveBeenCalledWith('Content-Type', 'application/problem+json');
        });

        it('should skip a header that would split the response and still answer with the problem', () => {
            // arrange
            const exception = new ProblemDetailException(
                401,
                { title: 'Unauthorized', detail: 'Sign in again.' },
                { headers: { 'WWW-Authenticate': 'Bearer\r\nSet-Cookie: session=stolen', 'Retry-After': '5' } },
            );
            const headerFn = (mockHost.switchToHttp() as ReturnType<ArgumentsHost['switchToHttp']>).getResponse().header;

            // act
            filter.catch(exception, mockHost);

            // assert
            expect(headerFn).not.toHaveBeenCalledWith('WWW-Authenticate', expect.anything());
            expect(headerFn).toHaveBeenCalledWith('Retry-After', '5');
            expect(mockLogger.warn).toHaveBeenCalledWith('Ignoring the invalid problem header "WWW-Authenticate".');
            expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({ status: 401, title: 'Unauthorized' }));
        });
    });

    // #endregion
});
