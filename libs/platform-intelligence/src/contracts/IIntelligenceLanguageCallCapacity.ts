/**
 * Immutable standardized input facts for one prepared language call.
 *
 * The serialized byte count covers the exact initial prompt, tool contracts,
 * tool choice, response format, and provider options observed at the AI SDK's
 * final provider boundary. Preparation captures it with a local synthetic
 * response and never contacts the provider. Consumers can combine it with
 * their bounded multi-step policy before executing the prepared call.
 *
 * @public
 */
export interface IIntelligenceLanguageCallCapacity {
    /** UTF-8 bytes in the captured standardized initial provider input. */
    readonly serializedInputUtf8Bytes: number;
    /** Number of standardized messages represented by the captured prompt. */
    readonly messageCount: number;
    /** Number of standardized tool contracts. */
    readonly toolCount: number;
    /** Largest selected tool name measured as UTF-8 bytes. */
    readonly maximumToolNameUtf8Bytes: number;
    /** Whether the standardized input contains only measurable text/JSON content. */
    readonly textOnly: boolean;
    /** Number of selected tools whose complete contract is opaque to Archipel. */
    readonly opaqueToolCount: number;
}
