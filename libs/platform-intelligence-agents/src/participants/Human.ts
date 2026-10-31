import { randomUUID } from 'node:crypto';
import type { IHumanConfiguration } from '../interfaces/IHumanConfiguration.js';
import { ParticipantBase } from '../abstracts/ParticipantBase.js';

/**
 * Human participant that can send messages and react to semantic events.
 *
 * @public
 */
export class Human extends ParticipantBase {
    // #region Fields
    // #endregion

    // #region Ctor
    /**
     * Creates a human participant that can produce events and register reactions.
     *
     * @param configuration - Identity, descriptive capabilities and optional event reactions.
     * @throws {AgentRuntimeError} When identity or handler count is invalid.
     */
    public constructor(configuration: IHumanConfiguration) {
        super(
            { id: configuration.id ?? randomUUID(), name: configuration.name, role: 'human', capabilities: configuration.capabilities },
            configuration.handlers,
        );
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
