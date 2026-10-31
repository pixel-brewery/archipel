// #region Imports

import { Injectable } from '@nestjs/common';
import { IWindowedCounter, IWindowedCounterResult } from '../interfaces/IWindowedCounter.js';

// #endregion

/**
 * Windowed counter held in the memory of one process.
 *
 * Correct while an application runs as a single instance, and the honest fallback when no shared
 * store is configured. With several instances each keeps its own count, so the effective limit is
 * multiplied by the number of instances — use {@link RedisWindowedCounter} there.
 *
 * @public
 */
@Injectable()
export class MemoryWindowedCounter implements IWindowedCounter {
    // #region Fields

    private readonly _windows: Map<string, { value: number; resetAt: number }> = new Map();

    // #endregion

    // #region Methods

    /** @inheritdoc */
    public async increment(key: string, windowMs: number, amount = 1): Promise<IWindowedCounterResult> {
        const window = this._resolveWindow(key, windowMs);
        window.value += amount;
        this._prune();

        return { value: window.value, resetAt: new Date(window.resetAt) };
    }

    /** @inheritdoc */
    public async peek(key: string, windowMs: number): Promise<IWindowedCounterResult> {
        const window = this._resolveWindow(key, windowMs);

        return { value: window.value, resetAt: new Date(window.resetAt) };
    }

    /** @inheritdoc */
    public async reset(key: string, windowMs: number): Promise<void> {
        this._windows.delete(this._formatKey(key, windowMs));
    }

    private _resolveWindow(key: string, windowMs: number): { value: number; resetAt: number } {
        const windowKey = this._formatKey(key, windowMs);
        const existing = this._windows.get(windowKey);

        if (existing) {
            return existing;
        }

        const created = { value: 0, resetAt: this._resolveResetAt(windowMs) };
        this._windows.set(windowKey, created);

        return created;
    }

    private _formatKey(key: string, windowMs: number): string {
        return `${key}:${Math.floor(Date.now() / windowMs)}:${windowMs}`;
    }

    private _resolveResetAt(windowMs: number): number {
        return (Math.floor(Date.now() / windowMs) + 1) * windowMs;
    }

    private _prune(): void {
        const now = Date.now();

        for (const [windowKey, window] of this._windows) {
            if (window.resetAt <= now) {
                this._windows.delete(windowKey);
            }
        }
    }

    // #endregion
}
