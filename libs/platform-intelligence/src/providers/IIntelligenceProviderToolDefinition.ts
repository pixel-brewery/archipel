/**
 * Opaque provider-native tool created by a provider `/tools` subpath factory.
 *
 * Pass it unchanged through `providerTools`; its native definition is meaningful only to the owning provider.
 *
 * @public
 */
export interface IIntelligenceProviderToolDefinition {
    readonly kind: 'provider-tool';
    readonly nativeDefinition: unknown;
}
