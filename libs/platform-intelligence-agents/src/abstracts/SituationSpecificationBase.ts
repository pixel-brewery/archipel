import type { ISituationContext } from '../interfaces/ISituationContext.js';

/**
 * Defines a composable predicate for selecting participant reactions.
 *
 * @public
 */
export abstract class SituationSpecificationBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Evaluates whether a participant should react to its current event.
     *
     * @param context - Semantic event and the participant receiving it.
     * @returns True when this predicate selects the situation.
     */
    public abstract isSatisfiedBy(context: ISituationContext): boolean;

    /**
     * Requires both predicates, with short-circuit evaluation.
     *
     * @param other - Other predicate to compose with this condition.
     * @returns A predicate requiring both conditions with short-circuit evaluation.
     */
    public and(other: SituationSpecificationBase): SituationSpecificationBase {
        return new AndSituationSpecification(this, other);
    }

    /**
     * Requires either predicate, with short-circuit evaluation.
     *
     * @param other - Other predicate to compose with this condition.
     * @returns A predicate accepting either condition with short-circuit evaluation.
     */
    public or(other: SituationSpecificationBase): SituationSpecificationBase {
        return new OrSituationSpecification(this, other);
    }

    /**
     * Negates this predicate.
     *
     * @returns A predicate that negates this condition.
     */
    public not(): SituationSpecificationBase {
        return new NotSituationSpecification(this);
    }

    // #endregion
}

/**
 * Requires both situation predicates, preserving short-circuit evaluation.
 *
 * @internal
 */
class AndSituationSpecification extends SituationSpecificationBase {
    // #region Fields
    private readonly _left: SituationSpecificationBase;
    private readonly _right: SituationSpecificationBase;
    // #endregion

    // #region Ctor
    /**
     * Combines two predicates that must both match.
     *
     * @param left - Predicate evaluated first.
     * @param right - Predicate evaluated only when the first predicate matches.
     */
    public constructor(left: SituationSpecificationBase, right: SituationSpecificationBase) {
        super();
        this._left = left;
        this._right = right;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Evaluates the second predicate only when the first predicate matches.
     *
     * @param context - Event and receiving participant to evaluate.
     * @returns True when both predicates match.
     */
    public override isSatisfiedBy(context: ISituationContext): boolean {
        return this._left.isSatisfiedBy(context) && this._right.isSatisfiedBy(context);
    }
    // #endregion
}

/**
 * Accepts either situation predicate, preserving short-circuit evaluation.
 *
 * @internal
 */
class OrSituationSpecification extends SituationSpecificationBase {
    // #region Fields
    private readonly _left: SituationSpecificationBase;
    private readonly _right: SituationSpecificationBase;
    // #endregion

    // #region Ctor
    /**
     * Combines two predicates where either match is sufficient.
     *
     * @param left - Predicate evaluated first.
     * @param right - Predicate evaluated only when the first predicate does not match.
     */
    public constructor(left: SituationSpecificationBase, right: SituationSpecificationBase) {
        super();
        this._left = left;
        this._right = right;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Evaluates the second predicate only when the first predicate does not match.
     *
     * @param context - Event and receiving participant to evaluate.
     * @returns True when either predicate matches.
     */
    public override isSatisfiedBy(context: ISituationContext): boolean {
        return this._left.isSatisfiedBy(context) || this._right.isSatisfiedBy(context);
    }
    // #endregion
}

/**
 * Inverts the result of one situation predicate.
 *
 * @internal
 */
class NotSituationSpecification extends SituationSpecificationBase {
    // #region Fields
    private readonly _rule: SituationSpecificationBase;
    // #endregion

    // #region Ctor
    /**
     * Negates a situation predicate.
     *
     * @param rule - Predicate whose result is inverted.
     */
    public constructor(rule: SituationSpecificationBase) {
        super();
        this._rule = rule;
    }
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods
    /**
     * Inverts the wrapped predicate result.
     *
     * @param context - Event and receiving participant to evaluate.
     * @returns True when the wrapped predicate does not match.
     */
    public override isSatisfiedBy(context: ISituationContext): boolean {
        return !this._rule.isSatisfiedBy(context);
    }
    // #endregion
}
