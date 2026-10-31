import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { AgentInferenceBase } from './abstracts/AgentInferenceBase.js';
import type { IAgentRuntimeOptions } from './interfaces/IAgentRuntimeOptions.js';
import { AgentRuntime } from './runtime/AgentRuntime.js';
import { AgentRuntimeError } from './errors/AgentRuntimeError.js';

/**
 * Creates explicitly owned runtimes and disposes them on application shutdown.
 *
 * @public
 */
@Injectable()
export class AgentRuntimeFactory implements OnModuleDestroy {
    // #region Fields
    private readonly _inference: AgentInferenceBase;
    private _runtimes: ReadonlySet<AgentRuntime> = new Set();
    private _closed = false;
    // #endregion

    // #region Ctor
    /**
     * Creates a lifecycle-managed factory using the configured inference adapter.
     *
     * @param inference - Adapter shared by the explicitly owned runtimes created by this factory.
     */
    public constructor(inference: AgentInferenceBase) {
        this._inference = inference;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Creates a runtime; consumers should dispose it at the end of its owner lifetime. Maximum 128 live runtimes.
     *
     * @param options - Explicit owner configuration and operation budgets.
     * @returns An explicitly owned runtime registered for application shutdown.
     * @throws {AgentRuntimeError} When the factory is closed or its runtime capacity is exhausted.
     */
    public create(options: IAgentRuntimeOptions = {}): AgentRuntime {
        if (this._closed || this._runtimes.size >= 128) {
            throw new AgentRuntimeError('RUNTIME_CAPACITY', 'Runtime factory is closed or at capacity.');
        }
        const runtime = new AgentRuntime(this._inference, options, () => {
            this._runtimes = new Set([...this._runtimes].filter((item) => item !== runtime));
        });
        this._runtimes = new Set([...this._runtimes, runtime]);
        return runtime;
    }
    /**
     * Disposes every owned runtime when the NestJS application shuts down.
     *
     * @returns Resolves when all runtime cleanup attempts have completed successfully.
     * @throws {AgentRuntimeError} When one or more runtimes fail their bounded cleanup.
     */
    public async onModuleDestroy(): Promise<void> {
        this._closed = true;
        const results = await Promise.allSettled([...this._runtimes].map((runtime) => runtime.dispose()));
        if (results.some((result) => result.status === 'rejected')) {
            throw new AgentRuntimeError('SHUTDOWN_FAILED', 'One or more runtimes could not drain during shutdown.');
        }
    }
    // #endregion
}
