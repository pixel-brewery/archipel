/** Utility type to unwrap a Promise result. */
export type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;
