import type { IIntelligenceToolDefinition } from '@pixel-brewery/archipel-platform-intelligence';
import type { ModelContext } from '../memory/ModelContext.js';
import type { ISituationHandler } from './ISituationHandler.js';

/**
 * Provider-neutral virtual participant definition; product identity remains application-owned.
 *
 * @public
 */
export interface IAgentConfiguration {
    /**
     * Participant identity; a UUID is generated when omitted.
     */
    readonly id?: string;
    /**
     * Nonblank display name published in the participant manifest.
     */
    readonly name: string;
    /**
     * Instructions applied to every provider request made for this agent.
     */
    readonly instruction: string;
    /**
     * Descriptive capabilities advertised to other participants.
     */
    readonly capabilities?: ReadonlyArray<string>;
    /**
     * Situation handlers registered for the participant.
     */
    readonly handlers?: ReadonlyArray<ISituationHandler>;
    /**
     * Application tool declarations and executors copied into the agent's immutable catalog.
     */
    readonly tools?: Readonly<Record<string, IIntelligenceToolDefinition>>;
    /**
     * Explicit catalog capacity; defaults to 128 and can be raised by the owning application.
     */
    readonly maxTools?: number;
    /**
     * Conversation retained between completed runs; a new ModelContext is created when omitted.
     */
    readonly memory?: ModelContext;
}
