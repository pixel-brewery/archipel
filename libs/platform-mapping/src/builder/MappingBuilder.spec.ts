// #region Imports

import { afterEach, describe, expect, it, vi } from 'vitest';
import { MappingService } from '../MappingService.js';
import { MappingBuilder } from './MappingBuilder.js';

// #endregion

// #region Tests

describe('MappingBuilder', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should call registerMap on the service for createMap', () => {
        // arrange
        const service = new MappingService();
        const registerMapSpy = vi.spyOn(service, 'registerMap');
        const builder = new MappingBuilder(service);
        class Source {
            public x = 1;
        }
        class Dest {
            public y = 2;
        }
        const fn = (src: Source) => {
            const d = new Dest();
            d.y = src.x;
            return d;
        };

        // act
        const result = builder.createMap(Source, Dest, fn as never);

        // assert
        expect(registerMapSpy).toHaveBeenCalledWith(Source, Dest, fn);
        expect(result).toBe(builder);
    });

    it('should call register on the service for createKeyedMap', () => {
        // arrange
        const service = new MappingService();
        const registerSpy = vi.spyOn(service, 'register');
        const builder = new MappingBuilder(service);
        const key = {
            _brand: 'MappingKey' as const,
            key: 'test.key',
            _input: undefined as unknown as number,
            _output: undefined as unknown as string,
        };
        const fn = (n: number) => String(n);

        // act
        const result = builder.createKeyedMap(key, fn as never);

        // assert
        expect(registerSpy).toHaveBeenCalledWith('test.key', fn);
        expect(result).toBe(builder);
    });

    it('should support chaining', () => {
        // arrange
        const service = new MappingService();
        const builder = new MappingBuilder(service);
        class A {
            public a = 1;
        }
        class B {
            public b = 2;
        }

        // act
        const result = builder
            .createMap(A, B, () => new B() as never)
            .createKeyedMap(
                {
                    _brand: 'MappingKey' as const,
                    key: 'chain',
                    _input: undefined as unknown as number,
                    _output: undefined as unknown as number,
                },
                ((n: number) => n) as never,
            );

        // assert
        expect(result).toBe(builder);
    });
});

// #endregion
