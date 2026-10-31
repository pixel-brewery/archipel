/**
 * Type-safe mapping key that encodes both input and output types.
 * This ensures compile-time type safety when using the mapping service.
 *
 * @public
 * @template TInput - The input type for the mapping.
 * @template TOutput - The output type for the mapping.
 */
export interface IMappingKey<TInput, TOutput> {
    readonly _brand: 'MappingKey';
    readonly _input: TInput;
    readonly _output: TOutput;
    readonly key: string;
}

/**
 * Creates a type-safe mapping key.
 *
 * @public
 * @param key - The unique string identifier for the mapping.
 * @returns A branded mapping key that encodes the input and output types.
 *
 * @example
 * ```typescript
 * export const PRODUCT_MAPPING_KEY = createMappingKey<IProductMappingInput, ProductResponse>('food.product');
 * ```
 */
export function createMappingKey<TInput, TOutput>(key: string): IMappingKey<TInput, TOutput> {
    return {
        _brand: 'MappingKey',
        _input: undefined as unknown as TInput,
        _output: undefined as unknown as TOutput,
        key: key,
    };
}
