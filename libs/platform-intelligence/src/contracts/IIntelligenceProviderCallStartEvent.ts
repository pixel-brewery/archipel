/**
 * Exact standardized input facts observed immediately before a provider call.
 *
 * Unlike telemetry callbacks, the owning hook is awaited on the provider call
 * path and a thrown error prevents the provider from being contacted.
 *
 * @public
 */
export interface IIntelligenceProviderCallStartEvent {
    /** Native provider identifier reported by the standardized model. */
    readonly provider: string;
    /** Native model identifier reported by the standardized model. */
    readonly modelId: string;
    /** One-based attempt number within this language operation. */
    readonly providerCallNumber: number;
    /** UTF-8 byte size of the standardized provider context for this attempt. */
    readonly inputUtf8Bytes: number;
    /** Configured output-token limit, or `null` when the call has no explicit limit. */
    readonly maxOutputTokens: number | null;
    /** Whether the standardized context is text/JSON only and contains no provider-owned tool. */
    readonly textOnly: boolean;
    /** Number of opaque provider-owned tools in the standardized request. */
    readonly providerToolCount: number;
}
