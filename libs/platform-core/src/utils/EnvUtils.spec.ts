import { describe, expect, it } from 'vitest';
import { env } from './EnvUtils.js';

describe('EnvUtils', () => {
    // #region Methods

    describe('env', () => {
        it('should behave like a normal template literal', () => {
            const name = 'DATABASE_URL';
            expect(env`${name}`).toBe('DATABASE_URL');
        });

        it('should concatenate multiple values', () => {
            const host = 'localhost';
            const port = 5432;
            expect(env`${host}:${port}`).toBe('localhost:5432');
        });

        it('should return plain string when no interpolation', () => {
            expect(env`MY_VAR`).toBe('MY_VAR');
        });
    });

    // #endregion
});
