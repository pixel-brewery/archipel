/**
 * Stable identity visible within one explicitly owned runtime.
 *
 * @public
 */
export interface IParticipantManifest {
    /**
     * Stable participant identity within the owning runtime.
     */
    readonly id: string;
    /**
     * Display name visible to other runtime participants.
     */
    readonly name: string;
    /**
     * Participant category; descriptive metadata does not grant permissions.
     */
    readonly role: 'agent' | 'human';
    /**
     * Descriptive capabilities advertised to other participants.
     */
    readonly capabilities?: ReadonlyArray<string>;
}
