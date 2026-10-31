import { describe, expect, it } from 'vitest';
import { MappingService } from './MappingService.js';
import { MappingNotRegisteredError } from './errors/MappingNotRegisteredError.js';
import { TypeMappingNotRegisteredError } from './errors/TypeMappingNotRegisteredError.js';
import type { Constructor } from './types/Constructor.js';
import { createMappingKey } from './types/MappingKey.js';

class Source {
    public constructor(public value: number) {}
}

class Destination {
    public constructor(public value: number) {}
}

const SourceCtor = Source as Constructor<Source>;
const DestinationCtor = Destination as Constructor<Destination>;

const NUMBER_DOUBLE_KEY = createMappingKey<number, number>('NUMBER_DOUBLE');
const UNKNOWN_KEY = createMappingKey<number, number>('UNKNOWN');

describe('MappingService', () => {
    it('should map using keyed mapping', () => {
        // arrange
        const svc = new MappingService();
        svc.register('NUMBER_DOUBLE', (n: number) => n * 2);

        // act
        const result = svc.map(NUMBER_DOUBLE_KEY, 5);

        // assert
        expect(result).toBe(10);
    });

    it('should throw MappingNotRegisteredError for unknown key', () => {
        // arrange
        const svc = new MappingService();

        // act & assert
        expect(() => svc.map(UNKNOWN_KEY, 1)).toThrow(MappingNotRegisteredError);
    });

    it('should return undefined on tryMap for unknown key', () => {
        // arrange
        const svc = new MappingService();

        // act
        const result = svc.tryMap(UNKNOWN_KEY, 1);

        // assert
        expect(result).toBeUndefined();
    });

    it('should map using type mapping', () => {
        // arrange
        const svc = new MappingService();
        svc.registerMap(SourceCtor, DestinationCtor, (s) => new Destination(s.value + 1));

        // act
        const out = svc.mapTypes(new Source(4), DestinationCtor);

        // assert
        expect(out.value).toBe(5);
    });

    it('should throw TypeMappingNotRegisteredError for unknown type pair', () => {
        // arrange
        const svc = new MappingService();

        // act & assert
        expect(() => svc.mapTypes(new Source(1), DestinationCtor)).toThrow(TypeMappingNotRegisteredError);
    });

    it('should return undefined on tryMapTypes for unknown types', () => {
        // arrange
        const svc = new MappingService();

        // act
        const result = svc.tryMapTypes(new Source(2), DestinationCtor);

        // assert
        expect(result).toBeUndefined();
    });
});
