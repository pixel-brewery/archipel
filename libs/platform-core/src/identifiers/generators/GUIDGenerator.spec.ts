import { describe, it, expect } from 'vitest';
import { GUIDGenerator } from './GUIDGenerator.js';

describe('GUIDGenerator', () => {
    // #region Fields

    let generator: GUIDGenerator;

    // #endregion

    // #region Methods

    describe('generate', () => {
        it('should generate a valid GUID', () => {
            generator = new GUIDGenerator();
            const id = generator.generate();
            expect(generator.isValid(id)).toBe(true);
        });

        it('should apply prefix and postfix', () => {
            generator = new GUIDGenerator();
            const id = generator.generate('pre_', '_post');
            expect(id.startsWith('pre_')).toBe(true);
            expect(id.endsWith('_post')).toBe(true);
        });
    });

    describe('isValid', () => {
        it('should validate a proper GUID', () => {
            generator = new GUIDGenerator();
            expect(generator.isValid('A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D')).toBe(true);
        });

        it('should reject non-v4 GUIDs', () => {
            generator = new GUIDGenerator();
            expect(generator.isValid('not-a-guid')).toBe(false);
        });
    });

    // #endregion
});
