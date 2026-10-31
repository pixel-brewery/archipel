// Helper type to convert a single string from snake_case to camelCase
type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}` ? `${T}${Capitalize<SnakeToCamel<U>>}` : S;

// Main CamelCase type for transforming object properties
export type CamelCase<T> = {
    [K in keyof T as SnakeToCamel<K & string>]: T[K] extends object ? CamelCase<T[K]> : T[K];
};
