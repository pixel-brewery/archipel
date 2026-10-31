import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConfigService } from './ConfigService.js';

describe('ConfigService', () => {
    // #region Fields

    let service: ConfigService;
    let mockStrategy: Record<string, ReturnType<typeof vi.fn>>;
    let statics: Record<string, string>;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();

        mockStrategy = {
            initialize: vi.fn(),
            has: vi.fn().mockReturnValue(false),
            resolve: vi.fn(),
            tryResolve: vi.fn(),
        };

        statics = { STATIC_KEY: 'static-value' };

        service = new ConfigService(mockStrategy as never, statics);
    });

    describe('initialize', () => {
        it('should delegate to strategy', () => {
            service.initialize();
            expect(mockStrategy.initialize).toHaveBeenCalled();
        });
    });

    describe('get', () => {
        it('should return static value when present', () => {
            const result = service.get('STATIC_KEY');
            expect(result).toBe('static-value');
        });

        it('should delegate to strategy when not in statics', () => {
            // arrange
            mockStrategy.has.mockReturnValue(true);
            mockStrategy.resolve.mockReturnValue('dynamic');

            // act
            const result = service.get('DYNAMIC_KEY');

            // assert
            expect(result).toBe('dynamic');
        });

        it('should throw for unknown keys', () => {
            expect(() => service.get('UNKNOWN')).toThrow('Config key: UNKNOWN not found');
        });

        it('should parse boolean strings', () => {
            // arrange
            mockStrategy.has.mockReturnValue(true);
            mockStrategy.resolve.mockReturnValue('true');

            // act
            const result = service.get<boolean>('BOOL_KEY');

            // assert
            expect(result).toBe(true);
        });

        it('should return numeric strings as-is (no implicit coercion)', () => {
            // arrange
            mockStrategy.has.mockReturnValue(true);
            mockStrategy.resolve.mockReturnValue('42');

            // act
            const result = service.get<string>('NUM_KEY');

            // assert
            expect(result).toBe('42');
        });
    });

    describe('tryGet', () => {
        it('should return fallback when key not found', () => {
            const result = service.tryGet('MISSING', 'default');
            expect(result).toBe('default');
        });

        it('should return static value over fallback', () => {
            const result = service.tryGet('STATIC_KEY', 'default');
            expect(result).toBe('static-value');
        });
    });

    describe('compare', () => {
        it('should return true when values match', () => {
            // arrange
            mockStrategy.has.mockReturnValue(true);
            mockStrategy.resolve.mockReturnValue('42');

            // act & assert
            expect(service.compare('NUM_KEY', '42')).toBe(true);
        });

        it('should return false when values do not match', () => {
            // arrange
            mockStrategy.has.mockReturnValue(true);
            mockStrategy.resolve.mockReturnValue('42');

            // act & assert
            expect(service.compare('NUM_KEY', '99')).toBe(false);
        });
    });

    // #endregion
});
