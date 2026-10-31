---
title: 'Interface: ISignInResult'
generated: true
editUrl: false
---

# Interface: ISignInResult

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L6)

Represents the outcome of a sign-in attempt.

## Properties

### accessToken?

```ts
readonly accessToken?: string;
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L22)

Contains the issued access token when MFA is not required.

---

### challengeId?

```ts
readonly challengeId?: string;
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L27)

Contains the challenge identifier required to complete MFA.

---

### methods?

```ts
readonly methods?: readonly string[];
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L32)

Lists enabled MFA methods available for the challenge.

---

### mfaRequired

```ts
readonly mfaRequired: boolean;
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L12)

Indicates whether a multi-factor token is required.

---

### preferredMethod?

```ts
readonly preferredMethod?: string;
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L37)

Indicates the preferred MFA method.

---

### verificationRequired?

```ts
readonly verificationRequired?: boolean;
```

Defined in: [libs/platform-authentication/src/models/ISignInResult.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/ISignInResult.ts#L17)

Indicates whether email verification is required.
