import type { AgentTransition } from './AgentTransition.js';

/**
 * Continue with an optionally rewritten transition, pause before execution, or stop.
 *
 * @public
 */
export type AgentInterceptionResult =
    | {
          /**
           * Policy decision to continue, pause or stop the selected transition.
           */
          readonly action: 'continue';
          /**
           * Typed next step approved or rewritten by the interception policy.
           */
          readonly transition: AgentTransition;
      }
    | {
          /**
           * Policy decision to continue, pause or stop the selected transition.
           */
          readonly action: 'pause';
      }
    | {
          /**
           * Policy decision to continue, pause or stop the selected transition.
           */
          readonly action: 'stop';
          /**
           * Optional application explanation for a stopped or waiting operation.
           */
          readonly reason?: string;
      };
