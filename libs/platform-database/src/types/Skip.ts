/**
 * Utility function that returns the provided value or `undefined` if the value is `undefined`.
 * In Prisma 6+, passing `undefined` for a field in a query signals Prisma to skip that field.
 *
 * @public
 * @param value The value to check.
 * @returns The original value (excluding undefined) or `undefined` to skip the field.
 */
export function skip<T>(value: T): Exclude<T, undefined> | undefined {
    return value === undefined ? undefined : (value as Exclude<T, undefined>);
}
