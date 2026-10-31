// #region Imports

import { MappingService } from '../MappingService.js';
import { Constructor } from '../types/Constructor.js';
import { IMappingKey } from '../types/MappingKey.js';
import { IMappingBuilder } from './interfaces/IMappingBuilder.js';

// #endregion

/**
 * A mapping builder that uses the mapping service to register maps.
 *
 * @public
 */
export class MappingBuilder implements IMappingBuilder {
    // #region Fields

    private readonly _service: MappingService;

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `{@link MappingBuilder}` class.
     *
     * @public
     */
    public constructor(service: MappingService) {
        this._service = service;
    }

    // #endregion

    // #region Methods

    /**
     * Creates a mapping between two types.
     * Enforces compile-time type compatibility check.
     *
     * @public
     * @param source - The source type.
     * @param destination - The destination type.
     * @param fn - The mapping function.
     */
    public createMap<TSource, TDestination>(source: Constructor<TSource>, destination: Constructor<TDestination>, fn: (source: TSource) => TDestination): this {
        this._service.registerMap(source, destination, fn);

        return this;
    }

    /**
     * Creates a keyed mapping between two types with full type safety.
     * The mapping key encodes both input and output types at compile time.
     *
     * @public
     * @param key - The type-safe mapping key.
     * @param fn - The mapping function.
     */
    public createKeyedMap<TInput, TOutput>(key: IMappingKey<TInput, TOutput>, fn: (source: TInput) => TOutput): this {
        this._service.register(key.key, fn);

        return this;
    }

    // #endregion
}
