import { randomUUID } from 'node:crypto';
import type { IIntelligenceToolDefinition } from '@pixel-brewery/archipel-platform-intelligence';
import type { IAgentConfiguration } from '../interfaces/IAgentConfiguration.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';
import { ModelContext } from '../memory/ModelContext.js';
import { ParticipantBase } from '../abstracts/ParticipantBase.js';

/**
 * Defines an AI participant with its own instructions, tool catalog and conversation memory.
 *
 * @public
 */
export class Agent extends ParticipantBase {
    // #region Fields
    /**
     * Instructions applied to every provider request made for this agent.
     */
    public readonly instruction: string;
    /**
     * Immutable catalog of application tools available to this agent.
     */
    public readonly tools: Readonly<Record<string, IIntelligenceToolDefinition>>;
    /**
     * Bounded conversation shared across completed runs; each active run uses an independent fork.
     */
    public readonly memory: ModelContext;
    // #endregion

    // #region Ctor
    /**
     * Creates an AI participant with its own instructions, tool catalog and conversation.
     *
     * @param configuration - Identity, instructions, tools, memory and optional event reactions.
     * @throws {AgentRuntimeError} When identity, handler count or tool capacity is invalid.
     */
    public constructor(configuration: IAgentConfiguration) {
        super(
            { id: configuration.id ?? randomUUID(), name: configuration.name, role: 'agent', capabilities: configuration.capabilities },
            configuration.handlers,
        );
        const maxTools = configuration.maxTools ?? 128;
        if (!Number.isSafeInteger(maxTools) || maxTools < 1 || Object.keys(configuration.tools ?? {}).length > maxTools) {
            throw new AgentRuntimeError('TOOL_CAPACITY', 'Agent tool catalog capacity is invalid or exceeded.');
        }
        this.instruction = configuration.instruction;
        this.tools = Object.freeze(Object.fromEntries(Object.entries(configuration.tools ?? {}).map(([name, tool]) => [name, Object.freeze({ ...tool })])));
        this.memory = configuration.memory ?? new ModelContext();
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    // #endregion
}
