import type { IParticipantManifest } from '../interfaces/IParticipantManifest.js';
import type { ISituationHandler } from '../interfaces/ISituationHandler.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';

/**
 * Combines a stable participant identity with replaceable situation handlers.
 *
 * @public
 */
export abstract class ParticipantBase {
    // #region Fields

    private readonly _manifest: IParticipantManifest;

    private _handlers: ReadonlyArray<ISituationHandler>;

    // #endregion

    // #region Ctor

    /**
     * Initializes a participant identity and its reaction handlers.
     *
     * @param manifest - Nonblank identity and display name with descriptive participant metadata.
     * @param handlers - Initial event reactions; at most 128 handlers may be registered.
     * @throws {AgentRuntimeError} When identity is blank or the handler capacity is exceeded.
     */
    protected constructor(manifest: IParticipantManifest, handlers: ReadonlyArray<ISituationHandler> = []) {
        if (!manifest.id.trim() || !manifest.name.trim()) {
            throw new AgentRuntimeError('INVALID_PARTICIPANT', 'Participant identity and name are required.');
        }
        this._manifest = Object.freeze({ ...manifest, capabilities: Object.freeze([...(manifest.capabilities ?? [])]) });
        this._handlers = [];
        this.setHandlers(handlers);
    }

    // #endregion

    // #region Properties

    /**
     * Stable participant identifier.
     *
     * @returns The immutable identity supplied when the participant was created.
     */
    public get id(): string {
        return this._manifest.id;
    }

    // #endregion

    // #region Methods

    /**
     * Returns the immutable public manifest.
     *
     * @returns The immutable participant identity and descriptive capabilities.
     */
    public getManifest(): IParticipantManifest {
        return this._manifest;
    }

    /**
     * Returns a snapshot of registered handlers.
     *
     * @returns A snapshot of the current handler registrations.
     */
    public getHandlers(): ReadonlyArray<ISituationHandler> {
        return [...this._handlers];
    }

    /**
     * Atomically replaces handlers; existing dispatches keep their snapshot.
     *
     * @param handlers - Initial or replacement participant reaction handlers.
     * @throws {AgentRuntimeError} When the handler list exceeds the supported participant capacity.
     */
    public setHandlers(handlers: ReadonlyArray<ISituationHandler>): void {
        if (handlers.length > 128) {
            throw new AgentRuntimeError('HANDLER_CAPACITY', 'A participant may register at most 128 handlers.');
        }
        this._handlers = handlers.map((handler) => Object.freeze({ ...handler }));
    }

    // #endregion
}
