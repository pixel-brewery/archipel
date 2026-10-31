---
title: 'Interface: IMfaSetup'
generated: true
editUrl: false
---

# Interface: IMfaSetup

Defined in: [libs/platform-authentication/src/models/IMfaSetup.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaSetup.ts#L6)

Represents the data required to onboard a multi-factor authenticator.

## Properties

### method

```ts
readonly method: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaSetup.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaSetup.ts#L17)

Identifies the MFA method being provisioned.

---

### otpauthUrl?

```ts
readonly otpauthUrl?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaSetup.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaSetup.ts#L22)

Contains the provisioning URI compatible with authenticator applications.

---

### quickResponseCodeDataUrl?

```ts
readonly quickResponseCodeDataUrl?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaSetup.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaSetup.ts#L27)

Provides a pre-rendered QR code in data URL form.

---

### secret?

```ts
readonly secret?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaSetup.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaSetup.ts#L12)

Contains the shared secret in Base32 format.
