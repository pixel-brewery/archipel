import type { Type } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

/**
 * Creates an abstract connector base class for authentication providers.
 *
 * Extend this to implement a custom authentication connector with a required `validate` method.
 *
 * @internal
 * @param strategy - The underlying authentication strategy constructor.
 * @param name - Optional connector identifier (e.g. `'google'`, `'jwt'`).
 * @returns An abstract class with a required `validate` method.
 *
 * @example
 * ```typescript
 * import { ConnectorBase } from './abstracts/ConnectorBase.js';
 *
 * export class MyConnector extends ConnectorBase(Strategy, 'my-provider') {
 *     public override async validate(): Promise<IAuthSubject> { ... }
 * }
 * ```
 */
export function ConnectorBase<T extends Type<object>>(
    strategy: T,
    name?: string,
): abstract new (...args: unknown[]) => { validate(...args: unknown[]): Promise<unknown> } {
    // Passport injects the verification callback; each connector supplies its provider-specific constructor arguments.
    const Base = PassportStrategy(strategy, name) as unknown as new (...args: unknown[]) => object;

    /** Defines the validation behavior required by an authentication connector. */
    abstract class _ConnectorBase extends Base {
        // #region Fields
        // #endregion

        // #region Ctor
        // #endregion

        // #region Properties
        // #endregion

        // #region Methods

        /**
         * Validates the authentication attempt and returns the authenticated subject.
         *
         * @public
         * @param args - Provider-specific credentials or callback arguments.
         * @returns The authenticated subject produced by the concrete connector.
         */
        public abstract validate(...args: unknown[]): Promise<unknown>;

        // #endregion
    }

    return _ConnectorBase;
}
