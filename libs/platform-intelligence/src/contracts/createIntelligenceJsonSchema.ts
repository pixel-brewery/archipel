// #region Imports

import type { IIntelligenceSchema } from './IIntelligenceSchema.js';

// #endregion

/**
 * Creates a provider-neutral JSON Schema wrapper.
 *
 * @public
 */
export function createIntelligenceJsonSchema<T>(
    jsonSchema: Readonly<Record<string, unknown>>,
    validate?: (
        value: unknown,
    ) =>
        | { readonly success: true; readonly value: T }
        | { readonly success: false; readonly error: Error }
        | Promise<{ readonly success: true; readonly value: T } | { readonly success: false; readonly error: Error }>,
): IIntelligenceSchema<T> {
    return Object.freeze({
        kind: 'json-schema',
        jsonSchema,
        ...(validate ? { validate } : {}),
    });
}
