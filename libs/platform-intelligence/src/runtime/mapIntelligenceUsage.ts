// #region Imports

import type { IIntelligenceUsage } from '../contracts/IIntelligenceUsage.js';

// #endregion

/**
 * Maps SDK-specific token counters to the Archipel usage contract.
 *
 * @internal
 */
export function mapIntelligenceUsage(usage: unknown): IIntelligenceUsage | null {
    if (!usage || typeof usage !== 'object') {
        return null;
    }

    const record = usage as Readonly<Record<string, unknown>>;
    const inputDetails = asRecord(record['inputTokenDetails']) ?? asRecord(record['input_tokens_details']);
    const outputDetails = asRecord(record['outputTokenDetails']) ?? asRecord(record['output_tokens_details']);
    const inputTokens = readTokenCount(record, ['inputTokens', 'promptTokens', 'tokens']);
    const outputTokens = readTokenCount(record, ['outputTokens', 'completionTokens']);
    const totalTokens = readTokenCount(record, ['totalTokens']) ?? sumTokenCounts(inputTokens, outputTokens);

    if (inputTokens === null && outputTokens === null && totalTokens === null) {
        return null;
    }

    return {
        inputTokens,
        outputTokens,
        totalTokens,
        cachedInputTokens: readTokenCount(inputDetails, ['cacheReadTokens', 'cachedTokens', 'cached_tokens']),
        cacheWriteInputTokens: readTokenCount(inputDetails, ['cacheWriteTokens', 'cache_write_tokens']),
        cachedInputTextTokens: null,
        cachedInputImageTokens: null,
        cachedInputAudioTokens: null,
        inputTextTokens: readTokenCount(inputDetails, ['textTokens', 'text_tokens']),
        inputImageTokens: readTokenCount(inputDetails, ['imageTokens', 'image_tokens']),
        inputAudioTokens: readTokenCount(inputDetails, ['audioTokens', 'audio_tokens']),
        outputTextTokens: readTokenCount(outputDetails, ['textTokens', 'text_tokens']),
        outputImageTokens: readTokenCount(outputDetails, ['imageTokens', 'image_tokens']),
        outputAudioTokens: readTokenCount(outputDetails, ['audioTokens', 'audio_tokens']),
        reasoningTokens: readTokenCount(outputDetails, ['reasoningTokens', 'reasoning_tokens']),
    };
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Readonly<Record<string, unknown>>) : null;
}

function readTokenCount(record: Readonly<Record<string, unknown>> | null, keys: ReadonlyArray<string>): number | null {
    if (!record) {
        return null;
    }

    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
            return value;
        }
    }

    return null;
}

function sumTokenCounts(inputTokens: number | null, outputTokens: number | null): number | null {
    if (inputTokens === null && outputTokens === null) {
        return null;
    }

    return (inputTokens ?? 0) + (outputTokens ?? 0);
}
