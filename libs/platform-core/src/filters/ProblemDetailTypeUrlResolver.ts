/**
 * A function that resolves a type URL for a given HTTP status code and title.
 *
 * @public
 */
export type ProblemDetailTypeUrlResolver = (code: number, title: string) => string;
