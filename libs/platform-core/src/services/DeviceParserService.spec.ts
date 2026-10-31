// #region Imports

import { beforeEach, describe, expect, it } from 'vitest';
import { DeviceParserService, type IDeviceInfo } from './DeviceParserService.js';

// #endregion

describe('DeviceParserService', () => {
    // #region Fields

    let service: DeviceParserService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        service = new DeviceParserService();
    });

    // #endregion

    // #region parse() Tests - Desktop Browsers

    describe('parse() - Desktop Browsers', () => {
        it('should parse Chrome on Windows', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe(userAgent);
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Chrome');
            expect(result.browserVersion).toMatch(/^120\./);
            expect(result.osName).toBe('Windows');
            expect(result.osVersion).toBe('10');
            expect(result.deviceName).toContain('Windows');
            expect(result.deviceName).toContain('Chrome');
        });

        it('should parse Firefox on macOS', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Firefox');
            expect(result.browserVersion).toMatch(/^118\./);
            expect(result.osName).toBe('macOS');
            expect(result.osVersion).toBe('10.15');
            expect(result.deviceName).toContain('macOS');
            expect(result.deviceName).toContain('Firefox');
        });

        it('should parse Safari on macOS', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Safari');
            expect(result.browserVersion).toMatch(/^17\./);
            expect(result.osName).toBe('macOS');
            expect(result.osVersion).toBe('10.15.7');
        });

        it('should parse Edge on Windows', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Edge');
            expect(result.osName).toBe('Windows');
        });

        it('should parse Chrome on Linux', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Chrome');
            expect(result.osName).toBe('Linux');
        });
    });

    // #endregion

    // #region parse() Tests - Mobile Browsers

    describe('parse() - Mobile Browsers', () => {
        it('should parse Chrome on Android', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('mobile');
            expect(result.browserName).toBe('Mobile Chrome');
            expect(result.osName).toBe('Android');
            expect(result.osVersion).toBe('13');
            expect(result.deviceName).toContain('Android');
            expect(result.deviceName).toContain('Chrome');
            expect(result.deviceName).toContain('Samsung'); // Should include vendor
            expect(result.deviceName).toContain('SM-G991B'); // Should include model
        });

        it('should parse Safari on iOS iPhone', () => {
            // Arrange
            const userAgent =
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('mobile');
            expect(result.browserName).toBe('Mobile Safari');
            expect(result.osName).toBe('iOS');
            expect(result.osVersion).toBe('17.1');
            expect(result.deviceName).toContain('iOS');
        });

        it('should parse Firefox on Android', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Mobile; rv:109.0) Gecko/109.0 Firefox/118.0';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('mobile');
            expect(result.browserName).toBe('Mobile Firefox');
        });

        it('should parse Samsung Internet on Android', () => {
            // Arrange
            const userAgent =
                'Mozilla/5.0 (Linux; Android 13; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('mobile');
            expect(result.browserName).toBe('Samsung Internet');
            expect(result.osName).toBe('Android');
        });
    });

    // #endregion

    // #region parse() Tests - Tablet Browsers

    describe('parse() - Tablet Browsers', () => {
        it('should parse Safari on iPad', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('tablet');
            expect(result.browserName).toBe('Mobile Safari');
            expect(result.osName).toBe('iOS');
            expect(result.osVersion).toBe('17.1');
            expect(result.deviceName).toContain('iOS');
        });

        it('should parse Chrome on Android tablet', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Linux; Android 13; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('tablet');
            expect(result.browserName).toBe('Chrome');
            expect(result.osName).toBe('Android');
            expect(result.deviceName).toContain('Samsung'); // Should include vendor
            expect(result.deviceName).toContain('SM-T870'); // Should include model
        });
    });

    // #endregion

    // #region parse() Tests - Console & Smart TV

    describe('parse() - Console & Smart TV', () => {
        it('should parse PlayStation browser', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (PlayStation 5 5.50) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('console');
            expect(result.browserName).toBe('Safari');
        });

        it('should parse Smart TV browser', () => {
            // Arrange
            const userAgent =
                'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/76.0.3809.146 TV Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('smarttv');
            expect(result.browserName).toBe('Samsung Internet');
            expect(result.osName).toBe('Tizen');
        });
    });

    // #endregion

    // #region parse() Tests - Edge Cases

    describe('parse() - Edge Cases', () => {
        it('should handle empty user agent', () => {
            // Arrange
            const userAgent = '';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe('');
            expect(result.deviceType).toBe('desktop'); // Default fallback
            expect(result.browserName).toBe('Unknown Browser');
            expect(result.browserVersion).toBeNull();
            expect(result.osName).toBe('Unknown OS');
            expect(result.osVersion).toBeNull();
            expect(result.deviceName).toBe('Desktop'); // Fallback to device type
        });

        it('should handle null user agent', () => {
            // Arrange
            const userAgent = null as unknown as string;

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Unknown Browser');
            expect(result.osName).toBe('Unknown OS');
        });

        it('should handle undefined user agent', () => {
            // Arrange
            const userAgent = undefined as unknown as string;

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Unknown Browser');
            expect(result.osName).toBe('Unknown OS');
        });

        it('should handle malformed user agent', () => {
            // Arrange
            const userAgent = 'completely-invalid-user-agent-string';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe(userAgent);
            expect(result.deviceType).toBe('desktop');
            expect(result.browserName).toBe('Unknown Browser');
            expect(result.osName).toBe('Unknown OS');
        });

        it('should handle very long user agent', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 '.repeat(1000) + '(Windows NT 10.0; Win64; x64)';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe(userAgent);
            expect(result.deviceType).toBe('desktop');
        });

        it('should handle user agent with special characters', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (äöü; 🚀; テスト) Webkit/537.36 Test/1.0';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe(userAgent);
            expect(result.deviceType).toBe('desktop');
        });

        it('should handle bot user agents', () => {
            // Arrange
            const userAgent = 'Googlebot/2.1 (+http://www.google.com/bot.html)';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result).toBeDefined();
            expect(result.userAgent).toBe(userAgent);
            expect(result.deviceType).toBe('desktop'); // Fallback for bots
        });
    });

    // #endregion

    // #region Device Name Building Tests

    describe('Device Name Building', () => {
        it('should build device name with all available info for mobile', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Linux; Android 13; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result.deviceName).toContain('Android');
            expect(result.deviceName).toContain('Chrome');
            expect(result.deviceName).toContain('Google'); // Vendor
            expect(result.deviceName).toContain('Pixel 7 Pro'); // Model
            expect(result.deviceName).toMatch(/Android.*·.*Chrome.*·.*Google.*·.*Pixel 7 Pro/);
        });

        it('should build device name without vendor/model for desktop', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result.deviceName).toContain('Windows');
            expect(result.deviceName).toContain('Chrome');
            expect(result.deviceName).not.toContain('Google'); // No vendor for desktop
            expect(result.deviceName).toMatch(/Windows.*·.*Chrome/);
        });

        it('should fallback to device type when no info available', () => {
            // Arrange
            const userAgent = '';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result.deviceName).toBe('Desktop');
        });

        it('should handle partial info gracefully', () => {
            // Arrange
            const userAgent = 'SomeUnknownBrowser/1.0';

            // Act
            const result = service.parse(userAgent);

            // Assert
            expect(result.deviceName).toBe('Desktop'); // Fallback when no recognizable parts
        });
    });

    // #endregion

    // #region Interface Compliance Tests

    describe('Interface Compliance', () => {
        it('should return complete IDeviceInfo interface', () => {
            // Arrange
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

            // Act
            const result = service.parse(userAgent);

            // Assert - Check all required properties exist
            expect(result).toHaveProperty('userAgent');
            expect(result).toHaveProperty('deviceType');
            expect(result).toHaveProperty('deviceName');
            expect(result).toHaveProperty('browserName');
            expect(result).toHaveProperty('browserVersion');
            expect(result).toHaveProperty('osName');
            expect(result).toHaveProperty('osVersion');

            // Check types
            expect(typeof result.userAgent).toBe('string');
            expect(typeof result.deviceType).toBe('string');
            expect(typeof result.deviceName).toBe('string');
            expect(typeof result.browserName).toBe('string');
            expect(typeof result.osName).toBe('string');
            expect(result.browserVersion === null || typeof result.browserVersion === 'string').toBe(true);
            expect(result.osVersion === null || typeof result.osVersion === 'string').toBe(true);
        });

        it('should match IDeviceInfo type structure', () => {
            // Arrange
            const userAgent = 'test';

            // Act
            const result = service.parse(userAgent);

            // Assert - This is a compile-time check that should not fail
            const deviceInfo: IDeviceInfo = result;
            expect(deviceInfo).toBeDefined();
        });
    });

    // #endregion

    // #region Constructor Tests

    describe('Constructor', () => {
        it('should create instance without parameters', () => {
            // Act
            const newService = new DeviceParserService();

            // Assert
            expect(newService).toBeDefined();
            expect(newService).toBeInstanceOf(DeviceParserService);
        });

        it('should create multiple independent instances', () => {
            // Act
            const service1 = new DeviceParserService();
            const service2 = new DeviceParserService();

            // Assert
            expect(service1).toBeDefined();
            expect(service2).toBeDefined();
            expect(service1).not.toBe(service2);

            // Verify both work independently
            const userAgent = 'Mozilla/5.0 (Windows NT 10.0) Chrome/120.0.0.0';
            const result1 = service1.parse(userAgent);
            const result2 = service2.parse(userAgent);

            expect(result1).toEqual(result2);
        });
    });

    // #endregion

    // #region Performance Tests

    describe('Performance', () => {
        it('should handle large number of parses efficiently', () => {
            // Arrange
            const userAgents = [
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
                'Mozilla/5.0 (Linux; Android 13; SM-G991B) Chrome/120.0.0.0 Mobile',
                'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1) Safari/604.1',
                'Mozilla/5.0 (iPad; CPU OS 17_1) Safari/604.1',
            ];

            // Act
            const startTime = Date.now();
            for (let i = 0; i < 1000; i++) {
                const ua = userAgents[i % userAgents.length];
                const result = service.parse(ua);
                expect(result).toBeDefined();
            }
            const endTime = Date.now();

            // Assert - Should complete within reasonable time (< 2 seconds)
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(2000);
        });
    });

    // #endregion
});
