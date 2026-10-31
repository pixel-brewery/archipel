// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorTemplateService } from './ErrorTemplateService.js';

// #endregion

// #region Tests

describe('ErrorTemplateService', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('getErrorPageContent', () => {
        it('should render the error page template with provided params', async () => {
            // arrange
            const configService = {
                tryGet: vi.fn().mockReturnValue('development'),
                get: vi.fn().mockReturnValue('MyApp'),
            };
            const templateEngine = {
                compileTemplate: vi.fn().mockReturnValue('<html>rendered</html>'),
            };
            const resourceManager = {
                loadAsStringAsync: vi.fn().mockResolvedValue('<html>{{statusCode}}</html>'),
            };
            const service = new ErrorTemplateService(configService as never, templateEngine as never, resourceManager as never);

            // act
            const result = await service.getErrorPageContent({
                statusCode: 404,
                title: 'Not Found',
                message: 'Page missing',
                path: '/test',
            });

            // assert
            expect(result).toBe('<html>rendered</html>');
            expect(resourceManager.loadAsStringAsync).toHaveBeenCalledWith('error.html');
            expect(templateEngine.compileTemplate).toHaveBeenCalledWith(
                '<html>{{statusCode}}</html>',
                expect.objectContaining({
                    statusCode: 404,
                    title: 'Not Found',
                    message: 'Page missing',
                    path: '/test',
                    actionText: 'Go to Home',
                    showDetails: true,
                }),
            );
        });

        it('should set showDetails to false in production', async () => {
            // arrange
            const configService = {
                tryGet: vi.fn().mockReturnValue('production'),
                get: vi.fn().mockReturnValue('MyApp'),
            };
            const templateEngine = {
                compileTemplate: vi.fn().mockReturnValue('<html></html>'),
            };
            const resourceManager = {
                loadAsStringAsync: vi.fn().mockResolvedValue(''),
            };
            const service = new ErrorTemplateService(configService as never, templateEngine as never, resourceManager as never);

            // act
            await service.getErrorPageContent({
                statusCode: 500,
                title: 'Error',
                message: 'Something broke',
                path: '/',
            });

            // assert
            expect(templateEngine.compileTemplate).toHaveBeenCalledWith(
                '',
                expect.objectContaining({
                    showDetails: false,
                }),
            );
        });

        it('should use provided optional params over defaults', async () => {
            // arrange
            const configService = {
                tryGet: vi.fn().mockReturnValue('development'),
                get: vi.fn().mockReturnValue('App'),
            };
            const templateEngine = {
                compileTemplate: vi.fn().mockReturnValue(''),
            };
            const resourceManager = {
                loadAsStringAsync: vi.fn().mockResolvedValue(''),
            };
            const service = new ErrorTemplateService(configService as never, templateEngine as never, resourceManager as never);

            // act
            await service.getErrorPageContent({
                statusCode: 403,
                title: 'Forbidden',
                message: 'Access denied',
                path: '/admin',
                actionText: 'Login',
                showDetails: true,
                style: { primary: '#000', secondary: '#fff' },
                footer: { copyright: 'Test Corp' },
            });

            // assert
            expect(templateEngine.compileTemplate).toHaveBeenCalledWith(
                '',
                expect.objectContaining({
                    actionText: 'Login',
                    showDetails: true,
                    style: { primary: '#000', secondary: '#fff' },
                    footer: { copyright: 'Test Corp' },
                }),
            );
        });
    });

    describe('getErrorTitle', () => {
        const service = new ErrorTemplateService({ tryGet: vi.fn(), get: vi.fn() } as never, {} as never, {} as never);

        it('should return "Bad Request" for 400', () => {
            expect(service.getErrorTitle(400)).toBe('Bad Request');
        });

        it('should return "Unauthorized" for 401', () => {
            expect(service.getErrorTitle(401)).toBe('Unauthorized');
        });

        it('should return "Forbidden" for 403', () => {
            expect(service.getErrorTitle(403)).toBe('Forbidden');
        });

        it('should return "Page Not Found" for 404', () => {
            expect(service.getErrorTitle(404)).toBe('Page Not Found');
        });

        it('should return "Internal Server Error" for 500', () => {
            expect(service.getErrorTitle(500)).toBe('Internal Server Error');
        });

        it('should return "Error" for unknown status codes', () => {
            expect(service.getErrorTitle(418)).toBe('Error');
        });
    });

    describe('getErrorMessage', () => {
        const service = new ErrorTemplateService({ tryGet: vi.fn(), get: vi.fn() } as never, {} as never, {} as never);

        it('should return appropriate message for 404', () => {
            expect(service.getErrorMessage(404)).toContain('could not be found');
        });

        it('should return appropriate message for 500', () => {
            expect(service.getErrorMessage(500)).toContain('Something went wrong');
        });

        it('should return fallback message for unknown status codes', () => {
            expect(service.getErrorMessage(418)).toBe('An unexpected error occurred.');
        });

        it('should return appropriate message for 429', () => {
            expect(service.getErrorMessage(429)).toContain('Too many requests');
        });
    });
});

// #endregion
