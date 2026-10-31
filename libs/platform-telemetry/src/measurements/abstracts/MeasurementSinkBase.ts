/** Destination for individual numeric measurements. */
export abstract class MeasurementSinkBase {
    // #region Fields
    // #endregion

    // #region Ctor
    // #endregion

    // #region Properties
    // #endregion

    // #region Methods

    public abstract record(name: string, value: number, attributes: Readonly<Record<string, string>>): void;

    public initialize(): Promise<void> | void {
        // Provider-specific startup is optional.
    }

    // #endregion
}
