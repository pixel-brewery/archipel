import { Constructor } from '../../types/Constructor.js';
import { IMappingKey } from '../../types/MappingKey.js';

/**
 * Type constraint to ensure mapping compatibility.
 * Checks that all required keys in TDestination exist in TSource.
 *
 * @internal
 */

type MappingCompatible<TSource, TDestination> = {
    [K in keyof TDestination]: K extends keyof TSource
        ? TSource[K] extends TDestination[K] | null | undefined
            ? TDestination[K]
            : TDestination[K]
        : TDestination[K];
};

/**
 * Defines the interface for a mapping builder.
 *
 * @public
 */
export interface IMappingBuilder {
    // #region Methods

    /**
     * Creates a mapping between two types.
     * Ensures compile-time type compatibility between source and destination.
     *
     * @public
     * @param source - The source type.
     * @param destination - The destination type.
     * @param fn - The mapping function that must return a valid destination.
     */
    createMap<TSource, TDestination>(
        source: Constructor<TSource>,
        destination: Constructor<TDestination>,
        fn: (source: TSource) => MappingCompatible<TSource, TDestination> & TDestination,
    ): this;

    /**
     * Creates a keyed mapping between two types with full type safety.
     * The mapping key encodes both input and output types at compile time.
     *
     * @public
     * @param key - The type-safe mapping key.
     * @param fn - The mapping function that must return a valid destination.
     */
    createKeyedMap<TInput, TOutput>(key: IMappingKey<TInput, TOutput>, fn: (source: TInput) => MappingCompatible<TInput, TOutput> & TOutput): this;

    // #endregion
}
