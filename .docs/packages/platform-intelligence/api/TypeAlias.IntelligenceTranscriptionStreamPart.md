---
title: 'Type Alias: IntelligenceTranscriptionStreamPart'
generated: true
editUrl: false
---

# Type Alias: IntelligenceTranscriptionStreamPart

```ts
type IntelligenceTranscriptionStreamPart =
    | {
          delta: string;
          id?: string;
          providerMetadata?: IntelligenceProviderOptions;
          type: 'transcript-delta';
      }
    | {
          channelIndex?: number;
          durationInSeconds?: number;
          id?: string;
          providerMetadata?: IntelligenceProviderOptions;
          startSecond?: number;
          text: string;
          type: 'transcript-partial';
      }
    | {
          channelIndex?: number;
          endSecond?: number;
          id?: string;
          providerMetadata?: IntelligenceProviderOptions;
          startSecond?: number;
          text: string;
          type: 'transcript-final';
      }
    | {
          rawValue: unknown;
          type: 'raw';
      }
    | {
          error: unknown;
          type: 'error';
      };
```

Defined in: [libs/platform-intelligence/src/contracts/IntelligenceTranscriptionStreamPart.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-intelligence/src/contracts/IntelligenceTranscriptionStreamPart.ts#L12)

Provider-neutral live transcription event.
