// #region Imports

import { describe, it, expect, beforeEach } from 'vitest';
import { NameGeneratorService } from './NameGeneratorService.js';

// #endregion

describe('NameGeneratorService', () => {
    // #region Fields

    let service: NameGeneratorService;

    // #endregion

    // #region Setup

    beforeEach(() => {
        service = new NameGeneratorService();
    });

    // #endregion

    // #region generate() Tests

    describe('generate()', () => {
        it('should generate username with numbers by default', () => {
            // Act
            const result = service.generate();

            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);

            // Should match pattern: Adjective + Noun + Numbers
            expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);

            // Should end with exactly 3 digits
            expect(result).toMatch(/\d{3}$/);
        });

        it('should generate username without numbers when useNumbers is false', () => {
            // Act
            const result = service.generate(false);

            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);

            // Should match pattern: Adjective + Noun (no numbers)
            expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+$/);

            // Should NOT contain any digits
            expect(result).not.toMatch(/\d/);
        });

        it('should generate username with numbers when useNumbers is true', () => {
            // Act
            const result = service.generate(true);

            // Assert
            expect(result).toBeDefined();
            expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
            expect(result).toMatch(/\d{3}$/);
        });

        it('should generate different usernames on multiple calls', () => {
            // Arrange
            const usernames = new Set<string>();
            const iterations = 100;

            // Act
            for (let i = 0; i < iterations; i++) {
                const username = service.generate();
                usernames.add(username);
            }

            // Assert - Should have high uniqueness (allow for some collision due to randomness)
            expect(usernames.size).toBeGreaterThan(iterations * 0.8); // At least 80% unique
        });

        it('should use valid adjectives from the internal list', () => {
            // Arrange
            const expectedAdjectives = [
                'Brave',
                'Clever',
                'Curious',
                'Daring',
                'Eager',
                'Fancy',
                'Glowing',
                'Happy',
                'Joyful',
                'Keen',
                'Lively',
                'Mighty',
                'Noble',
                'Proud',
                'Quiet',
                'Radiant',
                'Shiny',
                'Swift',
                'Tidy',
                'Vivid',
                'Wise',
                'Zesty',
            ];

            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate(false)); // Without numbers for easier parsing
            }

            // Assert
            const foundAdjectives = results.map((username) => {
                const match = username.match(/^([A-Z][a-z]+)/);
                return match ? match[1] : '';
            });

            const uniqueAdjectives = new Set(foundAdjectives);
            for (const adjective of uniqueAdjectives) {
                expect(expectedAdjectives).toContain(adjective);
            }
        });

        it('should use valid nouns from the internal list', () => {
            // Arrange
            const expectedNouns = [
                'Tiger',
                'Phoenix',
                'Unicorn',
                'Eagle',
                'Dragon',
                'Lion',
                'Panther',
                'Falcon',
                'Bear',
                'Wolf',
                'Shark',
                'Cheetah',
                'Owl',
                'Gorilla',
                'Leopard',
                'Penguin',
                'Rhino',
                'Serpent',
                'Turtle',
                'Whale',
                'Yak',
                'Zebra',
            ];

            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate(false)); // Without numbers for easier parsing
            }

            // Assert
            const foundNouns = results.map((username) => {
                const match = username.match(/^[A-Z][a-z]+([A-Z][a-z]+)$/);
                return match ? match[1] : '';
            });

            const uniqueNouns = new Set(foundNouns);
            for (const noun of uniqueNouns) {
                expect(expectedNouns).toContain(noun);
            }
        });

        it('should generate numbers with correct length and padding', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate(true));
            }

            // Assert
            for (const result of results) {
                const numberPart = result.match(/(\d+)$/);
                expect(numberPart).not.toBeNull();
                expect(numberPart![1]).toHaveLength(3); // Should always be 3 digits

                // Test padding - numbers less than 100 should be padded
                if (parseInt(numberPart![1]) < 100) {
                    expect(numberPart![1].startsWith('0')).toBe(true);
                }
            }
        });
    });

    // #endregion

    // #region generateSecure() Tests

    describe('generateSecure()', () => {
        it('should generate secure username with hex suffix', () => {
            // Act
            const result = service.generateSecure();

            // Assert
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result.length).toBeGreaterThan(0);

            // Should match pattern: Adjective + Noun + HexString (4 chars)
            expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+[0-9a-f]{4}$/);

            // Should end with exactly 4 hex characters
            expect(result).toMatch(/[0-9a-f]{4}$/);
        });

        it('should generate different secure usernames on multiple calls', () => {
            // Arrange
            const usernames = new Set<string>();
            const iterations = 100;

            // Act
            for (let i = 0; i < iterations; i++) {
                const username = service.generateSecure();
                usernames.add(username);
            }

            // Assert - Should be highly unique due to crypto randomness
            expect(usernames.size).toBe(iterations); // Should be 100% unique
        });

        it('should use cryptographically secure random bytes', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generateSecure());
            }

            // Assert - Extract hex parts and verify they are valid hex
            const hexParts = results.map((username) => {
                const match = username.match(/([0-9a-f]{4})$/);
                return match ? match[1] : '';
            });

            for (const hex of hexParts) {
                expect(hex).toMatch(/^[0-9a-f]{4}$/);
                expect(hex).toHaveLength(4);
            }

            // Should have high entropy (no obvious patterns)
            const uniqueHexParts = new Set(hexParts);
            expect(uniqueHexParts.size).toBeGreaterThan(hexParts.length * 0.95); // At least 95% unique
        });

        it('should use same adjectives and nouns as regular generate', () => {
            // Arrange
            const expectedAdjectives = [
                'Brave',
                'Clever',
                'Curious',
                'Daring',
                'Eager',
                'Fancy',
                'Glowing',
                'Happy',
                'Joyful',
                'Keen',
                'Lively',
                'Mighty',
                'Noble',
                'Proud',
                'Quiet',
                'Radiant',
                'Shiny',
                'Swift',
                'Tidy',
                'Vivid',
                'Wise',
                'Zesty',
            ];

            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generateSecure());
            }

            // Assert
            const foundAdjectives = results.map((username) => {
                const match = username.match(/^([A-Z][a-z]+)/);
                return match ? match[1] : '';
            });

            const uniqueAdjectives = new Set(foundAdjectives);
            for (const adjective of uniqueAdjectives) {
                expect(expectedAdjectives).toContain(adjective);
            }
        });
    });

    // #endregion

    // #region Private Method Tests (via public interface)

    describe('Private Methods (via public interface)', () => {
        it('should use getRandomElement to select from arrays', () => {
            // Act - Generate many usernames to test randomness
            const results: Array<string> = [];
            for (let i = 0; i < 1000; i++) {
                results.push(service.generate(false));
            }

            // Assert - Should use multiple different adjectives and nouns
            const adjectives = new Set(results.map((r) => r.match(/^([A-Z][a-z]+)/)?.[1]));
            const nouns = new Set(results.map((r) => r.match(/^[A-Z][a-z]+([A-Z][a-z]+)$/)?.[1]));

            expect(adjectives.size).toBeGreaterThan(10); // Should use many different adjectives
            expect(nouns.size).toBeGreaterThan(10); // Should use many different nouns
        });

        it('should use getRandomNumbers for number generation', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 1000; i++) {
                results.push(service.generate(true));
            }

            // Assert - Extract number parts
            const numbers = results.map((r) => {
                const match = r.match(/(\d{3})$/);
                return match ? parseInt(match[1]) : -1;
            });

            // Should cover a wide range of numbers (0-999)
            const uniqueNumbers = new Set(numbers);
            expect(uniqueNumbers.size).toBeGreaterThan(100); // Should have good distribution

            // All should be valid 3-digit numbers (including padded ones)
            for (const num of numbers) {
                expect(num).toBeGreaterThanOrEqual(0);
                expect(num).toBeLessThanOrEqual(999);
            }
        });

        it('should properly pad short numbers', () => {
            // Arrange & Act - Generate many usernames to test padding
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate(true));
            }

            // Assert - All usernames should end with exactly 3 digits (padded with leading zeros if needed)
            for (const username of results) {
                const match = username.match(/(\d{3})$/);
                expect(match).toBeTruthy();
                expect(match?.[1].length).toBe(3);
            }

            // Verify that the padding actually works by checking the format
            // All numbers should be exactly 3 digits (000-999)
            const allThreeDigits = results.every((r) => {
                const match = r.match(/(\d{3})$/);
                return match && match[1].length === 3;
            });
            expect(allThreeDigits).toBe(true);
        });
    });

    // #endregion

    // #region Edge Cases

    describe('Edge Cases', () => {
        it('should handle multiple rapid calls', () => {
            // Act
            const results: Array<string> = [];
            const start = Date.now();

            for (let i = 0; i < 10000; i++) {
                results.push(service.generate());
            }

            const end = Date.now();

            // Assert
            expect(results).toHaveLength(10000);
            expect(end - start).toBeLessThan(1000); // Should complete quickly

            // All should be valid
            for (const result of results) {
                expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
            }
        });

        it('should maintain consistency across service instances', () => {
            // Arrange
            const service1 = new NameGeneratorService();
            const service2 = new NameGeneratorService();

            // Act
            const results1: Array<string> = [];
            const results2: Array<string> = [];

            for (let i = 0; i < 100; i++) {
                results1.push(service1.generate());
                results2.push(service2.generate());
            }

            // Assert - Both should produce valid usernames
            for (const result of [...results1, ...results2]) {
                expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
            }
        });

        it('should handle mixed calls to generate() and generateSecure()', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                if (i % 2 === 0) {
                    results.push(service.generate());
                } else {
                    results.push(service.generateSecure());
                }
            }

            // Assert
            expect(results).toHaveLength(100);

            // Verify alternating patterns
            for (let i = 0; i < results.length; i++) {
                if (i % 2 === 0) {
                    // Regular generate() - should end with 3 digits
                    expect(results[i]).toMatch(/\d{3}$/);
                } else {
                    // generateSecure() - should end with 4 hex chars
                    expect(results[i]).toMatch(/[0-9a-f]{4}$/);
                }
            }
        });
    });

    // #endregion

    // #region Constructor Tests

    describe('Constructor', () => {
        it('should create instance without parameters', () => {
            // Act
            const newService = new NameGeneratorService();

            // Assert
            expect(newService).toBeDefined();
            expect(newService).toBeInstanceOf(NameGeneratorService);
        });

        it('should create multiple independent instances', () => {
            // Act
            const service1 = new NameGeneratorService();
            const service2 = new NameGeneratorService();

            // Assert
            expect(service1).toBeDefined();
            expect(service2).toBeDefined();
            expect(service1).not.toBe(service2);

            // Both should work independently
            const result1 = service1.generate();
            const result2 = service2.generate();

            expect(result1).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
            expect(result2).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/);
        });
    });

    // #endregion

    // #region Format Validation Tests

    describe('Format Validation', () => {
        it('should always start with capital letter', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate());
                results.push(service.generate(false));
                results.push(service.generateSecure());
            }

            // Assert
            for (const result of results) {
                expect(result[0]).toMatch(/[A-Z]/);
            }
        });

        it('should have proper capitalization pattern', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate(false)); // Without numbers for easier testing
            }

            // Assert
            for (const result of results) {
                // Should have exactly 2 capital letters (start of adjective and noun)
                const capitals = result.match(/[A-Z]/g);
                expect(capitals).toHaveLength(2);

                // Should match CamelCase pattern
                expect(result).toMatch(/^[A-Z][a-z]+[A-Z][a-z]+$/);
            }
        });

        it('should not contain spaces or special characters', () => {
            // Act
            const results: Array<string> = [];
            for (let i = 0; i < 100; i++) {
                results.push(service.generate());
                results.push(service.generateSecure());
            }

            // Assert
            for (const result of results) {
                expect(result).not.toMatch(/\s/); // No whitespace
                expect(result).not.toMatch(/[^A-Za-z0-9a-f]/); // Only letters, digits, and hex chars
            }
        });
    });

    // #endregion

    // #region Performance Tests

    describe('Performance', () => {
        it('should generate usernames efficiently', () => {
            // Arrange
            const iterations = 10000;

            // Act
            const startTime = Date.now();
            for (let i = 0; i < iterations; i++) {
                service.generate();
            }
            const endTime = Date.now();

            // Assert
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });

        it('should generate secure usernames efficiently', () => {
            // Arrange
            const iterations = 1000;

            // Act
            const startTime = Date.now();
            for (let i = 0; i < iterations; i++) {
                service.generateSecure();
            }
            const endTime = Date.now();

            // Assert
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(1000); // Should complete within 1 second
        });
    });

    // #endregion
});
