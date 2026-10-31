import type { ISituationHandler } from './ISituationHandler.js';

/**
 * Human participant definition.
 *
 * @public
 */
export interface IHumanConfiguration {
    /**
     * Participant identity; a UUID is generated when omitted.
     */
    readonly id?: string;
    /**
     * Nonblank display name published in the participant manifest.
     */
    readonly name: string;
    /**
     * Descriptive capabilities advertised to other participants.
     */
    readonly capabilities?: ReadonlyArray<string>;
    /**
     * Situation handlers registered for the participant.
     */
    readonly handlers?: ReadonlyArray<ISituationHandler>;
}
