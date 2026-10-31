// #region Imports

import { IMfaSetup } from '../models/index.js';
import { IMfaSetupContext } from './MfaState.js';

// #endregion

/**
 * Defines the contract each MFA channel must implement.
 *
 * @public
 */
export interface IMfaChannel {
    /**
     * Unique identifier of the MFA method (e.g., `totp`, `sms`, `email`).
     */
    readonly method: string;

    /**
     * Initializes the setup flow for the channel and persists any channel-specific bootstrap state.
     *
     * @param userId Identifier of the user starting setup.
     */
    initSetup(userId: string, context?: IMfaSetupContext): Promise<IMfaSetup>;

    /**
     * Verifies the first setup code and marks the channel as ready for challenges.
     *
     * The person is already signed in, so a failed setup rejects with a `400`
     * error such as `MfaSetupNotInitializedError`; only challenge failures answer `401`.
     *
     * @param userId Identifier of the user finishing setup.
     * @param code User supplied setup code.
     */
    verifySetup(userId: string, code: string): Promise<boolean>;

    /**
     * Verifies a challenge code during login.
     *
     * @param userId Identifier of the challenged user.
     * @param code User supplied challenge code.
     */
    verifyChallenge(userId: string, code: string): Promise<boolean>;

    /**
     * Issues or refreshes a one-time challenge code for out-of-band channels (SMS, email, push).
     * Channels that do not require pre-issued codes can implement this as a no-op.
     *
     * @param userId Identifier of the challenged user.
     */
    issueChallenge?(userId: string): Promise<void>;
}
