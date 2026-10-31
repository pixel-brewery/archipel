/**
 * Generic operator type. The operator returns the raw return type of the underlying
 * delegate method (which is usually a Promise). The consumer can await the result.
 *
 * @beta
 * @template D - Concrete delegate type (e.g. Prisma.UserDelegate)
 * @template R - Result type produced by the operator
 */
export type QueryOperator<D, R> = (delegate: D) => R;
