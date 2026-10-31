// #region Imports

import type { CompositionImport } from './CompositionImport.js';

// #endregion

/**
 * Represents the result of a provider composition decision.
 *
 * @public
 */
export interface IProviderDecision {
    /**
     * Whether the provider should be imported into the application module graph.
     *
     * @public
     */
    readonly shouldImport: boolean;

    /**
     * The modules to import when {@link shouldImport} is `true`.
     *
     * When {@link shouldImport} is `false`, this array should be empty or omitted.
     *
     * @public
     */
    readonly imports: ReadonlyArray<CompositionImport>;
}
