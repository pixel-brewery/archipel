/**
 * A type that can be either a single instance of T or an array of T.
 *
 * @public
 * @template T The type of the item or items.
 */
export type MaybeArray<T> = T | T[];
