/** One completed Prisma driver operation, with no SQL text, arguments, result data or error messages. */
export interface ISqlObservation {
    readonly durationMs: number;
    readonly operation: string;
    readonly outcome: 'success' | 'failure';
    readonly kind: 'query' | 'transaction' | 'script';
    readonly transaction: boolean;
}
