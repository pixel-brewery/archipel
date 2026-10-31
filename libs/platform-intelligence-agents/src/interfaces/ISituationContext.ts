import type { AgentEvent } from '../events/AgentEvent.js';
import type { ParticipantBase } from '../abstracts/ParticipantBase.js';

/**
 * One event and the participant receiving it.
 *
 * @public
 */
export interface ISituationContext {
    /**
     * Semantic event currently being evaluated or processed.
     */
    readonly event: AgentEvent;
    /**
     * Participant receiving the event.
     */
    readonly participant: ParticipantBase;
}
