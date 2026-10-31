/**
 * Sets the specified keys of T as optional.
 *
 * @template T Original type
 * @template K Keys to set as optional
 */
export type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
