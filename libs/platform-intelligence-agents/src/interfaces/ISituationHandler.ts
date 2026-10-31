import type { SituationProcessorBase } from '../abstracts/SituationProcessorBase.js';
import type { SituationSpecificationBase } from '../abstracts/SituationSpecificationBase.js';

/**
 * A predicate and its reaction.
 *
 * @public
 */
export interface ISituationHandler {
    /**
     * Predicate that determines whether a participant should react.
     */
    readonly specification: SituationSpecificationBase;
    /**
     * Application-owned reaction invoked for a matching situation.
     */
    readonly processor: SituationProcessorBase;
}
