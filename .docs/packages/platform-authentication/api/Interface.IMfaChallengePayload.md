---
title: 'Interface: IMfaChallengePayload'
generated: true
editUrl: false
---

# Interface: IMfaChallengePayload

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:6](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L6)

Represents the MFA challenge payload encoded in a challenge token.

## Properties

### clientName?

```ts
readonly clientName?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:37](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L37)

Optional client name associated with the login attempt.

---

### ipAddress

```ts
readonly ipAddress: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:22](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L22)

Captures the originating IP address for the challenge.

---

### location?

```ts
readonly location?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:32](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L32)

Optional location associated with the login attempt.

---

### type

```ts
readonly type: "mfa";
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:12](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L12)

Defines the token discriminator used to validate challenge tokens.

---

### userAgent?

```ts
readonly userAgent?: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:27](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L27)

Captures the originating user agent for the challenge.

---

### userId

```ts
readonly userId: string;
```

Defined in: [libs/platform-authentication/src/models/IMfaChallengePayload.ts:17](https://github.com/pixel-brewery/archipel/blob/main/libs/platform-authentication/src/models/IMfaChallengePayload.ts#L17)

Identifies the authenticated user.
