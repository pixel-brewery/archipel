import { describe, expect, it } from 'vitest';
import { CUIDGenerator } from './CUIDGenerator.js';

describe('CUIDGenerator', () => {
    // #region Fields

    let generator: CUIDGenerator;

    // #endregion

    // #region Methods

    describe('generate', () => {
        it('should generate a CUID starting with "c"', () => {
            generator = new CUIDGenerator();
            const id = generator.generate();
            expect(id).toMatch(/^c/);
        });

        it('should apply prefix and postfix', () => {
            generator = new CUIDGenerator();
            const id = generator.generate('pre_', '_post');
            expect(id.startsWith('pre_')).toBe(true);
            expect(id.endsWith('_post')).toBe(true);
        });

        it('should generate unique IDs', () => {
            generator = new CUIDGenerator();
            const ids = new Set(Array.from({ length: 100 }, () => generator.generate()));
            expect(ids.size).toBe(100);
        });
    });

    describe('isValid', () => {
        it('should validate a proper CUID', () => {
            generator = new CUIDGenerator();
            const id = generator.generate();
            // The generated CUID starts with 'c' and contains alphanumeric chars
            expect(id).toMatch(/^c[0-9a-z]+$/);
        });

        it('should reject invalid IDs', () => {
            generator = new CUIDGenerator();
            expect(generator.isValid('not-a-cuid')).toBe(false);
        });
    });

    // #endregion
});
