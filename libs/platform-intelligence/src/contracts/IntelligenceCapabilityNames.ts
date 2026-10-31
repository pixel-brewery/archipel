/**
 * Capability identifiers understood by the intelligence provider registry.
 *
 * @public
 */
export const IntelligenceCapabilityNames = {
    Language: 'language',
    Embedding: 'embedding',
    Image: 'image',
    Speech: 'speech',
    Transcription: 'transcription',
    Video: 'video',
    Reranking: 'reranking',
    Realtime: 'realtime',
    Files: 'files',
    Skills: 'skills',
} as const;
