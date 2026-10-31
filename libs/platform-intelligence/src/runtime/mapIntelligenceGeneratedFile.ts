// #region Imports

import type { GeneratedFile } from 'ai';
import type { IIntelligenceGeneratedFile } from '../contracts/IIntelligenceGeneratedFile.js';

// #endregion

/**
 * Maps an AI SDK generated file to the provider-neutral file contract.
 *
 * @internal
 */
export function mapIntelligenceGeneratedFile(file: GeneratedFile): IIntelligenceGeneratedFile {
    const record = file as unknown as Readonly<Record<string, unknown>>;

    return {
        data: file.uint8Array,
        mediaType: file.mediaType,
        ...(typeof record['filename'] === 'string' ? { filename: record['filename'] } : {}),
    };
}
