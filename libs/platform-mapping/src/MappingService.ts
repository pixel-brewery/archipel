// #region Imports

import { Injectable, Logger } from '@nestjs/common';
import { MappingBuilder } from './builder/MappingBuilder.js';
import { Constructor } from './types/Constructor.js';
import { IMappingKey } from './types/MappingKey.js';
import { IMappingProfile } from './profile/interfaces/IMappingProfile.js';
import { TypeMappingNotRegisteredError } from './errors/TypeMappingNotRegisteredError.js';
import { MappingNotRegisteredError } from './errors/MappingNotRegisteredError.js';

// #endregion

/**
 * Central mapping registry supporting keyed & type-based mappings.
 *
 * @public
 */
@Injectable()
export class MappingService {
    // #region Fields

    private readonly _keyRegistry: Map<string, (source: unknown) => unknown>;
    private readonly _typeRegistry: Map<string, (source: unknown) => unknown>;
    private readonly _registeredProfiles: Set<string>;
    private readonly _logger: Logger = new Logger(MappingService.name);

    // #endregion

    // #region Ctor

    /**
     * Constructs a new instance of the `{@link MappingService}` class.
     *
     * @public
     */
    public constructor() {
        this._keyRegistry = new Map<string, (source: unknown) => unknown>();
        this._typeRegistry = new Map<string, (source: unknown) => unknown>();
        this._registeredProfiles = new Set<string>();
    }

    // #endregion

    // #region Methods

    /**
     * Registers a mapping function for a specific key.
     *
     * @public
     * @param key - The unique key for the mapping.
     * @param fn - The mapping function.
     * @returns void
     */
    public register<TSource, TDestination>(key: string, fn: (source: TSource) => TDestination): void {
        if (this._keyRegistry.has(key)) {
            this._logger.warn(`duplicate mapping key ignored key=${key}`);
            return;
        }
        this._keyRegistry.set(key, fn as unknown as (source: unknown) => unknown);
    }

    /**
     * Registers a mapping function for a specific source and destination type.
     *
     * @public
     * @param source - The constructor of the source type.
     * @param destination - The constructor of the destination type.
     * @param fn - The mapping function.
     * @returns void
     */
    public registerMap<TSource, TDestination>(
        source: Constructor<TSource>,
        destination: Constructor<TDestination>,
        fn: (source: TSource) => TDestination,
    ): void {
        const key = this.typeKey(source, destination);
        if (this._typeRegistry.has(key)) {
            this._logger.warn(`duplicate type mapping ignored key=${key}`);
            return;
        }
        this._typeRegistry.set(key, fn as unknown as (source: unknown) => unknown);
    }

    /**
     * Maps a source object to a destination type using a type-safe mapping key.
     * The key encodes both input and output types, ensuring compile-time type safety.
     *
     * @public
     * @param key - The type-safe mapping key.
     * @param source - The source object to map.
     * @returns The mapped destination object.
     *
     * @example
     * ```typescript
     * const response = this._mappingService.map(PRODUCT_MAPPING_KEY, productInput);
     * // response is automatically typed as ProductResponse
     * ```
     */
    public map<TInput, TOutput>(key: IMappingKey<TInput, TOutput>, source: TInput): TOutput {
        const fn = this._keyRegistry.get(key.key);
        if (!fn) {
            throw new MappingNotRegisteredError(key.key);
        }
        return fn(source) as TOutput;
    }

    /**
     * Attempts to map returning undefined instead of throwing when mapping is absent.
     *
     * @public
     * @param key - The type-safe mapping key.
     * @param source - The source object to map.
     * @returns The mapped destination object or undefined if no mapping exists.
     */
    public tryMap<TInput, TOutput>(key: IMappingKey<TInput, TOutput>, source: TInput): TOutput | undefined {
        const fn = this._keyRegistry.get(key.key);
        if (!fn) return undefined;
        return fn(source) as TOutput;
    }

    /**
     * Maps a source object to a destination type using a registered mapping function.
     *
     * @public
     * @param source - The source object to map.
     * @param destination - The constructor of the destination type.
     * @returns The mapped destination object.
     */
    public mapTypes<TSource, TDestination>(source: TSource, destination: Constructor<TDestination>): TDestination {
        const sourceCtor = (source as unknown as object).constructor as Constructor<TSource>;
        const key = this.typeKey(sourceCtor, destination);
        const fn = this._typeRegistry.get(key);
        if (!fn) {
            throw new TypeMappingNotRegisteredError(sourceCtor.name, destination.name);
        }
        return fn(source) as TDestination;
    }

    /**
     * Safe variant of {@link mapTypes} that returns undefined if not registered.
     */
    public tryMapTypes<TSource, TDestination>(source: TSource, destination: Constructor<TDestination>): TDestination | undefined {
        const sourceCtor = (source as unknown as object).constructor as Constructor<TSource>;
        const key = this.typeKey(sourceCtor, destination);
        const fn = this._typeRegistry.get(key);
        if (!fn) return undefined;
        return fn(source) as TDestination;
    }

    /**
     * Maps an array of source objects to an array of destination types using a registered mapping function.
     *
     * @public
     * @param sources - The array of source objects to map.
     * @param destination - The constructor of the destination type.
     * @returns The array of mapped destination objects.
     */
    public mapTypesArray<TSource, TDestination>(sources: TSource[], destination: Constructor<TDestination>): TDestination[] {
        return sources.map((s) => this.mapTypes<TSource, TDestination>(s, destination));
    }

    /**
     * Registers a mapping profile containing multiple mappings.
     *
     * @public
     * @param profile - The mapping profile to register.
     * @returns void
     */
    public registerProfile(profile: IMappingProfile): void {
        const profileId = profile.constructor.name;
        if (this._registeredProfiles.has(profileId)) {
            this._logger.warn(`duplicate profile registration ignored profile=${profileId}`);
            return;
        }
        this._registeredProfiles.add(profileId);
        const builder = new MappingBuilder(this);
        profile.configure(builder);
    }

    /**
     * Generates a unique key for a mapping between two types.
     *
     * @private
     * @param a - The constructor of the source type.
     * @param b - The constructor of the destination type.
     * @returns A unique key representing the mapping.
     */
    private typeKey(a: Constructor<unknown>, b: Constructor<unknown>): string {
        return `${a.name}->${b.name}`;
    }

    // #endregion
}
