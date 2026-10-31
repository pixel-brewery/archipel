import { randomUUID } from 'node:crypto';
import type { IIntelligenceModelMessage } from '@pixel-brewery/archipel-platform-intelligence';
import type { IModelContextRecord } from '../interfaces/IModelContextRecord.js';
import { AgentRuntimeError } from '../errors/AgentRuntimeError.js';

/**
 * Maintains a bounded conversation with defensive snapshots and independent forks.
 *
 * @public
 */
export class ModelContext {
    // #region Fields
    /**
     * Stable conversation identifier preserved by forks and persistence records.
     */
    public readonly id: string;
    private _messages: ReadonlyArray<IIntelligenceModelMessage>;
    private readonly _maxMessages: number;
    // #endregion

    // #region Ctor
    /**
     * Restores an independent conversation or creates an empty one with a generated identity.
     *
     * @param record - Conversation identity and provider-neutral messages to copy.
     * @param maxMessages - Maximum retained message count; defaults to 512.
     * @throws {AgentRuntimeError} When identity, capacity or restored message count is invalid.
     */
    public constructor(record: IModelContextRecord = { id: randomUUID(), messages: [] }, maxMessages = 512) {
        if (!record.id || !Number.isSafeInteger(maxMessages) || maxMessages < 1 || record.messages.length > maxMessages) {
            throw new AgentRuntimeError('INVALID_CONTEXT', 'Context identity or capacity is invalid.');
        }
        this.id = record.id;
        this._maxMessages = maxMessages;
        this._messages = structuredClone(record.messages);
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Returns an isolated snapshot so callers cannot mutate another run.
     *
     * @returns An isolated snapshot of the conversation messages.
     */
    public getMessages(): ReadonlyArray<IIntelligenceModelMessage> {
        return structuredClone(this._messages);
    }
    /**
     * Appends a defensive message snapshot atomically without truncating tool-call/result pairs.
     *
     * @param messages - Provider-neutral messages to append in their existing order.
     * @throws {AgentRuntimeError} When the complete append would exceed conversation capacity.
     */
    public append(messages: ReadonlyArray<IIntelligenceModelMessage>): void {
        if (this._messages.length + messages.length > this._maxMessages) {
            throw new AgentRuntimeError('CONTEXT_CAPACITY', 'Conversation context capacity was exceeded.');
        }
        this._messages = [...this._messages, ...structuredClone(messages)];
    }
    /**
     * Creates an independent context for a concurrent loop.
     *
     * @returns An independent conversation with the same identity and capacity.
     */
    public fork(): ModelContext {
        return new ModelContext(this.record(), this._maxMessages);
    }
    /**
     * Serializes memory for an application-owned persistence adapter.
     *
     * @returns A defensive record suitable for consumer-owned persistence.
     */
    public record(): IModelContextRecord {
        return { id: this.id, messages: this.getMessages() };
    }
    // #endregion
}
