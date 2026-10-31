// #region Imports

import { HttpException, HttpStatus } from '@nestjs/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalExceptionFilter } from './GlobalExceptionFilter.js';

// #endregion

// #region Helpers

function createMockHost(acceptHeader = 'application/json', url = '/test') {
    const response = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        header: vi.fn().mockReturnThis(),
        send: vi.fn().mockReturnThis(),
    };
    const request = {
        url,
        headers: { accept: acceptHeader },
    };

    return {
        switchToHttp: () => ({
            getResponse: () => response,
            getRequest: () => request,
        }),
        response,
        request,
    };
}

// #endregion

// #region Tests

describe('GlobalExceptionFilter', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('catch (JSON responses)', () => {
        let filter: GlobalExceptionFilter;

        beforeEach(() => {
            filter = new GlobalExceptionFilter();
        });

        it('should return the correct status for HttpException', async () => {
            // arrange
            const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
            const host = createMockHost();

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
        });

        it('should return 500 for unknown exceptions', async () => {
            // arrange
            const exception = new Error('Something broke');
            const host = createMockHost();

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
        });

        it('should return JSON with statusCode, timestamp, path, and error', async () => {
            // arrange
            const exception = new HttpException({ message: 'Bad input' }, HttpStatus.BAD_REQUEST);
            const host = createMockHost('application/json', '/api/users');

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: HttpStatus.BAD_REQUEST,
                    path: '/api/users',
                    error: { message: 'Bad input' },
                }),
            );
        });

        it('should wrap string responses from HttpException into an object', async () => {
            // arrange
            const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            const host = createMockHost();

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    error: { message: 'Forbidden' },
                }),
            );
        });

        it('should include a timestamp in ISO format', async () => {
            // arrange
            const exception = new Error('fail');
            const host = createMockHost();

            // act
            await filter.catch(exception, host as never);

            // assert
            const call = host.response.json.mock.calls[0][0];
            expect(() => new Date(call.timestamp).toISOString()).not.toThrow();
        });
    });

    describe('catch (HTML responses)', () => {
        it('should render HTML when accept header includes text/html and errorTemplateService is present', async () => {
            // arrange
            const mockTemplateService = {
                getErrorTitle: vi.fn().mockReturnValue('Not Found'),
                getErrorMessage: vi.fn().mockReturnValue('Page not found'),
                getErrorPageContent: vi.fn().mockResolvedValue('<html>Error</html>'),
            };
            const filter = new GlobalExceptionFilter(mockTemplateService as never);
            const host = createMockHost('text/html', '/missing-page');

            const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.header).toHaveBeenCalledWith('Content-Type', 'text/html');
            expect(host.response.send).toHaveBeenCalledWith('<html>Error</html>');
        });

        it('should fall back to JSON when errorTemplateService is not present even with text/html accept', async () => {
            // arrange
            const filter = new GlobalExceptionFilter();
            const host = createMockHost('text/html');
            const exception = new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);

            // act
            await filter.catch(exception, host as never);

            // assert
            expect(host.response.json).toHaveBeenCalled();
            expect(host.response.send).not.toHaveBeenCalled();
        });
    });
});

// #endregion
