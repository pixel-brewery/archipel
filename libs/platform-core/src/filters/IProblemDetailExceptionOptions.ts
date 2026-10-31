/**
 * Optional settings of a {@link ProblemDetailException}.
 *
 * @public
 */
export interface IProblemDetailExceptionOptions {
    /**
     * Response headers that belong to the problem, such as `Retry-After` for a
     * `429`/`503` or `WWW-Authenticate` for a `401`.
     *
     * @remarks
     * `ProblemDetailExceptionFilter` sends them together with the problem.
     * `Content-Type`, `Content-Length` and `Transfer-Encoding` are owned by the
     * filter and ignored; a header with an invalid name or value is skipped.
     */
    readonly headers?: Readonly<Record<string, string>>;
}
