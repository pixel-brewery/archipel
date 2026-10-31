/**
 * Normalized price information.
 *
 * @public
 */
export interface INormalizedPrice {
    readonly id: string;
    readonly productId: string;
    readonly amount: number;
    readonly currency: string;
    readonly interval: 'week' | 'month' | 'quarter' | 'year' | null;
    readonly intervalCount: number;
    readonly active: boolean;
}
