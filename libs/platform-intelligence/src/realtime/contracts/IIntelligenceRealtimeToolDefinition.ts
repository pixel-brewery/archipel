/**
 * Provider-neutral function definition exposed to a realtime model.
 *
 * @public
 */
export interface IIntelligenceRealtimeToolDefinition {
    // #region Properties

    /** Tool kind. */
    readonly type: 'function';

    /** Unique tool name within the session. */
    readonly name: string;

    /** Optional model-facing description. */
    readonly description?: string;

    /** JSON Schema describing the function parameters. */
    readonly parameters: Record<string, unknown>;

    // #endregion
}
