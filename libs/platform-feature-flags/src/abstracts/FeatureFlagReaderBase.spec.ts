import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IFeatureFlagContext } from '../models/IFeatureFlagContext.js';
import type { IFeatureFlagEvaluation } from '../models/IFeatureFlagEvaluation.js';
import { FeatureFlagReaderBase } from './FeatureFlagReaderBase.js';

class TestFeatureFlagReader extends FeatureFlagReaderBase {
    // #region Methods

    public async isEnabled(_key: string, _context?: IFeatureFlagContext): Promise<boolean> {
        return false;
    }

    public async getVariant<T = unknown>(_key: string, defaultValue: T, _context?: IFeatureFlagContext): Promise<T> {
        return defaultValue;
    }

    public async getAllFlags(_context?: IFeatureFlagContext): Promise<ReadonlyArray<IFeatureFlagEvaluation>> {
        return [];
    }

    public async refresh(): Promise<void> {
        // no-op
    }

    // #endregion
}

describe('FeatureFlagReaderBase', () => {
    // #region Fields

    let reader: TestFeatureFlagReader;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        reader = new TestFeatureFlagReader();
    });

    describe('ping', () => {
        it('should return true by default', async () => {
            // arrange — nothing to arrange

            // act
            const result = await reader.ping();

            // assert
            expect(result).toBe(true);
        });
    });

    describe('isEnabled', () => {
        it('should be callable on a concrete subclass', async () => {
            // arrange
            const key = 'test-flag';

            // act
            const result = await reader.isEnabled(key);

            // assert
            expect(result).toBe(false);
        });
    });

    describe('getVariant', () => {
        it('should return the default value from the concrete subclass', async () => {
            // arrange
            const defaultValue = 'fallback';

            // act
            const result = await reader.getVariant('test-flag', defaultValue);

            // assert
            expect(result).toBe('fallback');
        });
    });

    describe('getAllFlags', () => {
        it('should return an empty array from the concrete subclass', async () => {
            // arrange — nothing to arrange

            // act
            const result = await reader.getAllFlags();

            // assert
            expect(result).toEqual([]);
        });
    });

    // #endregion
});
