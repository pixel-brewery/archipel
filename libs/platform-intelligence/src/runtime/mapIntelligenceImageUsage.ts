// #region Imports

import type { IIntelligenceUsage } from '../contracts/IIntelligenceUsage.js';
import { mapIntelligenceUsage } from './mapIntelligenceUsage.js';

// #endregion

// #region Types

interface IImageInputTokenDetails {
    readonly textTokens: number | null;
    readonly imageTokens: number | null;
}

// #endregion

/**
 * Maps image-model usage and provider metadata to provider-neutral modality counters.
 *
 * @internal
 */
export function mapIntelligenceImageUsage(usage: unknown, providerMetadata: unknown, hasImageInput: boolean): IIntelligenceUsage | null {
    const mappedUsage = mapIntelligenceUsage(usage);
    if (!mappedUsage) {
        return null;
    }

    const details = readImageInputTokenDetails(providerMetadata);
    const inputTextTokens = details.textTokens ?? mappedUsage.inputTextTokens ?? (!hasImageInput ? mappedUsage.inputTokens : null);
    const inputImageTokens = details.imageTokens ?? mappedUsage.inputImageTokens ?? (!hasImageInput && mappedUsage.inputTokens !== null ? 0 : null);

    return {
        ...mappedUsage,
        inputTextTokens,
        inputImageTokens,
        outputImageTokens: mappedUsage.outputImageTokens ?? mappedUsage.outputTokens,
    };
}

function readImageInputTokenDetails(providerMetadata: unknown): IImageInputTokenDetails {
    const root = asRecord(providerMetadata);
    let textTokens: number | null = null;
    let imageTokens: number | null = null;

    for (const providerValue of Object.values(root ?? {})) {
        const images = asRecord(providerValue)?.['images'];
        if (!Array.isArray(images)) {
            continue;
        }

        for (const image of images) {
            const record = asRecord(image);
            textTokens = addTokenCount(textTokens, readTokenCount(record?.['textTokens']));
            imageTokens = addTokenCount(imageTokens, readTokenCount(record?.['imageTokens']));
        }
    }

    return { textTokens, imageTokens };
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | null {
    return value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as Readonly<Record<string, unknown>>) : null;
}

function readTokenCount(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

function addTokenCount(current: number | null, next: number | null): number | null {
    return current === null && next === null ? null : (current ?? 0) + (next ?? 0);
}
