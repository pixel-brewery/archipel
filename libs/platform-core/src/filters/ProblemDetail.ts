/**
 * A Problem Detail object as per RFC 7807.
 *
 * @public
 */
export type ProblemDetail = {
    type?: string;
    title: string;
    detail: string;
    instance?: string;
} & Record<string, string | number | string[] | number[]>;
