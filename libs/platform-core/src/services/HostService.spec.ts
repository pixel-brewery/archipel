// #region Imports

import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { MockedObject } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ConfigService } from '@pixel-brewery/archipel-platform-configuration';
import type { ContentTemplateEngine } from '../templates/ContentTemplateEngine.js';
import { HostService, IHostContentParams } from './HostService.js';

// #endregion

describe('HostService', () => {
    // #region Fields

    let service: HostService;
    let mockConfigService: MockedObject<ConfigService>;
    let mockContentTemplateEngine: MockedObject<ContentTemplateEngine>;

    // #endregion

    // #region Setup

    beforeEach(() => {
        // Mock ConfigService
        mockConfigService = {
            get: vi.fn().mockReturnValue('http://localhost'),
            tryGet: vi.fn().mockReturnValue('unknown'),
        } as unknown as MockedObject<ConfigService>;

        // Mock ContentTemplateEngine
        mockContentTemplateEngine = {
            compileTemplate: vi.fn(),
        } as unknown as MockedObject<ContentTemplateEngine>;

        // Mock ResourceManager
        const actualTemplate = readFileSync(resolve(import.meta.dirname, '../../assets/index.html'), 'utf-8');
        const mockResourceManager = {
            loadAsStringAsync: vi.fn().mockResolvedValue(actualTemplate),
        } as unknown as MockedObject<any>;

        service = new HostService(mockConfigService, mockContentTemplateEngine, mockResourceManager);
    });

    // #endregion

    // #region Constructor Tests

    describe('Constructor', () => {
        it('should create instance with dependencies', () => {
            // Act & Assert
            expect(service).toBeDefined();
            expect(service).toBeInstanceOf(HostService);
        });

        it('should store dependencies correctly', () => {
            // Assert - Test via public interface
            expect(service.url).toBeDefined();
            expect(service.port).toBeDefined();
        });
    });

    // #endregion

    // #region url Property Tests

    describe('url property', () => {
        it('should return APP_URL from config', () => {
            // Arrange
            const expectedUrl = 'https://api.example.test';
            mockConfigService.get.mockReturnValue(expectedUrl);

            // Act
            const result = service.url;

            // Assert
            expect(result).toBe(expectedUrl);
            expect(mockConfigService.get).toHaveBeenCalledWith('APP_URL');
        });

        it('should call config service each time accessed', () => {
            // Arrange
            mockConfigService.get.mockReturnValue('https://example.com');

            // Act
            const url1 = service.url;
            const url2 = service.url;

            // Assert
            expect(url1).toBe('https://example.com');
            expect(url2).toBe('https://example.com');
            expect(mockConfigService.get).toHaveBeenCalledTimes(2);
        });
    });

    // #endregion

    // #region port Property Tests

    describe('port property', () => {
        it('should return APP_PORT from config as number', () => {
            // Arrange
            const expectedPort = 3000;
            mockConfigService.get.mockReturnValue(expectedPort);

            // Act
            const result = service.port;

            // Assert
            expect(result).toBe(expectedPort);
            expect(mockConfigService.get).toHaveBeenCalledWith('APP_PORT');
        });

        it('should handle string port values', () => {
            // Arrange
            const portValue = '8080';
            mockConfigService.get.mockReturnValue(portValue);

            // Act
            const result = service.port;

            // Assert
            expect(result).toBe(portValue);
            expect(mockConfigService.get).toHaveBeenCalledWith('APP_PORT');
        });

        it('should call config service each time accessed', () => {
            // Arrange
            mockConfigService.get.mockReturnValue(4000);

            // Act
            const port1 = service.port;
            const port2 = service.port;

            // Assert
            expect(port1).toBe(4000);
            expect(port2).toBe(4000);
            expect(mockConfigService.get).toHaveBeenCalledTimes(2);
        });
    });

    // #endregion

    // #region host Tests

    describe('host', () => {
        it('should return URL with port in development environment', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce('development'); // NODE_ENV
            mockConfigService.get
                .mockReturnValueOnce('http://localhost') // APP_URL
                .mockReturnValueOnce(3000); // APP_PORT

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('http://localhost:3000');
            expect(mockConfigService.tryGet).toHaveBeenCalledWith('NODE_ENV', 'unknown');
        });

        it('should return URL without port in production environment', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce('production'); // NODE_ENV
            mockConfigService.get.mockReturnValueOnce('https://api.example.test'); // APP_URL

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('https://api.example.test');
            expect(mockConfigService.tryGet).toHaveBeenCalledWith('NODE_ENV', 'unknown');
        });

        it('should return URL without port in staging environment', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce('staging'); // NODE_ENV
            mockConfigService.get.mockReturnValueOnce('https://staging-api.example.test'); // APP_URL

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('https://staging-api.example.test');
        });

        it('should return URL without port in test environment', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce('test'); // NODE_ENV
            mockConfigService.get.mockReturnValueOnce('http://test.example.com'); // APP_URL

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('http://test.example.com');
        });

        it('should handle undefined NODE_ENV as non-development', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce(undefined); // NODE_ENV
            mockConfigService.get.mockReturnValueOnce('https://api.example.test'); // APP_URL

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('https://api.example.test');
        });

        it('should handle custom port in development', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValueOnce('development'); // NODE_ENV
            mockConfigService.get
                .mockReturnValueOnce('http://localhost') // APP_URL
                .mockReturnValueOnce(8080); // APP_PORT

            // Act
            const result = service.host;

            // Assert
            expect(result).toBe('http://localhost:8080');
        });
    });

    // #endregion

    // #region getHostContent() Tests

    describe('getHostContent()', () => {
        it('should compile template with provided parameters', async () => {
            // Arrange
            const params = {
                title: 'Test API',
                description: 'Test Description',
                logo: 'data:image/svg+xml;base64,test',
                features: [],
            };
            const expectedOutput = '<html>compiled template</html>';
            mockContentTemplateEngine.compileTemplate.mockReturnValue(expectedOutput);

            // Act
            const result = await service.getHostContent(params);

            // Assert
            expect(result).toBe(expectedOutput);
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledWith(
                expect.stringMatching(/<!doctype html>/iu),
                expect.objectContaining({
                    title: 'Test API',
                    description: 'Test Description',
                    logo: 'data:image/svg+xml;base64,test',
                }),
            );
        });

        it('should pass complete HTML template to engine', async () => {
            // Arrange
            const params = {
                title: 'Test',
                description: '',
                logo: '',
            } satisfies IHostContentParams;
            mockContentTemplateEngine.compileTemplate.mockReturnValue('result');

            // Act
            await service.getHostContent(params);

            // Assert
            const [template] = mockContentTemplateEngine.compileTemplate.mock.calls[0];
            expect(template).toMatch(/<!doctype html>/iu);
            expect(template).toContain('<html lang="en">');
            expect(template).toContain('<title>{{title}}</title>');
            expect(template).toContain('{{#each features}}');
            expect(template).toContain('</html>');
        });

        it('should handle complex feature array', async () => {
            // Arrange
            const params = {
                title: 'Example Backend API',
                description: 'Advanced backend services',
                logo: 'data:image/svg+xml;base64,PHN2Zw==',
                features: [
                    {
                        title: 'Feature 1',
                        description: 'Description 1',
                        link: 'https://example.com/1',
                    },
                    {
                        title: 'Feature 2',
                        description: 'Description 2',
                        link: 'https://example.com/2',
                    },
                ],
            };
            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>features</html>');

            // Act
            const result = await service.getHostContent(params);

            // Assert
            expect(result).toBe('<html>features</html>');
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ title: 'Example Backend API', description: 'Advanced backend services' }),
            );
        });

        it('should include all required CSS styles in template', async () => {
            // Arrange
            const params = {
                title: 'Test',
                description: '',
                logo: '',
            } satisfies IHostContentParams;
            mockContentTemplateEngine.compileTemplate.mockReturnValue('result');

            // Act
            await service.getHostContent(params);

            // Assert
            const [template] = mockContentTemplateEngine.compileTemplate.mock.calls[0];
            expect(template).toContain('tailwindcss');
            expect(template).toContain('background: linear-gradient');
            expect(template).toContain('gradient-text');
            expect(template).toContain('bg-[#0d0d0d]');
            expect(template).toContain('{{#each features}}');
            expect(template).toContain('{{#each actions}}');
        });

        it('should include responsive design elements', async () => {
            // Arrange
            const params = {
                title: 'Test',
                description: '',
                logo: '',
            } satisfies IHostContentParams;
            mockContentTemplateEngine.compileTemplate.mockReturnValue('result');

            // Act
            await service.getHostContent(params);

            // Assert
            const [template] = mockContentTemplateEngine.compileTemplate.mock.calls[0];
            expect(template).toContain('viewport');
            expect(template).toContain('sm:grid-cols-2');
            expect(template).toContain('max-w-6xl');
        });

        it('should handle template engine errors gracefully', async () => {
            // Arrange
            const params = {
                title: 'Test',
                description: '',
                logo: '',
            } satisfies IHostContentParams;
            const error = new Error('Template compilation failed');
            mockContentTemplateEngine.compileTemplate.mockImplementation(() => {
                throw error;
            });

            // Act & Assert
            await expect(() => service.getHostContent(params)).rejects.toThrow('Template compilation failed');
        });

        it('should pass parameters as-is to template engine', async () => {
            // Arrange
            const originalParams: IHostContentParams = {
                title: 'Original Title',
                description: 'Original Description',
                logo: 'https://example.com/logo.png',
            };
            mockContentTemplateEngine.compileTemplate.mockReturnValue('result');

            // Act
            await service.getHostContent(originalParams);

            // Assert
            const [, passedParams] = mockContentTemplateEngine.compileTemplate.mock.calls[0];
            expect(passedParams).toEqual(
                expect.objectContaining({
                    title: originalParams.title,
                    description: originalParams.description,
                    logo: originalParams.logo,
                }),
            );
        });
    });

    // #endregion

    // #region Integration Tests

    describe('Integration Tests', () => {
        it('should work with real-like configuration', async () => {
            // Arrange
            mockConfigService.tryGet.mockImplementation((key: string) => {
                if (key === 'NODE_ENV') return 'development';
                return 'unknown';
            });
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'APP_URL':
                        return 'http://localhost';
                    case 'APP_PORT':
                        return 3000;
                    default:
                        return undefined;
                }
            });

            mockContentTemplateEngine.compileTemplate.mockImplementation((template, params) => {
                // Simple mock implementation that replaces {{title}}
                return template.replace('{{title}}', params.title as string);
            });

            // Act
            const hostUrl = service.host;
            const content = await service.getHostContent({
                title: 'Test API',
                description: '',
                logo: '',
            });

            // Assert
            expect(hostUrl).toBe('http://localhost:3000');
            expect(content).toContain('Test API');
        });

        it('should handle production environment correctly', async () => {
            // Arrange
            mockConfigService.tryGet.mockImplementation((key: string) => {
                if (key === 'NODE_ENV') return 'production';
                return 'unknown';
            });
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'APP_URL':
                        return 'https://api.example.test';
                    case 'APP_PORT':
                        return 443;
                    default:
                        return undefined;
                }
            });

            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>prod</html>');

            // Act
            const hostUrl = service.host;
            const content = await service.getHostContent({
                title: 'Example API',
                description: 'Production API',
                logo: '',
            });

            // Assert
            expect(hostUrl).toBe('https://api.example.test');
            expect(content).toBe('<html>prod</html>');
        });

        it('should maintain consistency across multiple calls', async () => {
            // Arrange
            mockConfigService.tryGet.mockImplementation((key: string) => {
                if (key === 'NODE_ENV') return 'development';
                return 'unknown';
            });
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'APP_URL':
                        return 'http://localhost';
                    case 'APP_PORT':
                        return 3000;
                    default:
                        return undefined;
                }
            });
            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>test</html>');

            // Act
            const url1 = service.host;
            const url2 = service.host;
            const content1 = await service.getHostContent({
                title: 'Test1',
                description: '',
                logo: '',
            });
            const content2 = await service.getHostContent({
                title: 'Test2',
                description: '',
                logo: '',
            });

            // Assert
            expect(url1).toBe(url2);
            expect(content1).toBe('<html>test</html>');
            expect(content2).toBe('<html>test</html>');
        });
    });

    // #endregion

    // #region Edge Cases

    describe('Edge Cases', () => {
        it('should handle null/undefined config values', () => {
            // Arrange
            mockConfigService.get.mockReturnValue(null);

            // Act & Assert
            expect(() => service.url).not.toThrow();
            expect(() => service.port).not.toThrow();
            expect(() => service.host).not.toThrow();
        });

        it('should handle empty string config values', () => {
            // Arrange
            mockConfigService.tryGet.mockReturnValue('');
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'APP_URL':
                        return '';
                    case 'APP_PORT':
                        return '';
                    default:
                        return '';
                }
            });

            // Act
            const hostUrl = service.host;

            // Assert
            expect(hostUrl).toBe(''); // Empty URL, no port appended
        });

        it('should handle very large parameter objects', async () => {
            // Arrange
            const largeParams = {
                title: 'Test',
                description: '',
                logo: '',
                features: Array.from({ length: 1000 }, (_, i) => ({
                    title: `Feature ${i}`,
                    description: `Description for feature ${i}`,
                    link: `https://example.com/${i}`,
                })),
            };
            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>large</html>');

            // Act
            const result = await service.getHostContent(largeParams);

            // Assert
            expect(result).toBe('<html>large</html>');
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({ title: 'Test', description: '', logo: '' }),
            );
        });

        it('should handle special characters in parameters', async () => {
            // Arrange
            const paramsWithSpecialChars = {
                title: '<script>alert("test")</script>',
                description: 'äöü ñ 🚀 💪 && || "quotes" \'apostrophes\'',
                logo: 'data:image/svg+xml;base64,PHN2Zw==',
            };
            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>escaped</html>');

            // Act
            const result = await service.getHostContent(paramsWithSpecialChars);

            // Assert
            expect(result).toBe('<html>escaped</html>');
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    title: '<script>alert("test")</script>',
                    description: 'äöü ñ 🚀 💪 && || "quotes" \'apostrophes\'',
                    logo: 'data:image/svg+xml;base64,PHN2Zw==',
                }),
            );
        });

        it('should handle config service throwing errors', () => {
            // Arrange
            mockConfigService.get.mockImplementation(() => {
                throw new Error('Config service error');
            });

            // Act & Assert
            expect(() => service.url).toThrow('Config service error');
            expect(() => service.port).toThrow('Config service error');
            expect(() => service.host).toThrow('Config service error');
        });
    });

    // #endregion

    // #region Performance Tests

    describe('Performance', () => {
        it('should handle multiple rapid host property accesses efficiently', () => {
            // Arrange
            mockConfigService.tryGet.mockImplementation((key: string) => {
                if (key === 'NODE_ENV') return 'development';
                return 'unknown';
            });
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'APP_URL':
                        return 'http://localhost';
                    case 'APP_PORT':
                        return 3000;
                    default:
                        return undefined;
                }
            });

            // Act
            const start = Date.now();
            for (let i = 0; i < 1000; i++) {
                const _ = service.host;
            }
            const end = Date.now();

            // Assert
            expect(end - start).toBeLessThan(100); // Should complete quickly
        });

        it('should handle multiple getHostContent calls efficiently', async () => {
            // Arrange
            mockContentTemplateEngine.compileTemplate.mockReturnValue('<html>fast</html>');
            const params = {
                title: 'Test',
                description: '',
                logo: '',
            };

            // Act
            const start = Date.now();
            for (let i = 0; i < 100; i++) {
                await service.getHostContent(params);
            }
            const end = Date.now();

            // Assert
            expect(end - start).toBeLessThan(1000); // Should complete within 1 second
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledTimes(100);
        });
    });

    // #endregion

    // #region Mock Verification Tests

    describe('Mock Verification', () => {
        it('should call config service with correct keys', () => {
            // Act
            const _ = service.url;
            const __ = service.port;
            const ___ = service.host;

            // Assert
            expect(mockConfigService.get).toHaveBeenCalledWith('APP_URL');
            expect(mockConfigService.get).toHaveBeenCalledWith('APP_PORT');
            expect(mockConfigService.tryGet).toHaveBeenCalledWith('NODE_ENV', 'unknown');
        });

        it('should call template engine with correct parameters', async () => {
            // Arrange
            const params = {
                title: 'Test',
                description: 'Test desc',
                logo: '',
            };

            // Act
            await service.getHostContent(params);

            // Assert
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledTimes(1);
            expect(mockContentTemplateEngine.compileTemplate).toHaveBeenCalledWith(
                expect.stringMatching(/<!doctype html>/iu),
                expect.objectContaining({ title: 'Test', description: 'Test desc', logo: '' }),
            );
        });

        it('should not call dependencies unnecessarily', () => {
            // Act
            // Don't call any methods

            // Assert
            expect(mockConfigService.get).not.toHaveBeenCalled();
            expect(mockContentTemplateEngine.compileTemplate).not.toHaveBeenCalled();
        });
    });

    // #endregion
});
