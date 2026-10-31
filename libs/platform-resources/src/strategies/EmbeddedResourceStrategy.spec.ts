// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { EmbeddedResourceStrategy } from './EmbeddedResourceStrategy.js';

// #endregion

// #region Tests

describe('EmbeddedResourceStrategy', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should have name "embedded"', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy();

        // act / assert
        expect(strategy.name).toBe('embedded');
    });

    it('should load a registered resource', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy({ 'hello.txt': 'Hello World' });

        // act
        const result = strategy.load('hello.txt');

        // assert
        expect(result).toBeDefined();
        expect(result!.content.toString()).toBe('Hello World');
        expect(result!.metadata.key).toBe('hello.txt');
        expect(result!.metadata.source).toBe('embedded');
    });

    it('should return undefined for missing resource', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy();

        // act
        const result = strategy.load('missing.txt');

        // assert
        expect(result).toBeUndefined();
    });

    it('should check existence correctly', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy({ 'a.txt': 'content' });

        // act / assert
        expect(strategy.exists('a.txt')).toBe(true);
        expect(strategy.exists('b.txt')).toBe(false);
    });

    it('should register new resources dynamically', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy();

        // act
        strategy.register('new.txt', 'new content');

        // assert
        expect(strategy.exists('new.txt')).toBe(true);
        expect(strategy.load('new.txt')!.content.toString()).toBe('new content');
    });

    it('should delegate loadAsync to load', async () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy({ 'async.txt': 'async content' });

        // act
        const result = await strategy.loadAsync('async.txt');

        // assert
        expect(result).toBeDefined();
        expect(result!.content.toString()).toBe('async content');
    });

    it('should delegate existsAsync to exists', async () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy({ 'check.txt': 'content' });

        // act
        const result = await strategy.existsAsync('check.txt');

        // assert
        expect(result).toBe(true);
    });

    it('should not throw on whatDoIHave', () => {
        // arrange
        const strategy = new EmbeddedResourceStrategy({ 'a.txt': 'a', 'b.txt': 'b' });

        // act / assert
        expect(() => strategy.whatDoIHave()).not.toThrow();
    });
});

// #endregion
