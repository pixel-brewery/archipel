import { type NextFunction, type Request, type Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SessionService } from '../services/SessionService.js';
import { LastActiveMiddleware } from './LastActiveMiddleware.js';

describe('LastActiveMiddleware', () => {
    // #region Fields

    let middleware: LastActiveMiddleware;
    let mockSessionService: Partial<SessionService>;
    let mockJwtService: { decode: ReturnType<typeof vi.fn> };
    let mockNext: NextFunction;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockSessionService = {
            updateLastActive: vi.fn().mockResolvedValue(undefined),
        };

        mockJwtService = { decode: vi.fn().mockReturnValue({ sid: 'session-1' }) };
        mockNext = vi.fn();
        middleware = new LastActiveMiddleware(mockSessionService as SessionService, mockJwtService as never);
    });

    // #endregion

    // #region Methods

    describe('use', () => {
        it('should call next and update session when Bearer token is present', () => {
            // arrange
            const req = { headers: { authorization: 'Bearer my-jwt-token' } } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockJwtService.decode).toHaveBeenCalledWith('my-jwt-token');
            expect(mockSessionService.updateLastActive).toHaveBeenCalledWith('session-1');
        });

        it('should call next without updating session when no auth header', () => {
            // arrange
            const req = { headers: {} } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockSessionService.updateLastActive).not.toHaveBeenCalled();
        });

        it('should call next without updating session for non-Bearer auth', () => {
            // arrange
            const req = { headers: { authorization: 'Basic abc123' } } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockSessionService.updateLastActive).not.toHaveBeenCalled();
        });

        it('should call next without updating session when the token carries no session identifier', () => {
            // arrange
            mockJwtService.decode.mockReturnValue({});
            const req = { headers: { authorization: 'Bearer my-jwt-token' } } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockSessionService.updateLastActive).not.toHaveBeenCalled();
        });

        it('should call next without updating session when the token cannot be decoded', () => {
            // arrange
            mockJwtService.decode.mockImplementation(() => {
                throw new Error('malformed token');
            });
            const req = { headers: { authorization: 'Bearer my-jwt-token' } } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
            expect(mockSessionService.updateLastActive).not.toHaveBeenCalled();
        });

        it('should call next even when updateLastActive fails', () => {
            // arrange
            vi.mocked(mockSessionService.updateLastActive!).mockRejectedValue(new Error('DB error'));
            const req = { headers: { authorization: 'Bearer token' } } as Request;
            const res = {} as Response;

            // act
            middleware.use(req, res, mockNext);

            // assert
            expect(mockNext).toHaveBeenCalled();
        });
    });

    // #endregion
});
