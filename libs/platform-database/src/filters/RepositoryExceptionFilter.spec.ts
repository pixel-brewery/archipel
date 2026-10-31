import { type ArgumentsHost, HttpStatus } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RepositoryError } from '../models/errors/RepositoryError.js';
import { RepositoryExceptionFilter } from './RepositoryExceptionFilter.js';

describe('RepositoryExceptionFilter', () => {
    // #region Fields

    let filter: RepositoryExceptionFilter;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        filter = new RepositoryExceptionFilter();
    });

    // #endregion

    // #region Methods

    describe('catch', () => {
        it('should return 500 with repository error details', () => {
            // arrange
            const exception = new RepositoryError('Test error', 'R_KNOWN');
            const mockJson = vi.fn();
            const mockStatus = vi.fn().mockReturnValue({ json: mockJson });
            const host = {
                switchToHttp: vi.fn().mockReturnValue({
                    getResponse: vi.fn().mockReturnValue({ status: mockStatus }),
                    getRequest: vi.fn().mockReturnValue({ url: '/api/v1/users' }),
                }),
            } as unknown as ArgumentsHost;

            // act
            filter.catch(exception, host);

            // assert
            expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(mockJson).toHaveBeenCalledWith(
                expect.objectContaining({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Repository Error',
                    path: '/api/v1/users',
                }),
            );
        });
    });

    // #endregion
});
