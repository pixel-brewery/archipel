import type { IIntelligenceToolCall } from '@pixel-brewery/archipel-platform-intelligence';
import type { IAgentInferenceRequest } from '../interfaces/IAgentInferenceRequest.js';
import type { IAgentInferenceResult } from '../interfaces/IAgentInferenceResult.js';

/**
 * Interceptable next step. Discriminated inputs prevent a state receiving another state's payload.
 *
 * @public
 */
export type AgentTransition =
    | {
          /**
           * Loop phase selected for the next state execution.
           */
          readonly nextStateId: 'message_received';
          /**
           * Input belonging to the selected state or tool contract.
           */
          readonly input: {
              /**
               * User message to append before the first inference step.
               */
              readonly content: string;
          };
      }
    | {
          /**
           * Loop phase selected for the next state execution.
           */
          readonly nextStateId: 'inference' | 'inference_streaming';
          /**
           * Input belonging to the selected state or tool contract.
           */
          readonly input: IAgentInferenceRequest;
      }
    | {
          /**
           * Loop phase selected for the next state execution.
           */
          readonly nextStateId: 'function_call';
          /**
           * Input belonging to the selected state or tool contract.
           */
          readonly input: {
              /**
               * Ordered tool calls selected by the current provider response.
               */
              readonly calls: ReadonlyArray<IIntelligenceToolCall>;
              /**
               * Zero-based position of the next tool call in its response batch.
               */
              readonly index: number;
              /**
               * Provider response that selected this batch of tool calls.
               */
              readonly result: IAgentInferenceResult;
          };
      }
    | {
          /**
           * Loop phase selected for the next state execution.
           */
          readonly nextStateId: 'model_message';
          /**
           * Input belonging to the selected state or tool contract.
           */
          readonly input: IAgentInferenceResult;
      }
    | {
          /**
           * Loop phase selected for the next state execution.
           */
          readonly nextStateId: 'idle';
          /**
           * Input belonging to the selected state or tool contract.
           */
          readonly input: undefined;
      };
