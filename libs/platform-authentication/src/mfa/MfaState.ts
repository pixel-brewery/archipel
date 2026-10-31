/**
 * Represents per-channel MFA configuration persisted on the user.
 *
 * @public
 */
export interface IUserMfaChannelState {
    enabled: boolean;
    secret?: string;
    phoneNumber?: string;
    email?: string;
    codeHash?: string;
    codeExpiresAt?: string;
    lastSentAt?: string;
    verifiedAt?: string;
}

/**
 * Represents the full MFA state payload stored with the user.
 *
 * @public
 */
export interface IUserMfaState {
    preferredMethod?: string;
    channels: Record<string, IUserMfaChannelState>;
    trustedDevices?: string[];
}

/**
 * Optional channel-specific setup context.
 */
export interface IMfaSetupContext {
    phoneNumber?: string;
    email?: string;
}

/**
 * Normalizes a raw persisted MFA blob into a usable state object.
 *
 * @param raw Raw value from persistence.
 */
export function resolveMfaState(raw: unknown): IUserMfaState {
    if (raw && typeof raw === 'object' && 'channels' in (raw as Record<string, unknown>)) {
        const typed = raw as IUserMfaState;
        return {
            preferredMethod: typed.preferredMethod,
            channels: typed.channels ?? {},
            trustedDevices: typed.trustedDevices ?? [],
        };
    }

    return {
        channels: {},
        trustedDevices: [],
    };
}
