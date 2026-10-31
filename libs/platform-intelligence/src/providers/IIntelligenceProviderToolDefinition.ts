/**
 * Opaque provider-native tool retained inside a provider adapter subpath.
 *
 * @internal
 */
export interface IIntelligenceProviderToolDefinition {
    readonly kind: 'provider-tool';
    readonly nativeDefinition: unknown;
}
