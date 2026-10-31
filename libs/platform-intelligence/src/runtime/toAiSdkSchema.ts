// #region Imports

import type { FlexibleSchema } from 'ai';
import type { IIntelligenceSchema } from '../contracts/IIntelligenceSchema.js';

// #endregion

/**
 * Converts a provider-neutral schema into the AI SDK representation.
 *
 * @internal
 */
export async function toAiSdkSchema<T>(schema: IIntelligenceSchema<T>): Promise<FlexibleSchema<T>> {
    if ('kind' in schema) {
        const { jsonSchema } = await import('ai');

        return jsonSchema<T>(schema.jsonSchema, schema.validate ? { validate: schema.validate } : undefined);
    }

    return schema as FlexibleSchema<T>;
}
