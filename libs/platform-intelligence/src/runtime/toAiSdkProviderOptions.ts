// #region Imports

import type { JSONValue, SharedV4ProviderOptions } from '@ai-sdk/provider';
import type { IntelligenceJsonValue } from '../contracts/IntelligenceJsonValue.js';
import type { IntelligenceProviderOptions } from '../contracts/IntelligenceProviderOptions.js';

// #endregion

/**
 * Clones readonly provider options into the mutable JSON representation expected by provider SDKs.
 *
 * @internal
 */
export function toAiSdkProviderOptions(options: IntelligenceProviderOptions | undefined): SharedV4ProviderOptions | undefined {
    if (!options) {
        return undefined;
    }

    const result: SharedV4ProviderOptions = {};
    for (const [provider, providerOptions] of Object.entries(options)) {
        const mapped: Record<string, JSONValue> = {};
        for (const [key, value] of Object.entries(providerOptions)) {
            mapped[key] = toAiSdkJsonValue(value);
        }
        result[provider] = mapped;
    }

    return result;
}

/**
 * Converts one readonly Archipel JSON value to the mutable provider representation.
 *
 * @internal
 */
export function toAiSdkJsonValue(value: IntelligenceJsonValue): JSONValue {
    if (Array.isArray(value)) {
        return value.map(toAiSdkJsonValue);
    }
    if (typeof value === 'object' && value !== null) {
        const result: Record<string, unknown> = {};
        for (const [key, nested] of Object.entries(value)) {
            result[key] = toAiSdkJsonValue(nested);
        }

        return result as Record<string, JSONValue>;
    }

    return value;
}
