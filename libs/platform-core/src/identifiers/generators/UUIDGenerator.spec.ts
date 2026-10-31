import { describe, expect, it } from 'vitest';
import { UUIDGenerator } from './UUIDGenerator.js';

describe('UUIDGenerator', () => {
    // #region Fields

    let generator: UUIDGenerator;

    // #endregion

    // #region Methods

    describe('generate', () => {
        it('should generate a valid v4 UUID', () => {
            generator = new UUIDGenerator();
            const id = generator.generate();
            expect(generator.isValid(id)).toBe(true);
        });

        it('should apply prefix and postfix', () => {
            generator = new UUIDGenerator();
            const id = generator.generate('pre_', '_post');
            expect(id.startsWith('pre_')).toBe(true);
            expect(id.endsWith('_post')).toBe(true);
        });
    });

    describe('isValid', () => {
        it('should validate a proper UUID', () => {
            generator = new UUIDGenerator();
            expect(generator.isValid('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')).toBe(true);
        });

        it('should reject invalid UUIDs', () => {
            generator = new UUIDGenerator();
            expect(generator.isValid('not-a-uuid')).toBe(false);
        });
    });

    // #endregion
});
