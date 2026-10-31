import type { IntelligenceLanguageStreamPart } from '@pixel-brewery/archipel-platform-intelligence';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';

/**
 * Stream events end in exactly one normalized output.
 *
 * @public
 */
export type AgentInferenceEvent =
    | IntelligenceLanguageStreamPart
    | {
          /**
           * Discriminator that identifies the event or stream item contract.
           */
          readonly type: 'partial-output';
          /**
           * Partial structured value that may still change before the final output event.
           */
          readonly output: unknown;
      }
    | {
          /**
           * Discriminator that identifies the event or stream item contract.
           */
          readonly type: 'output';
          /**
           * Complete provider response emitted once after incremental events.
           */
          readonly result: IAgentInferenceResult;
      };
