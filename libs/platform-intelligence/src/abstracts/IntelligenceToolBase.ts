import type { IIntelligenceToolDefinition } from '../contracts/IIntelligenceToolDefinition.js';

/**
 * Base class for class-based intelligence tools.
 *
 * Archipel keeps tool registration object-oriented while leaving the actual tool
 * definition provider-neutral. Concrete tools expose a stable registry name
 * and an Archipel-owned definition.
 *
 * @typeParam _TInput - The input type accepted by the tool.
 * @typeParam _TOutput - The output type produced by the tool.
 *
 * @example
 * ```typescript
 * export class CustomerSearchTool extends IntelligenceToolBase<ICustomerSearchInput, ICustomerSearchResult> {
 *     public override get name(): string {
 *         return 'searchCustomers';
 *     }
 *
 *     public override get tool(): IIntelligenceToolDefinition<ICustomerSearchInput, ICustomerSearchResult> {
 *         return defineIntelligenceTool({
 *             description: 'Searches customers by name, email, or company.',
 *             inputSchema: z.object({
 *                 query: z.string().describe('Customer search query'),
 *             }),
 *             execute: async (input) => this._customerService.search(input.query),
 *         });
 *     }
 * }
 * ```
 *
 * @public
 */
export abstract class IntelligenceToolBase<_TInput = unknown, _TOutput = unknown> {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties

    /**
     * Gets the unique registry name for the tool.
     *
     * The name becomes the key in the tool set passed to language generation.
     *
     * @public
     * @readonly
     */
    public abstract get name(): string;

    /**
     * Gets the provider-neutral tool definition.
     *
     * @public
     * @readonly
     */
    public abstract get tool(): IIntelligenceToolDefinition<_TInput, _TOutput>;

    // #endregion

    // #region Methods
    // #endregion
}
