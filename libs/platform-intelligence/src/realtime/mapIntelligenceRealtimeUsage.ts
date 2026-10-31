// #region Imports

import type { IIntelligenceRealtimeUsage } from './contracts/IIntelligenceRealtimeUsage.js';

// #endregion

/**
 * Extracts normalized token dimensions from OpenAI, Google, or xAI raw events.
 *
 * @internal
 */
export function mapIntelligenceRealtimeUsage(raw: unknown): IIntelligenceRealtimeUsage | null {
    const root = asRecord(raw);
    const response = asRecord(root?.['response']);
    const usage = asRecord(response?.['usage']) ?? asRecord(root?.['usage']) ?? asRecord(root?.['usageMetadata']);

    if (!usage) {
        return null;
    }

    const inputDetails = asRecord(usage['input_token_details']) ?? asRecord(usage['input_tokens_details']) ?? asRecord(usage['prompt_tokens_details']);
    const outputDetails = asRecord(usage['output_token_details']) ?? asRecord(usage['output_tokens_details']) ?? asRecord(usage['completion_tokens_details']);
    const inputTokens = firstNumber(usage, ['input_tokens', 'prompt_tokens', 'promptTokenCount']);
    const outputTokens = firstNumber(usage, ['output_tokens', 'completion_tokens', 'candidatesTokenCount', 'responseTokenCount']);
    const reportedTotalTokens = firstNumber(usage, ['total_tokens', 'totalTokenCount']);
    const totalTokens = reportedTotalTokens ?? (inputTokens !== null && outputTokens !== null ? inputTokens + outputTokens : null);
    const cachedInputTokens = firstNumber(inputDetails, ['cached_tokens']) ?? firstNumber(usage, ['cachedContentTokenCount', 'cached_tokens']);
    const cacheWriteInputTokens = firstNumber(inputDetails, ['cache_write_tokens']) ?? firstNumber(usage, ['cacheWriteTokenCount']);
    const cachedDetails = asRecord(inputDetails?.['cached_tokens_details']);
    const cachedInputTextTokens = firstNumber(cachedDetails, ['text_tokens']);
    const cachedInputImageTokens = firstNumber(cachedDetails, ['image_tokens']);
    const cachedInputAudioTokens = firstNumber(cachedDetails, ['audio_tokens']);
    const inputTextTokens = firstNumber(inputDetails, ['text_tokens']) ?? readModalityTokens(usage['promptTokensDetails'], ['TEXT', 'text']);
    const inputImageTokens = firstNumber(inputDetails, ['image_tokens']) ?? readModalityTokens(usage['promptTokensDetails'], ['IMAGE', 'image']);
    const inputAudioTokens = firstNumber(inputDetails, ['audio_tokens']) ?? readModalityTokens(usage['promptTokensDetails'], ['AUDIO', 'audio']);
    const outputTextTokens = firstNumber(outputDetails, ['text_tokens']) ?? readModalityTokens(usage['candidatesTokensDetails'], ['TEXT', 'text']);
    const outputImageTokens = firstNumber(outputDetails, ['image_tokens']) ?? readModalityTokens(usage['candidatesTokensDetails'], ['IMAGE', 'image']);
    const outputAudioTokens = firstNumber(outputDetails, ['audio_tokens']) ?? readModalityTokens(usage['candidatesTokensDetails'], ['AUDIO', 'audio']);
    const reasoningTokens = firstNumber(outputDetails, ['reasoning_tokens']);

    const dimensions = [
        inputTokens,
        outputTokens,
        totalTokens,
        cachedInputTokens,
        cacheWriteInputTokens,
        cachedInputTextTokens,
        cachedInputImageTokens,
        cachedInputAudioTokens,
        inputTextTokens,
        inputImageTokens,
        inputAudioTokens,
        outputTextTokens,
        outputImageTokens,
        outputAudioTokens,
        reasoningTokens,
    ];
    if (dimensions.every((value) => value === null)) {
        return null;
    }

    return {
        inputTokens,
        outputTokens,
        totalTokens,
        cachedInputTokens,
        cacheWriteInputTokens,
        cachedInputTextTokens,
        cachedInputImageTokens,
        cachedInputAudioTokens,
        inputTextTokens,
        inputImageTokens,
        inputAudioTokens,
        outputTextTokens,
        outputImageTokens,
        outputAudioTokens,
        reasoningTokens,
        rawUsage: usage,
    } satisfies IIntelligenceRealtimeUsage;
}

function asRecord(value: unknown): Record<string, unknown> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function firstNumber(record: Record<string, unknown> | null, keys: ReadonlyArray<string>): number | null {
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

function readModalityTokens(value: unknown, modalities: ReadonlyArray<string>): number | null {
    if (!Array.isArray(value)) {
        return null;
    }

    for (const candidate of value) {
        const detail = asRecord(candidate);
        const modality = detail?.['modality'];
        const tokens = detail?.['tokenCount'] ?? detail?.['tokens'];
        if (typeof modality === 'string' && modalities.includes(modality) && typeof tokens === 'number' && Number.isFinite(tokens) && tokens >= 0) {
            return tokens;
        }
    }

    return null;
}
