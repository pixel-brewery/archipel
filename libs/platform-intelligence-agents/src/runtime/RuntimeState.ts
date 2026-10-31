import type { ParticipantBase } from '../abstracts/ParticipantBase.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';

/**
 * Maintains bounded participant membership for one explicitly owned runtime.
 *
 * @public
 */
export class RuntimeState {
    // #region Fields
    private _participants: ReadonlyMap<string, ParticipantBase> = new Map();
    private readonly _maxParticipants: number;
    // #endregion

    // #region Ctor
    /**
     * Creates an empty participant registry with a fixed capacity.
     *
     * @param maxParticipants - Maximum distinct participant identities; defaults to 256.
     * @throws {AgentRuntimeError} When capacity is not a positive safe integer.
     */
    public constructor(maxParticipants = 256) {
        if (!Number.isSafeInteger(maxParticipants) || maxParticipants < 1) {
            throw new AgentRuntimeError('INVALID_CAPACITY', 'Participant capacity must be a positive integer.');
        }
        this._maxParticipants = maxParticipants;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Registers once. Returns false for duplicate registration.
     *
     * @param participant - Participant to register in this runtime.
     * @returns True only when a new identity was inserted.
     * @throws {AgentRuntimeError} When inserting a new identity would exceed participant capacity.
     */
    public addParticipant(participant: ParticipantBase): boolean {
        if (this._participants.has(participant.id)) {
            return false;
        }
        if (this._participants.size >= this._maxParticipants) {
            throw new AgentRuntimeError('PARTICIPANT_CAPACITY', 'Runtime participant capacity was exceeded.');
        }
        this._participants = new Map([...this._participants, [participant.id, participant]]);
        return true;
    }
    /**
     * Removes membership without destroying application-owned memory.
     *
     * @param id - Stable identity to resolve or remove from the owning registry.
     * @returns True only when the identity was registered and removed.
     */
    public removeParticipant(id: string): boolean {
        if (!this._participants.has(id)) {
            return false;
        }
        const remaining = new Map(this._participants);
        remaining.delete(id);
        this._participants = remaining;
        return true;
    }
    /**
     * Returns a participant, or undefined when absent.
     *
     * @param id - Stable identity to resolve or remove from the owning registry.
     * @returns The currently registered participant for the supplied identity.
     */
    public getParticipant(id: string): ParticipantBase | undefined {
        return this._participants.get(id);
    }
    /**
     * Returns a membership snapshot in registration order.
     *
     * @returns A membership snapshot in registration order.
     */
    public getParticipants(): ReadonlyArray<ParticipantBase> {
        return [...this._participants.values()];
    }
    // #endregion
}
