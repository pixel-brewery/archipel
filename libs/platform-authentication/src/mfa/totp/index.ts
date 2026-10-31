//#region Imports

import { OTP_SERVICE_TOKEN, OtpService } from '@pixel-brewery/archipel-platform-cryptography/otp';
import type { Provider } from '@nestjs/common';

//#endregion

/**
 * Providers required by the {@link TotpMfaChannel}.
 *
 * Spread these into the `additionalProviders` option of `AuthModule.register()`
 * when enabling TOTP-based MFA.
 *
 * @example
 * ```typescript
 * import { TotpMfaChannel, TOTP_MFA_PROVIDERS } from '@pixel-brewery/archipel-platform-authentication/mfa/totp';
 *
 * AuthModule.register({
 *   mfaChannels: [TotpMfaChannel],
 *   additionalProviders: [...TOTP_MFA_PROVIDERS],
 *   // ...
 * });
 * ```
 *
 * @public
 */
export const TOTP_MFA_PROVIDERS: ReadonlyArray<Provider> = [{ provide: OTP_SERVICE_TOKEN, useClass: OtpService }];

export { TotpMfaChannel } from '../channels/TotpMfaChannel.js';
