import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IFeatureFlagDefinition } from '../models/IFeatureFlagDefinition.js';
import { FeatureFlagWriterBase } from './FeatureFlagWriterBase.js';

class TestFeatureFlagWriter extends FeatureFlagWriterBase {
    // #region Methods

    public async getFlag(_key: string): Promise<IFeatureFlagDefinition | undefined> {
        return undefined;
    }

    public async listFlags(): Promise<ReadonlyArray<IFeatureFlagDefinition>> {
        return [];
    }

    public async createFlag(_definition: IFeatureFlagDefinition): Promise<void> {
        // no-op
    }

    public async updateFlag(_key: string, _updates: Partial<Omit<IFeatureFlagDefinition, 'key'>>): Promise<void> {
        // no-op
    }

    public async deleteFlag(_key: string): Promise<void> {
        // no-op
    }

    // #endregion
}

describe('FeatureFlagWriterBase', () => {
    // #region Fields

    let writer: TestFeatureFlagWriter;

    // #endregion

    // #region Methods

    beforeEach(() => {
        vi.restoreAllMocks();
        writer = new TestFeatureFlagWriter();
    });

    it('should return true from default ping()', async () => {
        // act
        const result = await writer.ping();

        // assert
        expect(result).toBe(true);
    });

    it('should return undefined from getFlag()', async () => {
        // act
        const result = await writer.getFlag('any-key');

        // assert
        expect(result).toBeUndefined();
    });

    it('should return empty array from listFlags()', async () => {
        // act
        const result = await writer.listFlags();

        // assert
        expect(result).toEqual([]);
    });

    // #endregion
});
