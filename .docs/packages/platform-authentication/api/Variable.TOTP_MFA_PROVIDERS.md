---
title: 'Variable: TOTP\_MFA\_PROVIDERS'
generated: true
editUrl: false
---

# Variable: TOTP\_MFA\_PROVIDERS

```ts
const TOTP_MFA_PROVIDERS: ReadonlyArray<Provider>;
```

Defined in: [libs/platform-authentication/src/mfa/totp/index.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/mfa/totp/index.ts#L27)

Providers required by the [TotpMfaChannel](Class.TotpMfaChannel).

Spread these into the `additionalProviders` option of `AuthModule.register()`
when enabling TOTP-based MFA.

## Example

```typescript
import { TotpMfaChannel, TOTP_MFA_PROVIDERS } from '@pixel-brewery/archipel-platform-authentication/mfa/totp';

AuthModule.register({
    mfaChannels: [TotpMfaChannel],
    additionalProviders: [...TOTP_MFA_PROVIDERS],
    // ...
});
```
