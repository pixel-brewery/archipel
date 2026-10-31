/**
 * Opaque provider-tool configuration accepted only by provider-specific subpaths.
 *
 * Applications keep the options object inside Archipel while the provider
 * adapter validates its exact shape at runtime.
 *
 * @public
 */
export type IntelligenceProviderToolOptions = Readonly<Record<string, unknown>>;
