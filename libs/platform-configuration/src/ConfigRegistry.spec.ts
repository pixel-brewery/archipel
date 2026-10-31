import { beforeEach, describe, expect, it } from 'vitest';
import { createConfigKey } from './ConfigKey.js';
import { ConfigRegistry, IConfigRegistryEntry } from './ConfigRegistry.js';

describe('ConfigRegistry', () => {
    beforeEach(() => {
        ConfigRegistry.clear();
    });

    it('should register entries and return them via getAll', () => {
        // arrange
        const key = createConfigKey<string>('TEST_KEY');
        const entries: ReadonlyArray<Omit<IConfigRegistryEntry, 'module'>> = [{ key, required: true, description: 'A test key' }];

        // act
        ConfigRegistry.register('test-module', entries);

        // assert
        const all = ConfigRegistry.getAll();
        expect(all).toHaveLength(1);
        expect(all[0].key.key).toBe('TEST_KEY');
        expect(all[0].module).toBe('test-module');
        expect(all[0].required).toBe(true);
    });

    it('should group entries by module', () => {
        // arrange
        const keyA = createConfigKey<string>('KEY_A');
        const keyB = createConfigKey<number>('KEY_B');
        const keyC = createConfigKey<boolean>('KEY_C');

        ConfigRegistry.register('module-a', [{ key: keyA, required: true }]);
        ConfigRegistry.register('module-b', [
            { key: keyB, required: false, defaultValue: 42 },
            { key: keyC, required: false, defaultValue: true },
        ]);

        // act
        const grouped = ConfigRegistry.getByModule();

        // assert
        expect(grouped.get('module-a')).toHaveLength(1);
        expect(grouped.get('module-b')).toHaveLength(2);
    });

    it('should return only required entries', () => {
        // arrange
        const required = createConfigKey<string>('REQUIRED');
        const optional = createConfigKey<string>('OPTIONAL');

        ConfigRegistry.register('mod', [
            { key: required, required: true },
            { key: optional, required: false, defaultValue: 'fallback' },
        ]);

        // act
        const result = ConfigRegistry.getRequired();

        // assert
        expect(result).toHaveLength(1);
        expect(result[0].key.key).toBe('REQUIRED');
    });

    it('should return all registered module names', () => {
        // arrange
        const key = createConfigKey<string>('ANY');
        ConfigRegistry.register('alpha', [{ key, required: true }]);
        ConfigRegistry.register('beta', [{ key, required: true }]);

        // act
        const modules = ConfigRegistry.getModules();

        // assert
        expect(modules).toContain('alpha');
        expect(modules).toContain('beta');
        expect(modules).toHaveLength(2);
    });

    it('should overwrite duplicate keys within the same module', () => {
        // arrange
        const key = createConfigKey<string>('DUP');

        ConfigRegistry.register('mod', [{ key, required: true, description: 'first' }]);
        ConfigRegistry.register('mod', [{ key, required: false, description: 'second' }]);

        // act
        const all = ConfigRegistry.getAll();

        // assert
        expect(all).toHaveLength(1);
        expect(all[0].required).toBe(false);
        expect(all[0].description).toBe('second');
    });

    it('should clear all entries', () => {
        // arrange
        const key = createConfigKey<string>('CLEAR_ME');
        ConfigRegistry.register('mod', [{ key, required: true }]);

        // act
        ConfigRegistry.clear();

        // assert
        expect(ConfigRegistry.getAll()).toHaveLength(0);
        expect(ConfigRegistry.getModules()).toHaveLength(0);
    });

    it('should preserve defaultValue for optional entries', () => {
        // arrange
        const key = createConfigKey<number>('WITH_DEFAULT');
        ConfigRegistry.register('mod', [{ key, required: false, defaultValue: 3000 }]);

        // act
        const entry = ConfigRegistry.getAll()[0];

        // assert
        expect(entry.defaultValue).toBe(3000);
    });

    it('should allow the same key in different modules', () => {
        // arrange
        const key = createConfigKey<string>('SHARED_KEY');
        ConfigRegistry.register('module-1', [{ key, required: true }]);
        ConfigRegistry.register('module-2', [{ key, required: false, defaultValue: 'x' }]);

        // act
        const all = ConfigRegistry.getAll();

        // assert
        expect(all).toHaveLength(2);
        expect(all.map((e) => e.module)).toContain('module-1');
        expect(all.map((e) => e.module)).toContain('module-2');
    });
});
