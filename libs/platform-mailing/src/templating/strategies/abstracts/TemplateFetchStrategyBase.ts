import type { IMailTemplateVariants } from '../../../models/IMailTemplateVariants.js';

/**
 * Represents the base class for template fetch strategies.
 *
 * @public
 * @abstract
 */
export abstract class TemplateFetchStrategyBase {
    // #region Fields
    // #endregion

    // #region Ctor

    /**
     * Initializes a new instance of the `TemplateFetchStrategyBase` class.
     *
     * @protected
     */
    protected constructor() {
        //
    }

    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    /**
     * Loads the templates.
     *
     * @public
     * @abstract
     */
    public abstract load(): Promise<Record<string, IMailTemplateVariants>>;

    // #endregion
}
