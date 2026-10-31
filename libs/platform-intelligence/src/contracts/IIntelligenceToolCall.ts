/**
 * Tool call selected by a language model.
 *
 * @public
 */
export interface IIntelligenceToolCall {
    readonly toolCallId: string;
    readonly toolName: string;
    readonly input: unknown;
}
